import axios from 'axios';
import { ONT_PASS_NODE, ONT_PASS_URL } from '../../../core/consts'
import dbService from '../../../core/dbService'
const state = {
    currentStep: 0,
    localCopayers: [],
    sharedWallet:{}
}

const mutations = {
    ADD_IMPORT_SHARED_STEP(state, payload) {
        state.currentStep += 1;
    },
    SUB_IMPORT_SHARED_STEP(state, payload) {
        if (state.currentStep > 0) {
            state.currentStep -= 1;
        }
    },
    UPDATE_LOCAL_COPAYERS(state, payload) {
        state.localCopayers = payload.localCopayers
    },
    UPDATE_SHARED_WALLET(state, payload) {
        state.sharedWallet = payload.sharedWallet;
    },
    CLEAR_IMPORT_SHARED_STATE(state, payload) {
        state.currentStep = 0;
        state.sharedWallet = {}
    }
}

const actions = {
    
}

export default {
    state,
    mutations,
    actions
}