import dbService, {dbFind} from '../../../core/dbService';

const state = {
    NormalWallet:[],
    SharedWallet: [],
    HardwareWallet: []
}

const mutations = {
    FETCH_WALLETS(state, payload) {
        state.NormalWallet = payload.NormalWallet;
        state.SharedWallet = payload.SharedWallet;
        state.HardwareWallet = payload.HardwareWallet;
    },
    DELETE_COMMON_WALLET(state, payload) {
        const normalWallet = state.NormalWallet.slice();
        const index = normalWallet.findIndex((w) => w.address === payload.address )
        normalWallet.splice(index,1)
        state.NormalWallet = normalWallet;
    },
    DELETE_SHARED_WALLET(state, payload) {
        const normalWallet = state.SharedWallet.slice();
        const index = normalWallet.findIndex((w) => w.sharedWalletAddress === payload.address)
        normalWallet.splice(index, 1)
        state.SharedWallet = normalWallet;
    },
    DELETE_HARDWARE_WALLET(state, payload) {
        const normalWallet = state.HardwareWallet.slice();
        const index = normalWallet.findIndex((w) => w.address === payload.address)
        normalWallet.splice(index, 1)
        state.HardwareWallet = normalWallet;
    }
}

const actions = {
    async fetchWalletsFromDb({ commit }, pk) {
        try {
            const NormalWalletDocs = await dbFind(dbService, {type:'CommonWallet'});
            const SharedWalletDocs = await dbFind(dbService, {type:'SharedWallet'});
            const HardwareWalletDocs = await dbFind(dbService, {type:'HardwareWallet'});
            const NormalWallet = NormalWalletDocs.map(item => item.wallet)
            const SharedWallet = SharedWalletDocs.map(item => item.wallet)
            const HardwareWallet = HardwareWalletDocs.map(item => item.wallet)
            commit('FETCH_WALLETS', { NormalWallet, SharedWallet, HardwareWallet });
        }catch(err) {
            alert(err)
        }
        return true;
    }
}


export default {
    state,
    mutations,
    actions
}
