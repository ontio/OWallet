import { getNodeUrl} from '../../core/utils'
import {NODE_DETAIL, NODE_NAME_LIST, OFF_CHAIN_NODES, NODE_CURRENT_STAKES} from '../../core/consts'
import numeral from 'numeral'
import { Crypto, RestClient, utils, GovernanceTxBuilder} from 'ontology-ts-sdk'
import {BigNumber} from 'bignumber.js'
import {dbUpsert, dbFind} from '../../core/dbService'
import axios from 'axios';
import {
  message
} from 'ant-design-vue'
import i18n from '../../lang';
var dateFormat = require('dateformat');
// import nodes from '../../core/nodes.json'

//@Deprecated
async function matchNodeName(list) {
    let nodes = []
    const net = localStorage.getItem('net');
    try {
         if(net === 'MAIN_NET') { // only MainNet nodes have names
            const res = await axios.get(NODE_NAME_LIST)
            if (res && res.data && res.data.Result) {
              nodes = res.data.Result
            }
         }
    } catch(err) {
        console.log(err)
    }
    console.log(nodes)
    if (net === 'TEST_NET') {
        list.forEach(item => {
           item.name = 'Node_' + item.pk.substr(0, 6);
        })
        return;
    }
    for(const item of list) {
        for (const cnode of nodes) {
            if (cnode.PublicKey === item.pk || cnode.PublicKey  === item.peerPubkey) {
                item.name = cnode.Name
                break;
            }
            else if (!cnode || !cnode.PublicKey) {
                if (item.address) {
                    item.name = 'Node_' + (item.address.toBase58 ? item.address.toBase58().substr(0, 6) : item.address.substr(0, 6));
                } else {
                    item.name = 'Node_' + item.pk.substr(0, 6)
                }
            }
        }
    }
}

async function fetchRoundBlocks() {
    const net = localStorage.getItem('net');
    let url = net === 'TEST_NET' ? 'https://polarisexplorer.ont.io/v2/nodes/block-count-to-next-round'
        : 'https://explorer.ont.io/v2/nodes/block-count-to-next-round'
    const res = await axios.get(url);
    if (res.data && res.data.result) {
        const {max_staking_change_count, count_to_next_round} = res.data.result
        return Number(count_to_next_round);
    } else {
        throw new Error('Network error when fetch block counts.')
    }
}

function delay(s) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, s);
    })
}


function formatAuthorizationInfo(info) {
    const authorizationInfo = info;
    let inAuthorization = authorizationInfo.consensusPos + authorizationInfo.freezePos
        + authorizationInfo.newPos;
    inAuthorization = numeral(inAuthorization).format('0,0');
    const newStakePortion = numeral(authorizationInfo.newPos).format('0,0')
    const receiveProfitPortion = numeral(authorizationInfo.consensusPos + authorizationInfo.freezePos).format('0,0')
    let locked = authorizationInfo.withdrawPos + authorizationInfo.withdrawFreezePos;
    locked = numeral(locked).format('0,0')
    let claimableVal = authorizationInfo.withdrawUnfreezePos;
    const claimable = numeral(claimableVal).format('0,0')
    return {
        inAuthorization,
        locked,
        claimable,
        claimableVal,
        newStakePortion,
        receiveProfitPortion
    }
}

const state = {
    current_peer:{ // for node user
        peerPubkey: '',
        address: '',
        status: 0,
        initPos: 0,
        initPosStr: '0',
        totalPos: 0,
        totalPosStr: '0'
    },
    peer_attrs: {
        peerPubkey: '',
        maxAuthorize: 0,
        maxAuthorizeStr: '0',
        t2PeerCost: 0,
        t1PeerCost: 0,
        tPeerCost: 0
    },
    current_node: '',
    authorizationInfo:'',
    splitFee: {
        address: '',
        amount: 0
    },
    countdown: 0,
    node_list: [],
    posLimit: 10,
    peerUnboundOng: 0,
    stakeHistory: [],
    stake_authorization_wallet: '',
    peerPoolMap:[],
    sortedNodeList: []
}

const mutations = {
    UPDATE_CURRENT_PEER(state, payload) {
        state.current_peer = {
            peerPubkey: payload.peerItem.peerPubkey,
            address: payload.peerItem.address?payload.peerItem.address.toBase58() : '',
            status: payload.peerItem.status,
            initPos: payload.peerItem.initPos,
            initPosStr: numeral(payload.peerItem.initPos).format('0,0'),
            totalPos: payload.peerItem.totalPos,
            totalPosStr: numeral(payload.peerItem.totalPos).format('0,0')
        }
    },
    UPDATE_PEER_ATTRS(state, payload) {
        state.peer_attrs = {
            peerPubkey: payload.peerAttrs.peerPubkey,
            maxAuthorize: payload.peerAttrs.maxAuthorize,
            maxAuthorizeStr: numeral(payload.peerAttrs.maxAuthorize).format('0,0'),
            t2PeerCost: payload.peerAttrs.t2PeerCost,
            t1PeerCost: payload.peerAttrs.t1PeerCost,
            tPeerCost: payload.peerAttrs.tPeerCost
        }
    },
    UPDATE_CURRENT_NODE(state, payload) {
        state.current_node = payload.current_node
    },
    UPDATE_AUTHORIZATION_INFO(state, payload) {
        const {
            inAuthorization,
            locked,
            claimable,
            claimableVal,
            newStakePortion,
            receiveProfitPortion
        } = formatAuthorizationInfo(payload.info)
        state.authorizationInfo = {
            ...payload.info,
            inAuthorization,
            locked,
            claimable,
            claimableVal,
            newStakePortion,
            receiveProfitPortion
        }
    },
    UPDATE_SPLIT_FEE(state, payload) {
        state.splitFee = payload.splitFee
    },
    UPDATE_COUNTDOWN_BLOCK(state, payload) {
        state.countdown = payload.countdown;
    },
    UPDATE_NODE_LIST(state, payload) {
        state.node_list = payload.list
    },
    UPDATE_POS_LIMIT(state, payload) {
        state.posLimit = payload.posLimit
    },
    UPDATE_PEER_UNBOUND_ONG(state, payload) {
        state.peerUnboundOng = payload.peerUnboundOng
    },
    UPDATE_STAKE_HISTORY(state, payload) {
        state.stakeHistory = payload.history
    },
    UPDATE_STAKE_AUTHORIZATION_WALLET(state, payload) {
        state.stake_authorization_wallet = payload.stakeWallet
    },
    UPDATE_PEER_POOL_MAP(state, payload) {
        state.peerPoolMap = payload.peerMap
    },
    CLEAR_STAKE_HISTORY(state, payload) {
        state.stakeHistory = []
    },
    UPDATE_SORTED_NODE_LIST(state, {list}) {
        state.sortedNodeList = list;
    }
}

const actions = {
    async fetchPeerItem({commit}, pk){
        const url = getNodeUrl();
        const peerMap = await GovernanceTxBuilder.getPeerPoolMap(url);
        if(!pk) {
            return peerMap;
        }
        if(pk && peerMap[pk]) {
            commit('UPDATE_CURRENT_PEER', {peerItem: peerMap[pk]})
            return peerMap[pk]
        } else {
            const peerItem = {
                peerPubkey: '',
                address: '',
                status: 0,
                initPos: 0,
                initPosStr: '0',
                totalPos: 0,
                totalPosStr: '0'
            }
            commit('UPDATE_CURRENT_PEER', { peerItem })
            return null;
        }
    },

    async fetchPeerAttributes({commit}, pk) {
        const url = getNodeUrl();
        const peerAttrs = await GovernanceTxBuilder.getAttributes(pk, url);
        if (peerAttrs) {
            commit('UPDATE_PEER_ATTRS', {peerAttrs})
            return peerAttrs;
        }
    },
    async fetchAuthorizationInfo({commit}, {pk, address}) {
        const url = getNodeUrl();
        const userAddr = new Crypto.Address(address);
        const authorizeInfo = await GovernanceTxBuilder.getAuthorizeInfo(pk, userAddr, url)
        if(authorizeInfo) {
            commit('UPDATE_AUTHORIZATION_INFO', {info: authorizeInfo})
            return authorizeInfo
        }
    },
    async fetchSplitFee({commit}, address) {
        const url = getNodeUrl();
        const userAddr = new Crypto.Address(address);
        const splitFee = await GovernanceTxBuilder.getSplitFeeAddress(userAddr, url)
        if(splitFee) {
            if(splitFee.amount) {
                splitFee.amount = new BigNumber(splitFee.amount).div(1e9).toFixed(9)
            }
            commit('UPDATE_SPLIT_FEE', {splitFee})
            return splitFee
        }
    },
    async searchStakeHistory({commit, dispatch, state}, {address}) {
        const url = getNodeUrl();
        const list = []
        const net = localStorage.getItem('net')
        const off_chain_nodes_url = OFF_CHAIN_NODES[net];
        const userAddr = new Crypto.Address(address);
        try {
            const res = await axios.get(off_chain_nodes_url);
            const nodes = res.data.result.filter(node => node.public_key.indexOf('00aaaaaaaaa') < 0); //00aaaaaaaaa开头是无效的公钥
            const infoTemp = await Promise.all(nodes.map(item => {
                return GovernanceTxBuilder.getAuthorizeInfo(item.public_key, userAddr, url)
            }))
            console.log(infoTemp)
            infoTemp.forEach(item => {
                let inAuthorization = item.consensusPos + item.freezePos +
                  item.newPos;
                let locked = item.withdrawPos + item.withdrawFreezePos;
                let claimableVal = item.withdrawUnfreezePos;
                if (inAuthorization > 0 || locked > 0 || claimableVal > 0) {
                  const record = formatAuthorizationInfo(item)
                  record.name = '';
                  record.pk = item.peerPubkey;
                  record.stakeWallet = address;
                  list.push(record)
                }
            })
            list.forEach(item => {
                for (let i = 0; i < nodes.length; i++) {
                    if (item.pk === nodes[i].public_key) {
                        item.name = nodes[i].name ? nodes[i].name : 'Node_' + nodes[i].public_key.substr(0, 6)
                    }
                }
            })
            commit('UPDATE_STAKE_HISTORY', {history: list})
            dispatch('hideLoadingModals')
            return list;
        } catch(err) {
            dispatch('hideLoadingModals')
            console.log(err)
            message.error(i18n.t('commonWalletHome.networkError'))
            return [];
        }
    },
    //@Deprecated
    async fetchAllSortedNodeList({commit, dispatch}) {
        const url = getNodeUrl();
        try {
            const peerMap = await GovernanceTxBuilder.getPeerPoolMap(url);
            const list = []
            for (let k in peerMap) {
              let item = peerMap[k];
              if (item.status !== 1 && item.status !== 2) { // consensus nodes and candidate nodes
                continue;
              }
              item.pk = item.peerPubkey;
              list.push(item)
            }
            list.sort((v1, v2) => {
                if ((v2.initPos + v2.totalPos) > (v1.initPos + v1.totalPos)) {
                    return 1;
                } else if ((v2.initPos + v2.totalPos) < (v1.initPos + v1.totalPos)) {
                    return -1;
                } else {
                    return 0;
                }
            })
            list.forEach((item, index) => {item.rank = index + 1})
            await matchNodeName(list);
            commit('UPDATE_SORTED_NODE_LIST', {list})
            dispatch('hideLoadingModals')
            return list;
        } catch(err) {
            console.log(err)
            dispatch('hideLoadingModals')
            message.error(i18n.t('commonWalletHome.networkError'))
            return [];
        }
    },
    //Deprecated
    async fetchNodeList({commit, dispatch, state}, {pageSize, pageNum}) {
        const url = getNodeUrl();
        if(state.sortedNodeList.length === 0) {
            await dispatch('fetchAllSortedNodeList')
        }
        try{
            const nodes = state.sortedNodeList.slice(pageNum*pageSize, (pageNum+1) * pageSize).filter(item => item.peerPubkey)
            console.log(nodes)
            const listTemp = await Promise.all(nodes.map((item) => {
              return GovernanceTxBuilder.getAttributes(item.peerPubkey, url)
            }))
            nodes.forEach((item, i) => {
                const attr = listTemp[i];
                item.maxAuthorize = attr.maxAuthorize;
                item.maxAuthorizeStr = numeral(item.maxAuthorize).format('0,0')
                item.totalPosStr = numeral(item.totalPos).format('0,0')
                const nodeProportion = attr.t1PeerCost + '%'
                const userProportion = (100 - attr.t1PeerCost) + '%'
                // item.nodeProportion = nodeProportion + ' / ' + userProportion
                item.nodeProportion = userProportion
            })
            const list = nodes;
            list.forEach((item, index) => {
                item.currentStake = numeral(item.initPos + item.totalPos).format('0,0');
                let process = Number((item.totalPos + item.initPos) * 100 / (item.initPos + item.maxAuthorize)).toFixed(2)
                if(process > 100) {
                    process = 100;
                }
                item.process = process + '%'
                item.detailUrl = NODE_DETAIL + item.peerPubkey;
            })
            console.log(JSON.stringify(list))

            commit('UPDATE_NODE_LIST', {list});
            dispatch('hideLoadingModals')
            return list.length;
        } catch(err) {
            console.log(err)
            dispatch('hideLoadingModals')
            return 0;
        }
    },

    async fetchNodeListNew({commit, dispatch}, {pageSize, pageNum}) {
        const net = localStorage.getItem('net')
        const url = NODE_CURRENT_STAKES[net];
        try {
            const res = await axios.get(url)
            console.log(res)
            if(res.data.code === 0 && res.data.result) {
                const result = res.data.result;
                const total = result.length;
                const list = result.slice(pageNum * pageSize, (pageNum + 1) * pageSize).map(item => {
                    item.rank = item.node_rank;
                    item.nodeProportion = item.node_proportion;
                    item.currentStake = numeral(item.current_stake).format('0,0');
                    item.process = item.progress;
                    item.maxAuthorize = item.max_authorize;
                    item.maxAuthorizeStr = numeral(item.max_authorize).format('0,0')
                    item.totalPos = item.total_pos;
                    item.initPos = item.init_pos;
                    item.pk = item.public_key;
                    item.detailUrl = item.detail_url;
                    item.totalPosStr = numeral(item.totalPos).format('0,0')
                    if (!item.name) {
                        item.name = 'Node_' + item.public_key.substr(0, 6)
                    }
                    return item;
                })
                commit('UPDATE_NODE_LIST', {list})
                return total;
            } else {
                return 0;
            }
        }catch(err) {
            console.log(err)
            dispatch('hideLoadingModals')
            return 0;
        }

    },
    async fetchBlockCountdown({commit}) {
        const url = getNodeUrl();
        const rest = new RestClient(url);
        try {
            // const view = await GovernanceTxBuilder.getGovernanceView(url);
            // const blockRes = await rest.getBlockHeight();
            // const blockHeight = blockRes.Result;
            // const blockCounts = await fetchRoundBlocks()
            // const countdown = blockCounts - (blockHeight - view.height);
            // if (countdown < 0) {
            //     throw new Error('Network error for fetch block countdown.')
            // }
            const countdown = await fetchRoundBlocks()
            commit('UPDATE_COUNTDOWN_BLOCK', {countdown})
            return countdown;
        }catch(err) {
            // alert('Network error.')
            console.log(err)
        }
    },
    async fetchPosLimit({commit}) {
        const url = getNodeUrl();
        try {
            const globalParams = await GovernanceTxBuilder.getGlobalParam(url);
            if(globalParams.posLimit) {
                commit('UPDATE_POS_LIMIT', {posLimit: globalParams.posLimit});
                return globalParams.posLimit;
            }
        }catch(err) {
            console.log(err);
        }
    },
    async fetchPeerUnboundOng({commit}, address) {
        const url = getNodeUrl();
        const addr = new Crypto.Address(address);
        try {
            let peerUnboundOng = await GovernanceTxBuilder.getPeerUnboundOng(addr, url);
            peerUnboundOng = new BigNumber(peerUnboundOng).div(1e9).toNumber();
            commit('UPDATE_PEER_UNBOUND_ONG', {peerUnboundOng})
            return peerUnboundOng;
        } catch(err) {
            console.log(err);
        }
    },
}

export default {
    state,
    mutations,
    actions
}
