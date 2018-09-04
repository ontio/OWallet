import {getNodeUrl} from '../../../core/utils'
import numeral from 'numeral'
import {Crypto, RestClient} from 'ontology-ts-sdk'
import {BigNumber} from 'bignumber.js'
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
        oldPeerCost: 0,
        newPeerCost: 0,
    },
    current_node: '',
    authorizationInfo:'',
    splitFee: {
        address: '',
        amount: 0
    },
    countdown: 0,
    node_list: [],
    posLimit: 10
}

const mutations = {
    UPDATE_CURRENT_PEER(state, payload) {
        state.current_peer = {
            peerPubkey: payload.peerItem.peerPubkey,
            address: payload.peerItem.address.toBase58(),
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
            oldPeerCost: payload.peerAttrs.oldPeerCost,
            newPeerCost: payload.peerAttrs.newPeerCost,
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
    }
}

const actions = {
    async fetchPeerItem({commit}, pk){
        const url = getNodeUrl();
        const peerMap = await Ont.GovernanceTxBuilder.getPeerPoolMap(url);
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
        const peerAttrs = await Ont.GovernanceTxBuilder.getAttributes(pk, url);
        if (peerAttrs) {
            commit('UPDATE_PEER_ATTRS', {peerAttrs})
            return peerAttrs;
        }
    },
    async fetchAuthorizationInfo({commit}, {pk, address}) {
        const url = getNodeUrl();
        const userAddr = new Crypto.Address(address);
        const authorizeInfo = await Ont.GovernanceTxBuilder.getAuthorizeInfo(pk, userAddr, url)
        if(authorizeInfo) {
            commit('UPDATE_AUTHORIZATION_INFO', {info: authorizeInfo})
            return authorizeInfo
        }
    },
    async fetchSplitFee({commit}, address) {
        const url = getNodeUrl();
        const userAddr = new Crypto.Address(address);        
        const splitFee = await Ont.GovernanceTxBuilder.getSplitFeeAddress(userAddr, url)
        if(splitFee) {
            if(splitFee.amount) {
                splitFee.amount = new BigNumber(splitFee.amount).div(1e9).toFixed(9)
            }
            commit('UPDATE_SPLIT_FEE', {splitFee})
            return splitFee
        }
    },
    async fetchNodeList({commit}) {
        const url = getNodeUrl();
        try{
            const peerMap = await Ont.GovernanceTxBuilder.getPeerPoolMap(url);
            const list = []
            for (let k in peerMap) {
                let item = peerMap[k];
                const attr = await Ont.GovernanceTxBuilder.getAttributes(item.peerPubkey, url);
                item.maxAuthorize = attr.maxAuthorize;
                item.maxAuthorizeStr = numeral(item.maxAuthorize).format('0,0')
                item.totalPosStr = numeral(item.totalPos).format('0,0')
                const nodeProportion = attr.newPeerCost + '%'
                const userProportion = (100 - attr.newPeerCost) + '%'
                item.nodeProportion = nodeProportion + ' / ' + userProportion
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
                item.currentStake = item.initPos + item.totalPos;
                item.process = Number((item.totalPos + item.initPos) * 100 / (item.initPos + item.maxAuthorize)).toFixed(2) + '%'
                item.pk = item.peerPubkey
                item.name = 'Node No.' + (index + 1)
                if (item.peerPubkey === '02f4c0a18ae38a65b070820e3e51583fd3aea06fee2dc4c03328e4b4115c622567') {//for test
                    item.name = 'Node1 To Authorize'
                }
                if (item.pk === '03f6149b3a982c046912731d6374305e2bc8e278fa90892f6f20a8ee85c1d5443f') {//for test
                    item.name = 'Node2 To Authorize'
                }
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
            const view = await Ont.GovernanceTxBuilder.getGovernanceView(url);
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
            const globalParams = await Ont.GovernanceTxBuilder.getGlobalParam(url);
            if(globalParams.posLimit) {
                commit('UPDATE_POS_LIMIT', {posLimit: globalParams.posLimit});
                return globalParams.posLimit;
            }
        }catch(err) {
            console.log(err);
        }
    } 
}

export default {
    state,
    mutations,
    actions
}
