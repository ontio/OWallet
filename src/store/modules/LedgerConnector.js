import { getDeviceInfo, getPublicKey } from '../../core/ontLedger'
import en from '../../lang/en'
import zh from '../../lang/zh'
import { Crypto } from 'ontology-ts-sdk'


function formatLedgerStatus(status) {
    const lang = localStorage.getItem('user_lang') || 'en'
    return lang === 'en' ? en.ledgerStatus[status] : zh.ledgerStatus[status]
}

function getDevice(commit, state) {
    // if(state.publicKey) {
    //     return;
    // }
     getDeviceInfo().then(res => {
        console.log('device: ' + res)
        getLedgerPublicKey(commit, state)
         commit('UPDATE_LEDGER_DEVICE_INFO', {deviceInfo: res});
    }).catch(err => {
        console.log(err)
        commit('UPDATE_LEDGER_PUBLICKEY', { publicKey: '' })
        const ledgerWallet = {
            address: '',
            publicKey: ''
        }
        commit('UPDATE_LEDGER_CONNECTOR_WALLET', {ledgerWallet})
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
    // if (state.publicKey) {
    //     return;
    // }
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
    const publicKey = new Crypto.PublicKey(pk);
    const address = Crypto.Address.fromPubKey(publicKey).toBase58();
    const ledgerWallet = {
        publicKey: pk,
        address: address
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

const LEDGER_CONNECTOR_INTERVAL = 'ledger_connector_intervalId'

const actions = {
    getLedgerStatus({dispatch,commit,state}, interval) {
        let time = interval || 5000;
        getDevice(commit, state)
        const intervalId = setInterval(() => {
            getDevice(commit, state)
        }, time)
        localStorage.setItem(LEDGER_CONNECTOR_INTERVAL, intervalId)
    },
    stopGetLedgerStatus({commit, state}) {
        const intervalId = localStorage.getItem(LEDGER_CONNECTOR_INTERVAL) || ''
        clearInterval(intervalId)
        localStorage.removeItem(LEDGER_CONNECTOR_INTERVAL)
        commit('UPDATE_LEDGER_PUBLICKEY', {publicKey: ''})
    }
}

export default {
    state,
    mutations,
    actions
}
