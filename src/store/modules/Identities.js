import dbService, { dbFind } from '../../core/dbService';

const state = {
    Identities: []
}

const mutations = {
    FETCH_IDENTITIES(state, payload) {
        state.Identities = payload.identities
    },
    DELETE_IDENTITY(state, payload) {
        const identities = state.Identities.slice();
        const index = identities.findIndex((w) => w.ontid === payload.ontid)
        identities.splice(index, 1)
        state.Identities = identities;
    }
}

const actions = {
    async fetchIdentitiesFromDb({ commit }, pk) {
        try {
            const IdentityDocs = await dbFind(dbService, { type: 'Identity' });
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
