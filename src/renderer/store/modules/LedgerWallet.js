import { wallet } from '@cityofzion/neon-js'

const state = {
  publicKey: '',
  address: '',
  isHardwareLogin: true
}

const mutations = {
  LOGIN_WITH_LEDGER (state, payload) {
    state.publicKey = payload.publicKeyEncoded
    state.address = payload.address
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  },
  loginWithLedger ({ commit }, pk) {
    const publicKeyEncoded = wallet.getPublicKeyEncoded(pk)
    const account = new wallet.Account(publicKeyEncoded)
    localStorage.setItem('publicKey', publicKeyEncoded)
    localStorage.setItem('address', account.address)
    commit('LOGIN_WITH_LEDGER', {publicKeyEncoded, address: account.address})
    return true
  },
  createLedgerWalletWithPk ({commit}, pk) {
    const publicKeyEncoded = wallet.getPublicKeyEncoded(pk)
    const account = new wallet.Account(publicKeyEncoded)
    const ledgerWallet = {
      publicKey: publicKeyEncoded,
      address: account.address
    }
    return ledgerWallet
  }
}

export default {
  state,
  mutations,
  actions
}
