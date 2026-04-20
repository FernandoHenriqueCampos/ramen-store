const SALES_STORAGE_KEY = 'ramen_sales_orders'

type SaleChannel = 'Counter' | 'Delivery' | 'App'
type SaleCategory = 'Ramen' | 'Drinks' | 'Sides'

type SoldItemInput = {
  id: string
  name: string
  quantity: number
  unitPrice: number
  category: SaleCategory
}

type SaleOrder = {
  id: string
  createdAt: string
  total: number
  items: SoldItemInput[]
  channel: SaleChannel
}

function parseStoredOrders(raw: string | null): SaleOrder[] {
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as SaleOrder[]
  } catch {
    return []
  }
}

export function appendSaleOrder(payload: {
  items: SoldItemInput[]
  total: number
  channel?: SaleChannel
}): void {
  if (typeof window === 'undefined') return
  if (!payload.items.length) return

  const existing = parseStoredOrders(localStorage.getItem(SALES_STORAGE_KEY))
  const now = new Date()

  const newOrder: SaleOrder = {
    id: `sale-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: now.toISOString(),
    total: Number(payload.total.toFixed(2)),
    items: payload.items,
    channel: payload.channel ?? 'App',
  }

  localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify([newOrder, ...existing]))
}
