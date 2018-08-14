import dbService, { findWallet } from '../../../core/dbService'

const state = {
  NormalWallet: [],
  SharedWallet: [],
  HardwareWallet: []
}

const mutations = {
  FETCH_WALLETS (state, payload) {
    state.NormalWallet = payload.NormalWallet
    state.SharedWallet = payload.SharedWallet
    state.HardwareWallet = payload.HardwareWallet
  }
}

const actions = {
  async fetchWalletsFromDb ({commit}, pk) {
    try {
      const NormalWalletDocs = await findWallet(dbService, {type: 'CommonWallet'})
      const SharedWalletDocs = await findWallet(dbService, {type: 'SharedWallet'})
      const HardwareWalletDocs = await findWallet(dbService, {type: 'HardwareWallet'})
      const NormalWallet = NormalWalletDocs.map(item => item.wallet)
      const SharedWallet = SharedWalletDocs.map(item => item.wallet)
      const HardwareWallet = HardwareWalletDocs.map(item => item.wallet)
      commit('FETCH_WALLETS', {NormalWallet, SharedWallet, HardwareWallet})
    } catch (err) {
      alert(err)
    }
    return true
  }
}

export default {
  state,
  mutations,
  actions
}
