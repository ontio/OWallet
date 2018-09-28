import { wallet } from '@cityofzion/neon-js'
import { WALLET_TYPE} from '../../../core/consts'
import dbService from '../../../core/dbService'
const state = {
    publicKey: '',
    address: '',
    isHardwareLogin: true
}

const mutations = {
    LOGIN_WITH_LEDGER(state, payload) {
        state.publicKey = payload.publicKeyEncoded;
        state.address = payload.address;
    }
}

const actions = {
    someAsyncTask({ commit }) {
        // do something async
        commit('INCREMENT_MAIN_COUNTER')
    },
    loginWithLedger({ commit }, pk) {
        const publicKeyEncoded = wallet.getPublicKeyEncoded(pk);
        const account = new wallet.Account(publicKeyEncoded); 
        const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'))
        if(currentWallet.address !== account.address) {
            return false;
        } else {
            commit('LOGIN_WITH_LEDGER', { publicKeyEncoded, address: account.address })
            return true;
        }
        
    },
    createLedgerWalletWithPk({commit}, body) {
        const publicKeyEncoded = wallet.getPublicKeyEncoded(body.pk);
        const account = new wallet.Account(publicKeyEncoded);
        const ledgerWallet =  {
                publicKey: publicKeyEncoded,
                address: account.address,
                neo: body.neo || false
            }
        return ledgerWallet;
    }
}

export default {
    state,
    mutations,
    actions
}
