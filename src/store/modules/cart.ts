import type { ActionContext } from 'vuex'

import type { CatalogCategory } from '@/data/userMenuItems'

const CART_STORAGE_KEY = 'ramen_cart_items'

export interface CartItem {
  id: string
  name: string
  price: string
  category: CatalogCategory
  image: string
  quantity: number
}

export interface CartState {
  items: CartItem[]
}

interface AddItemPayload {
  item: Omit<CartItem, 'quantity'>
  quantity?: number
}

interface UpdateQuantityPayload {
  id: string
  quantity: number
}

function isValidCategory(value: unknown): value is CatalogCategory {
  return value === 'Ramen' || value === 'Drinks' || value === 'Sides'
}

function parsePriceToNumber(price: string): number {
  const normalized = price.replace(/[^0-9.]/g, '')
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseCartItems(raw: string | null): CartItem[] {
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((item): item is CartItem => {
      return (
        typeof item?.id === 'string' &&
        typeof item?.name === 'string' &&
        typeof item?.price === 'string' &&
        typeof item?.image === 'string' &&
        typeof item?.quantity === 'number' &&
        item.quantity > 0 &&
        isValidCategory(item?.category)
      )
    })
  } catch {
    return []
  }
}

function getInitialCartState(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  return parseCartItems(localStorage.getItem(CART_STORAGE_KEY))
}

function persistCartState(items: CartItem[]): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

type CartActionContext = ActionContext<CartState, unknown>

const cartModule = {
  namespaced: true,

  state: (): CartState => ({
    items: getInitialCartState(),
  }),

  getters: {
    items: (state: CartState): CartItem[] => state.items,
    totalItems: (state: CartState): number => state.items.reduce((acc, item) => acc + item.quantity, 0),
    totalAmount: (state: CartState): number => {
      return state.items.reduce((acc, item) => acc + parsePriceToNumber(item.price) * item.quantity, 0)
    },
  },

  mutations: {
    setItems(state: CartState, items: CartItem[]) {
      state.items = items
    },

    addItem(state: CartState, payload: AddItemPayload) {
      const quantity = payload.quantity ?? 1
      const sanitizedQuantity = Math.max(1, Math.min(99, quantity))
      const existing = state.items.find((item) => item.id === payload.item.id)

      if (existing) {
        existing.quantity = Math.min(99, existing.quantity + sanitizedQuantity)
        return
      }

      state.items.push({
        ...payload.item,
        quantity: sanitizedQuantity,
      })
    },

    removeItem(state: CartState, id: string) {
      state.items = state.items.filter((item) => item.id !== id)
    },

    updateItemQuantity(state: CartState, payload: UpdateQuantityPayload) {
      const item = state.items.find((cartItem) => cartItem.id === payload.id)
      if (!item) return

      if (payload.quantity <= 0) {
        state.items = state.items.filter((cartItem) => cartItem.id !== payload.id)
        return
      }

      item.quantity = Math.min(99, payload.quantity)
    },

    clearCart(state: CartState) {
      state.items = []
    },
  },

  actions: {
    addItemToCart({ commit, state }: CartActionContext, payload: AddItemPayload) {
      commit('addItem', payload)
      persistCartState(state.items)
    },

    removeFromCart({ commit, state }: CartActionContext, id: string) {
      commit('removeItem', id)
      persistCartState(state.items)
    },

    updateCartItemQuantity({ commit, state }: CartActionContext, payload: UpdateQuantityPayload) {
      commit('updateItemQuantity', payload)
      persistCartState(state.items)
    },

    clearCart({ commit }: CartActionContext) {
      commit('clearCart')
      persistCartState([])
    },

    restoreCart({ commit }: CartActionContext) {
      commit('setItems', getInitialCartState())
    },
  },
}

export default cartModule
