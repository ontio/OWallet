import { utils } from 'ontology-ts-sdk'
import axios from 'axios';

const state = {
    sesameseed: { // for node user
        votes: 0,
        pendingWithdrawals: 0
    }
}

const mutations = {
    UPDATE_CURRENT_SS_PEER(state, payload) {
        state.sesameseed = {
            votes: payload.votes,
            pendingWithdrawals: payload.pendingWithdrawals
        }
    }
}

const actions = {
    async fetchSSPerInfo({ commit }, address) {
        try {
            const baseUrl = 'https://api.sesameseed.org/voting/v1/address/'

            const pendingWithdrawalsPromise = axios.get(baseUrl + 'unstaked/' + address)
            const votesPromise = axios.get(baseUrl + 'staked/' + address)

            const [pendingWithdrawalsResponse, votesResponse] = await Promise.all([pendingWithdrawalsPromise, votesPromise])

            let votes = 0
            let pendingWithdrawals = 0

            if (pendingWithdrawalsResponse.status === 200 && pendingWithdrawalsResponse.data) {
                const resultPending = pendingWithdrawalsResponse.data
                pendingWithdrawals = resultPending.value ? resultPending.value : 0
            }

            if (votesResponse.status === 200 && votesResponse.data) {
                const resultVotes = votesResponse.data
                votes = resultVotes.value ? resultVotes.value : 0
            }

            commit('UPDATE_CURRENT_SS_PEER', { votes, pendingWithdrawals })
            return { votes, pendingWithdrawals };
        } catch (err) {
            console.log(err)
            return 0;
        }
    }
}

export default {
    state,
    mutations,
    actions
}
