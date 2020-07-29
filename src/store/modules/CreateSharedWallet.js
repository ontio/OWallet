import axios from 'axios';
import { ONT_PASS_NODE, ONT_PASS_NODE_PRD, ONT_PASS_URL } from '../../core/consts'
import dbService from '../../core/dbService'
const state = {
    currentStep: 0,
    label: '',
    address: '',
    copayers: [
        { name: '', publickey: ''},
        { name: '', publickey: '' }
    ],
    requiredSigNum:2
}

const mutations = {
    CREATE_SHARED_WALLET(state, payload) {
        state.label = payload.sharedWalletName,
            state.address = payload.sharedWalletAddress
    },

    UPDATE_CREATE_SHARED_LABEL(state, payload) {
        state.label = payload.label;
    },
    UPDATE_REQUIRED_SIG_NUMBER(state, payload) {
        state.requiredSigNum = payload.requiredSigNum;
    },
    ADD_CREATE_SHARED_STEP(state, payload) {
        state.currentStep += 1;
    },
    SUB_CREATE_SHARED_STEP(state, payload) {
        if(state.currentStep > 0) {
            state.currentStep -= 1;
        }
    },
    UPDATE_CREATE_SHARED_COPAYERS(state, payload) {
        state.copayers = payload.copayers
    },
    CLEAR_CREATE_SHARED_STATE(state,payload) {
        state.currentStep = 0;
        state.label = '';
        state.address = '';
        state.copayers = [
            { name: '', publickey: '' },
            { name: '', publickey: '' }
        ],
        state.requiredSigNum = 2;
    }
}

const actions = {
    createSharedWallet({ commit, dispatch }, body) {
        const net = localStorage.getItem('net')
        const ontPassNode = net === 'TEST_NET' ? ONT_PASS_NODE : ONT_PASS_NODE_PRD
        dispatch('showLoadingModals')
        return axios.post(ontPassNode + ONT_PASS_URL.CreateSharedWallet, body).then(res => {
            if (res.status === 200 && res.data.Error === 0) {
                commit('CREATE_SHARED_WALLET', {
                    label: body.sharedWalletName,
                    address: body.sharedWalletAddress
                })
                //save to db
                const wallet = {
                    type: 'SharedWallet',
                    address: body.sharedWalletAddress,
                    wallet: body
                }
                dbService.insert(wallet);
                dispatch('hideLoadingModals')
                return res.data.Error;
            } else {
                dispatch('hideLoadingModals')
                return res.data.Error;
            }
        }).catch(err => {
            console.log(err)
            dispatch('hideLoadingModals')
            return err;
        })
    }
}

export default {
    state,
    mutations,
    actions
}
