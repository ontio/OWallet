import { Crypto } from 'ontology-ts-sdk'
import { WALLET_TYPE} from '../../../core/consts'
import dbService from '../../../core/dbService'
const state = {
    publicKey: '',
    address: '',
    isHardwareLogin: true
}

const mutations = {
    LOGIN_WITH_LEDGER(state, payload) {
        state.publicKey = payload.publicKey;
        state.address = payload.address;
    }
}

const actions = {
    someAsyncTask({ commit }) {
        // do something async
        commit('INCREMENT_MAIN_COUNTER')
    },
    loginWithLedger({ commit }, pk) {
        const publicKey = new Crypto.PublicKey(pk);
        const address = Crypto.Address.fromPubKey(publicKey).toBase58();
        const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'))
        if(currentWallet.address !== address) {
            return false;
        } else {
            commit('LOGIN_WITH_LEDGER', { publicKey:pk, address })
            return true;
        }
    },
    createLedgerWalletWithPk({commit}, body) {
        const publicKey = new Crypto.PublicKey(body.pk);
        const address = Crypto.Address.fromPubKey(publicKey).toBase58();
        const ledgerWallet =  {
                publicKey: body.pk,
                address,
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
