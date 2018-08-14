
const state = {
    detail: '',
    stakeWallet: '',
    stakeIdentity:''
}

const mutations = {
    UPDATE_STAKE_IDENTITY(state, payload) {
        state.stakeIdentity = payload.stakeIdentity
    },
    UPDATE_STAKE_WALLET() {
        state.stakeWallet = payload.stakeWallet
    }
}

const actions = {
    
}

export default {
    state,
    mutations,
    actions
}
