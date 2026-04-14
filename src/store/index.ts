import { createStore } from 'vuex'

import adminAuthModule, { type AdminAuthState } from './modules/adminAuth'
import cartModule, { type CartState } from './modules/cart'

export interface RootState {
  adminAuth: AdminAuthState
  cart: CartState
}

const store = createStore<RootState>({
  modules: {
    adminAuth: adminAuthModule,
    cart: cartModule,
  },
})

export default store
