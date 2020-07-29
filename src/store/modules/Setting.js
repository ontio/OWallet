import dbService, { dbFind } from '../../core/dbService';

const net = localStorage.getItem('net');
const state = {
    network:net,
    connected: false
}

const mutations = {
    UPDATE_SETTING_NETWORK(state, payload) {
        state.network = payload.network
    },
    NETWORK_CONNECTED(state, payload) {
        state.connected = true;
    },
    NETWORK_DISCONNECTED(state, payload) {
        state.connected = false;
    }
}

const actions = {

}

export default {
    state,
    mutations,
    actions
}
