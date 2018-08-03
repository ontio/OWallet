import dbService, {findWallet} from '../../../core/dbService';

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
    }
}

const actions = {
    async fetchWalletsFromDb({ commit }, pk) {
        const NormalWallet = await findWallet(dbService.wallet, {});
        const SharedWallet = await findWallet(dbService.sharedWallet, {});
        const HardwareWallet = await findWallet(dbService.hardwareWallet, {});
        commit('FETCH_WALLETS', { NormalWallet, SharedWallet, HardwareWallet });
        return true;
    }
}

export default {
    state,
    mutations,
    actions
}
