import { getNodeUrl} from '../../../core/utils'
import {CON_NODE, NODE_DETAIL} from '../../../core/consts'
import numeral from 'numeral'
import { Crypto, RestClient, utils, GovernanceTxBuilder} from 'ontology-ts-sdk'
import {BigNumber} from 'bignumber.js'
import {db2, dbUpsert, dbFind} from '../../../core/dbService'
var dateFormat = require('dateformat');
import nodes from '../../../core/nodes.json'

function matchNodeName(node) {
    for (const cnode of nodes) {
        if (node.pk === cnode.pk) {
            node.name = cnode.name
            break;
        }
    }
    if(!node.name) {
        node.name = 'Node_' + node.address.toBase58().substr(0,6);
    }
}

function delay(s) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, s);
    })
}

function isMainnetConNode(pk) {
    const net = localStorage.getItem('net');
    if (net === 'MAIN_NET') {
        let isConNode = false;
        for (const cnode of CON_NODE) {
            if (cnode.pk === pk) {
                isConNode = true;
            }
        }
        return isConNode;
    } 
    return true;
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
    peerPoolMap:[]
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
        const authorizationInfo = payload.info;
        let inAuthorization = authorizationInfo.consensusPos + authorizationInfo.freezePos
            + authorizationInfo.newPos;
        inAuthorization = numeral(inAuthorization).format('0,0');
        let locked = authorizationInfo.withdrawPos + authorizationInfo.withdrawFreezePos;
        locked = numeral(locked).format('0,0')
        let claimableVal = authorizationInfo.withdrawUnfreezePos;
        const claimable = numeral(claimableVal).format('0,0')
        state.authorizationInfo = {
            ...payload.info,
            inAuthorization,
            locked,
            claimable,
            claimableVal
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
    async fetchNodeList({commit, dispatch, state}) {
        const url = getNodeUrl();
        try{
            const peerMap = await GovernanceTxBuilder.getPeerPoolMap(url);
            const list = []
            for (let k in peerMap) {
                let item = peerMap[k];
                if(item.status !== 1 && item.status !== 2) {// consensus nodes and candidate nodes
                    continue;
                }
                // if (!isMainnetConNode(item.peerPubkey)) {
                //     continue;
                // }
                const attr = await GovernanceTxBuilder.getAttributes(item.peerPubkey, url);
                item.maxAuthorize = attr.maxAuthorize;
                item.maxAuthorizeStr = numeral(item.maxAuthorize).format('0,0')
                item.totalPosStr = numeral(item.totalPos).format('0,0')
                const nodeProportion = attr.t1PeerCost + '%'
                const userProportion = (100 - attr.t1PeerCost) + '%'
                // item.nodeProportion = nodeProportion + ' / ' + userProportion
                item.nodeProportion =  userProportion
                list.push(item);
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
            list.forEach((item, index) => {
                item.rank = index + 1;
                item.currentStake = numeral(item.initPos + item.totalPos).format('0,0');
                let process = Number((item.totalPos + item.initPos) * 100 / (item.initPos + item.maxAuthorize)).toFixed(2)
                if(process > 100) {
                    process = 100;
                }
                item.process = process + '%'
                item.pk = item.peerPubkey
                item.detailUrl = NODE_DETAIL + item.pk;
                matchNodeName(item)
            })
            commit('UPDATE_NODE_LIST', {list});
            return list;
        } catch(err) {
            console.log(err)           
            return [];
        }
    },
    async fetchBlockCountdown({commit}) {
        const url = getNodeUrl();
        const rest = new RestClient(url);
        try {
            const view = await GovernanceTxBuilder.getGovernanceView(url);
            const blockRes = await rest.getBlockHeight();
            const blockHeight = blockRes.Result;
            const countdown = 120000 - (blockHeight - view.height);
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

    async recordStakeHistory({commit, dispatch}, {txHash, record}) {
        const url = getNodeUrl();
        const rest = new RestClient(url)
        
        await delay(6000);
        let event = await rest.getSmartCodeEvent(txHash)
        if (event.Result && parseInt(event.Result.State) === 1) {
            //do nothing
        } else {
            await delay(3000);
            event = await rest.getSmartCodeEvent(txHash)
        }
        if (!event.Result || parseInt(event.Result.State) !== 1) {
            return;
        }
        // update stake history Db
        const pk = record.nodePk;
        const address = record.stakeWalletAddress
        const authorizationInfo = await dispatch('fetchAuthorizationInfo', { pk, address })
        if (authorizationInfo) {
            const inAuthorization = authorizationInfo.consensusPos + authorizationInfo.freezePos
                + authorizationInfo.newPos;
            record.amount = inAuthorization;
        }
        try {
            const upsert = await dbUpsert(db2, 'indexKey', record);
            return upsert;
        } catch (err) {
            console.log(err)
            return;
        }
        
    },
    async fetchStakeHistory({commit}) {
        let history = (await dbFind(db2, {})).filter((item)=> item.amount > 0);
        history.forEach(item => {
            item.updatedAt = dateFormat(new Date(item.updatedAt), 'yyyy/mm/dd hh:MM:ss')
            item.amount = numeral(item.amount).format('0,0')
        })
        commit('UPDATE_STAKE_HISTORY', {history})
        console.log(history)
        return history;
    }
}

export default {
    state,
    mutations,
    actions
}
