import axios from 'axios'
import en from '../../../common/lang/en'
import zh from '../../../common/lang/zh'
import { ONT_PASS_NODE, ONT_PASS_NODE_PRD, ONT_PASS_URL, QUERY_NODE_INFO_API, 
    UPDATE_NODE_INFO_API, UPDATE_LEDGER_NODE_INFO_API } from '../../../core/consts'

const state = {
    detail: {
        publickey: ''
    },
    nodePublicKey: '',
    stakeWallet: {
        address: '',
        key: ''
    },
    stakeIdentity: {
        ontid: ''
    },
    status: '',
    status1: '',
    status2: '',
    status3: '',
    current: 0,
    statusTip: '',
    btnText: '',
    menuTabIndex: 1
}

const mutations = {
    UPDATE_STAKE_IDENTITY(state, payload) {
        state.stakeIdentity = payload.stakeIdentity
    },
    UPDATE_STAKE_WALLET(state, payload) {
        state.stakeWallet = payload.stakeWallet
    },
    UPDATE_NODE_PUBLICKEY(state, payload) { 
        state.nodePublicKey = payload.nodePublicKey
    },
    UPDATE_NODE_STATUS(state, payload) { 
        state.status = payload.status
    },
    UPDATE_STAKE_STATUS(state, payload) {
        state.status1 = payload.status1
        state.status2 = payload.status2
        state.status3 = payload.status3 
        state.current = payload.current
        state.statusTip = payload.statusTip     
    },
    UPDATE_STAKE_DETAIL(state, payload) {
        state.detail = payload.detail
    },
    UPDATE_MENU_TAB_INDEX(state, index) {
        state.menuTabIndex = index
    }
}

function formatStatusText(status){
    const lang = localStorage.getItem('user_lang') || 'en'
    return lang === 'en' ? en.nodeStakeStatus[status] : zh.nodeStakeStatus[status]
}

function getStatus(status) {
    let status1 = '',
        status2 = '',
        status3 = '',
        current = 0,
        statusTip = '',
        btnText = ''
    switch (status) {
        case 0: // 没了
             status1 = formatStatusText('transfering')
             status2 = formatStatusText('audit')
             status3 = formatStatusText('stake')
             current = 0
             statusTip = formatStatusText('transferNeedTime')
            break;
        case 1: // 没了
             status1 = formatStatusText('transferFailed')
             status2 = formatStatusText('audit')
             status3 = formatStatusText('stake')
             statusTip = ''
             current = 0
            break;
        case 2: // 没了
             status1 = formatStatusText('transfered')
             status2 = formatStatusText('auditing')
             status3 = formatStatusText('stake')
             statusTip = formatStatusText('auditNeedTime')
             current = 1            
            break;
        case 3: // 没了
             status1 = formatStatusText('transfered')
             status2 = formatStatusText('auditFailed')
             status3 = formatStatusText('stake')
             statusTip = ''
             current = 1
            break;
        case 4: // 没了
             status1 = formatStatusText('nodeExited')
             status2 = formatStatusText('refund')
             status3 = formatStatusText('quitStake')
             statusTip = formatStatusText('unfrozenToRefund')
             current = 0
            break;
        case 5: 
             status1 = formatStatusText('nodeExited')
             status2 = formatStatusText('refunding')
             status3 = formatStatusText('quitStake')
             current = 1
             statusTip = formatStatusText('refundNeedTime')
            break;
        case 6:
             status1 = formatStatusText('nodeExited')
             status2 = formatStatusText('refunded')
             status3 = formatStatusText('stakeExited')
             current = 2
             statusTip = ''
            break;
        case 7:
             status1 = formatStatusText('nodeExited')
             status2 = formatStatusText('refundFailed')
             status3 = formatStatusText('stakeExited')
             current = 1
            statusTip = ''
            break;
        case 8:
             status1 = formatStatusText('transfered')
             status2 = formatStatusText('audited')
             status3 = formatStatusText('staked')
             current = 2
            statusTip = ''
            break;
        case 9:
             status1 = formatStatusText('nodeExited')
             status2 = formatStatusText('refund')
             status3 = formatStatusText('quitStake')
             current = 0
            statusTip = ''
            break;
        case 10:
            status1 = formatStatusText('nodeExited')
             status2 = formatStatusText('refund')
             status3 = formatStatusText('quitStake')
             current = 0
            statusTip = ''
            break;

        default:
            break;
    }
    return {
        status1, status2, status3, current, statusTip
    }
}

const actions = {
    fetchStakeDetail({commit}, {address, public_key}){
        const net = localStorage.getItem("net");
        const ontPassNode =
            net === "TEST_NET" ? ONT_PASS_NODE : ONT_PASS_NODE_PRD;
        axios.get(ontPassNode + ONT_PASS_URL.GetStakeInfo, {
            params: {
               address,
               publickey: public_key
            }
        }).then(res => {
            commit('UPDATE_STAKE_DETAIL', { detail:res.data})
            const status = getStatus(res.data.status);
            commit('UPDATE_STAKE_STATUS', status)
            return res.data;
        })
        // const status = getStatus(2);
        // commit('UPDATE_STAKE_STATUS', status)
    },
    async fetchNodeInfo({ }, public_key) {
        const net = localStorage.getItem("net");
        const url = QUERY_NODE_INFO_API[net]
        const res = await axios.get(url, {
            params: {
                public_key
            }
        })
        return res.data.result
    },
    async updateNodeInfo({ }, info) {
        const net = localStorage.getItem("net");
        const url = UPDATE_NODE_INFO_API[net]
        const res = await axios.post(url, info)
        return res.data
    },
    async updateLedgerNodeInfo({ }, info) {
        const net = localStorage.getItem("net");
        const url = UPDATE_LEDGER_NODE_INFO_API[net]
        const res = await axios.post(url, info)
        return res.data
    },
    async newStakeInfo({ }, info) {
        const net = localStorage.getItem("net");
        const url = UPDATE_NODE_INFO_API[net] + '/new'
        const res = await axios.post(url, info)
        return res.data
    }
}


export default {
    state,
    mutations,
    actions
}
