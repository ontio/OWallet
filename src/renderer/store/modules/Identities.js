import dbService, { findWallet } from '../../../core/dbService';

const state = {
    Identities: []
}

const mutations = {
    FETCH_IDENTITIES(state, payload) {
        state.Identities = payload.identities
    }
}

const actions = {
    async fetchIdentitiesFromDb({ commit }, pk) {
        try {
            const IdentityDocs = await findWallet(dbService, { type: 'Identity' });
            const identities = IdentityDocs.map(item => item.wallet)
            
            commit('FETCH_IDENTITIES', { identities });
        } catch (err) {
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
