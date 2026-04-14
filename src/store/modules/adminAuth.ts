import type { ActionContext } from 'vuex'

const ADMIN_AUTH_KEY = 'ramen_admin_auth'

export interface AdminAuthState {
  isAuthenticated: boolean
}

interface LoginPayload {
  username: string
  password: string
}

function getInitialAuthState(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return localStorage.getItem(ADMIN_AUTH_KEY) === '1'
}

function persistAuthState(isAuthenticated: boolean): void {
  if (typeof window === 'undefined') {
    return
  }

  if (isAuthenticated) {
    localStorage.setItem(ADMIN_AUTH_KEY, '1')
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY)
  }
}

type AdminAuthActionContext = ActionContext<AdminAuthState, unknown>

const adminAuthModule = {
  namespaced: true,

  state: (): AdminAuthState => ({
    isAuthenticated: getInitialAuthState(),
  }),

  getters: {
    isAuthenticated: (state: AdminAuthState): boolean => state.isAuthenticated,
  },

  mutations: {
    setAuthenticated(state: AdminAuthState, isAuthenticated: boolean) {
      state.isAuthenticated = isAuthenticated
    },
  },

  actions: {
    login({ commit }: AdminAuthActionContext, payload: LoginPayload): boolean {
      const isValid = payload.username === 'admin' && payload.password === 'admin'
      commit('setAuthenticated', isValid)
      persistAuthState(isValid)
      return isValid
    },

    logout({ commit }: AdminAuthActionContext) {
      commit('setAuthenticated', false)
      persistAuthState(false)
    },
  },
}

export default adminAuthModule
