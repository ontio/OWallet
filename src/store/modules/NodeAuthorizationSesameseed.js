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
            const baseUrl = 'https://dappnode1.ont.io:10334/api/v1/storage/a63c33d2209854feafbf40685a33d4846ee82556/'

            const hexAddress = utils.str2hexstr(address)
            const pendingHexAddress = utils.str2hexstr('1' + address)

            const pendingWithdrawalsPromise = axios.get(baseUrl + pendingHexAddress)
            const votesPromise = axios.get(baseUrl + hexAddress)

            const [pendingWithdrawalsResponse, votesResponse] = await Promise.all([pendingWithdrawalsPromise, votesPromise])

            let votes = 0
            let pendingWithdrawals = 0

            if (pendingWithdrawalsResponse.status === 200 && pendingWithdrawalsResponse.data) {
                const resultPending = pendingWithdrawalsResponse.data
                const pendingWithdrawalsHex = resultPending.Result ? resultPending.Result : 0
                const reversedHex = pendingWithdrawalsHex.toString().length > 2 ? utils.reverseHex(pendingWithdrawalsHex) : pendingWithdrawalsHex
                pendingWithdrawals = parseInt(reversedHex, 16)
            }

            if (votesResponse.status === 200 && votesResponse.data) {
                const resultVotes = votesResponse.data
                const votesHex = resultVotes.Result ? resultVotes.Result : 0
                const reversedHex = votesHex.toString().length > 2 ? utils.reverseHex(votesHex) : votesHex
                votes = parseInt(reversedHex, 16)
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
