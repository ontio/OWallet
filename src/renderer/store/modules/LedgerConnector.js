import { getDeviceInfo, getPublicKey } from '../../../core/ontLedger'
import en from '../../../common/lang/en'
import zh from '../../../common/lang/zh'
import { wallet } from '@cityofzion/neon-js'


function formatLedgerStatus(status) {
    const lang = localStorage.getItem('user_lang') || 'en'
    return lang === 'en' ? en.ledgerStatus[status] : zh.ledgerStatus[status]
}

function getDevice(commit, state) {
    if(state.publicKey) {
        return;
    }
     getDeviceInfo().then(res => {
        console.log('device: ' + res)
        getLedgerPublicKey(commit, state)
         commit('UPDATE_LEDGER_DEVICE_INFO', {deviceInfo: res});
    }).catch(err => {
        console.log(err)
        commit('UPDATE_LEDGER_PUBLICKEY', {publicKey: ''})
        if (err === 'NOT_FOUND') {
            commit('UPDATE_LEDGER_STATUS', { ledgerStatus: formatLedgerStatus('NOT_FOUND')})
        } else if (err === 'NOT_SUPPORT') {
            commit('UPDATE_LEDGER_STATUS', { ledgerStatus: formatLedgerStatus('NOT_SUPPORT') })            
        } else {
            commit('UPDATE_LEDGER_STATUS', { ledgerStatus: formatLedgerStatus('NO_DEVICE') })
        }
    })
}

function getLedgerPublicKey(commit, state) {
    if (state.publicKey) {
        return;
    }
    getPublicKey().then(res => {
        console.log('pk info: ' + res);
        commit('UPDATE_LEDGER_PUBLICKEY', { publicKey: res })        
        commit('UPDATE_LEDGER_STATUS', { ledgerStatus: formatLedgerStatus('READY') })
        getLedgerWallet(commit, res)
    }).catch(err => {
        console.log(err.message)
        commit('UPDATE_LEDGER_STATUS', { ledgerStatus: formatLedgerStatus('NOT_OPEN') })        
    })
}

function getLedgerWallet(commit, pk) {
    const publicKeyEncoded = wallet.getPublicKeyEncoded(pk);
    const account = new wallet.Account(publicKeyEncoded);
    const ledgerWallet = {
        publicKey: publicKeyEncoded,
        address: account.address
    }
    commit('UPDATE_LEDGER_CONNECTOR_WALLET', {ledgerWallet: ledgerWallet})
}
const state = {
    ledgerStatus: '',
    deviceInfo: '',
    publicKey: '',
    intervalId:'',
    ledgerWallet: {
        address: '',
        publicKey: ''
    }
}

const mutations = {
    UPDATE_LEDGER_DEVICE_INFO(state, payload){
        state.deviceInfo = payload.deviceInfo
    },
    UPDATE_LEDGER_PUBLICKEY(state, payload) {
        state.publicKey = payload.publicKey
    },
    UPDATE_LEDGER_STATUS(state, payload) {
        state.ledgerStatus = payload.ledgerStatus
    },
    UPDATE_LEDGER_CONNECTOR_INTERVALID(state, payload) {
        state.intervalId = payload.intervalId
    },
    UPDATE_LEDGER_CONNECTOR_WALLET(state, payload) {
        state.ledgerWallet = payload.ledgerWallet;
    }
}

const actions = {
    getLedgerStatus({dispatch,commit,state}, interval) {
        let time = interval || 1000;
        getDevice(commit, state)
        const intervalId = setInterval(() => {
            getDevice(commit, state)
        }, time)
        commit('UPDATE_LEDGER_CONNECTOR_INTERVALID', {intervalId: intervalId})
    },
    stopGetLedgerStatus({commit, state}) {
        clearInterval(state.intervalId)
    }
}

export default {
    state,
    mutations,
    actions
}
