import { createStore } from 'vuex'

import adminAuthModule, { type AdminAuthState } from './modules/adminAuth'

export interface RootState {
  adminAuth: AdminAuthState
}

const store = createStore<RootState>({
  modules: {
    adminAuth: adminAuthModule,
  },
})

export default store
