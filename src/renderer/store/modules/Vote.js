import { NODE_CURRENT_STAKES, VOTE_ROLE, DEFAULT_SCRYPT } from '../../../core/consts'
import httpService, { getRestClient } from '../../../core/utils'
import { TransactionBuilder, Crypto, utils, Parameter, ParameterType, TxSignature } from 'ontology-ts-sdk'
import {
    message
} from 'ant-design-vue'
import i18n from '../../../common/lang';

const gasPrice = '500'
const gasLimit = '20000'
const contract_hash = {
    MAIN_NET: '',
    TEST_NET: '4458ee95e27235c0d3aad90060b4fad44db7f4e4'
}
const state = {
    voteWallet: '',
    voteWalletType: '', // commonWallet or ledgerWallet
    role: [],  // 可能同时是admin和voter
    all_votes: [],
    admin_votes: [], // admin 创建的votes
    all_votes_hash: [],
    admin_votes_hash: [],
    currentVote: {},
    my_weight: 0
}

export const VOTE_STATUS_TEXT = {
    NOT_START: 'NOT_START',
    IN_PROGRESS: 'IN_PROGRESS',
    FINISHED: 'FINISHED',
    CANCELED: 'CANCELED'
}

const formatNumber = function (val) {
    return parseInt(utils.reverseHex(val), 16)
}

const formatVoteInfo = function (infos) {
    const votes = []
    for (const info of infos) {
        let item = info;
        if (info && info.Result && info.Result.Result) {
            item = info.Result.Result
        }
        const vote = {
            admin: new Crypto.Address(item[0]).toBase58(),
            title: utils.hexstr2str(item[1]),
            content: utils.hexstr2str(item[2]),
            voters: item[3] ? item[3].map(i => {
                return {
                    address: new Crypto.Address(i[0]).toBase58(),
                    weight: parseInt(utils.reverseHex(i[1]), 16)
                }
            }) : [],
            startTime: formatNumber(item[4]) * 1000,
            endTime: formatNumber(item[5]) * 1000,
            approves: formatNumber(item[6]),
            rejects: formatNumber(item[7]),
            status: formatNumber(item[8]),
            hash: item[9]
        }
        if (vote.status === 0) {
            vote.statusText = VOTE_STATUS_TEXT.CANCELED
        } else {
            const now = Date.now()
            if (vote.startTime > now) {
                vote.statusText = VOTE_STATUS_TEXT.NOT_START
            } else if (vote.startTime <= now && vote.endTime >= now) {
                vote.statusText = VOTE_STATUS_TEXT.IN_PROGRESS
            } else if (vote.endTime < now) {
                vote.statusText = VOTE_STATUS_TEXT.FINISHED
            }
        }

        votes.push(vote)
    }
    return votes;
}

const handleSignTx = async function (tx, wallet, password, walletType = 'commonWallet') {
    if (walletType === 'commonWallet') {
        const enc = new Crypto.PrivateKey(wallet.key);
        let pri;
        try {
            pri = enc.decrypt(
                password,
                new Crypto.Address(wallet.address),
                wallet.salt,
                DEFAULT_SCRYPT
            );
        } catch (err) {
            console.log(err);
            message.error(i18n.t('common.pwdErr'))
            return;
        }
        TransactionBuilder.signTransaction(tx, pri);
    } else {
        const pk = new Crypto.PublicKey(wallet.publicKey);
        const txSig = new TxSignature();
        txSig.M = 1;
        txSig.pubKeys = [pk];
        const txData = tx.serializeUnsignedData();
        const res = await legacySignWithLedger(txData)
        // console.log('txSigned: ' + res);
        const sign = '01' + res; //ECDSAwithSHA256
        txSig.sigData = [sign]
        tx.sigs.push(txSig);
    }
    return tx;
}

const mutations = {
    UPDATE_VOTE_WALLET(state, { voteWallet }) {
        state.voteWallet = voteWallet
    },
    UPDATE_VOTE_ROLE(state, { role }) {
        state.role = role
    },
    UPDATE_ALL_VOTES(state, { votes }) {
        state.all_votes = votes
    },
    UPDATE_ADMIN_VOTES(state, { votes }) {
        state.admin_votes = votes
    },
    UPDATE_VOTE_WALLET_TYPE(state, { type }) {
        state.voteWalletType = type
    },
    UPDATE_CURRENT_VOTE(state, { vote }) {
        state.currentVote = vote
    },
    UPDATE_MY_WEIGHT(state, { weight }) {
        state.my_weight = weight
    }
}

const actions = {
    //从接口获取节点钱包地址，和从合约获取amdin地址，判断role
    async getVoteRole({ commit, dispatch }, { address }) {
        dispatch('showLoadingModals')
        const net = localStorage.getItem('net');
        const url = NODE_CURRENT_STAKES[net]
        try {
            const res1 = await httpService({
                url,
                method: 'get'
            })
            // console.log(res1)
            const client = getRestClient()
            const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
            const tx = TransactionBuilder.makeInvokeTransaction('listAdmins', [], contract, gasPrice, gasLimit)
            const res2 = await client.sendRawTransaction(tx.serialize(), true);
            // console.log(res2)
            let is_voter = false
            let weight = 0
            for (let node of res1.result) {
                if (node.address === address) {
                    is_voter = true;
                    weight = node.stake
                    break;
                }
            }
            let is_admin = false
            for (let addr of res2.Result.Result) {
                if (new Crypto.Address(addr).toBase58() === address) {
                    is_admin = true;
                    break;
                }
            }
            let role = [];
            if (is_voter) role.push(VOTE_ROLE.VOTER)
            if (is_admin) role.push(VOTE_ROLE.ADMIN)
            console.log(role)
            commit('UPDATE_VOTE_ROLE', { role })
            commit('UPDATE_MY_WEIGHT', { weight })
            dispatch('hideLoadingModals')
        } catch (err){
            console.log(err)
            dispatch('hideLoadingModals')
            message.error(i18n.t('common.networkErr'))
        }
    },
    async getAllVotes({ commit, dispatch }) {
        dispatch('showLoadingModals')
        const net = localStorage.getItem('net');
        const client = getRestClient()
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const tx = TransactionBuilder.makeInvokeTransaction('listTopics', [], contract, gasPrice, gasLimit)
        try {
            const res2 = await client.sendRawTransaction(tx.serialize(), true);
            const hashes = res2.Result.Result
            console.log(hashes)
            const txes = hashes.map(hash => {
                return TransactionBuilder.makeInvokeTransaction('getTopicInfo', [new Parameter('', ParameterType.ByteArray, hash)], contract, gasPrice, gasLimit)
            })
            const infos = await Promise.all(txes.map(tx => { return client.sendRawTransaction(tx.serialize(), true) }))
            console.log(infos)

            const votes = formatVoteInfo(infos)
            console.log(votes)
            commit('UPDATE_ALL_VOTES', { votes })
            dispatch('hideLoadingModals')
        } catch (err) {
            console.log(err)
            dispatch('hideLoadingModals')
            message.error(i18n.t('common.networkErr'))
        }
        
    },
    async getAdminVotes({ commit, dispatch, state }) {
        dispatch('showLoadingModals')
        const address = state.voteWallet.address;
        const net = localStorage.getItem('net');
        const client = getRestClient()
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const param = new Parameter('admin', ParameterType.ByteArray, new Crypto.Address(address).serialize())
        const tx = TransactionBuilder.makeInvokeTransaction('getTopicInfoListByAdmin', [param], contract, gasPrice, gasLimit)
        try {
            const res = await client.sendRawTransaction(tx.serialize(), true);
            const votes = formatVoteInfo(res.Result.Result)
            console.log(votes)
            commit('UPDATE_ADMIN_VOTES', { votes })
            dispatch('hideLoadingModals')
        } catch (err) {
            console.log(err)
            dispatch('hideLoadingModals')
            message.error(i18n.t('common.networkErr'))
        }
    },
    submitVote({ commit, state }, { type, hash }) {
        const net = localStorage.getItem('net');
        const client = getRestClient()
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const address = state.voteWallet.address
        const addr = new Crypto.Address(address)
        const params = [
            new Parameter('', ParameterType.ByteArray, hash),
            new Parameter('', ParameterType.ByteArray, addr.serialize()),
            new Parameter('', ParameterType.Boolean, type)
        ]
        let tx = TransactionBuilder.makeInvokeTransaction('voteTopic', params, contract, gasPrice, gasLimit, addr)
        return tx;
    },
    stopVote({ commit, dispatch, state }) {
        const net = localStorage.getItem('net');
        const client = getRestClient()
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const address = state.voteWallet.address
        const addr = new Crypto.Address(address)
        const params = [
            new Parameter('', ParameterType.ByteArray, hash)
        ]
        let tx = TransactionBuilder.makeInvokeTransaction('cancelTopic', params, contract, gasPrice, gasLimit, addr)
        return tx;
    },
    createVote({ commit, dispatch, state }, { vote }) {
        const net = localStorage.getItem('net');
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const address = state.voteWallet.address
        const addr = new Crypto.Address(address)
        const params = [
            new Parameter('', ParameterType.ByteArray, addr.serialize()),
            new Parameter('', ParameterType.String, vote.title),
            new Parameter('', ParameterType.String, vote.content),
            new Parameter('', ParameterType.Integer, vote.startTime),
            new Parameter('', ParameterType.Integer, vote.endTime),
        ]
        let tx = TransactionBuilder.makeInvokeTransaction('createTopic', params, contract, gasPrice, gasLimit, addr)
        return tx;
    },

    async setVoters({ commit, dispatch, state }, { hash, voters }) {
        dispatch('showLoadingModals')
        const net = localStorage.getItem('net');
        const client = getRestClient()
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const address = state.voteWallet.address
        const addr = new Crypto.Address(address)
        const params = [
            new Parameter('', ParameterType.ByteArray, hash),
            new Parameter('', ParameterType.Array, voters) //TODO format voters to arrays
        ]
        let tx = TransactionBuilder.makeInvokeTransaction('setVoterForTopic', params, contract, gasPrice, gasLimit, addr)
        tx = await handleSignTx(tx, state.voteWallet, password, state.voteWalletType);
        if (!tx) {
            return;
        }
        // TODO change to websocket
        const res = await client.sendRawTransaction(tx.serialize(), false);
        dispatch('hideLoadingModals')
        return res;
    },

    // 查询
    async getVoters({ commit }, { hash }) {
        const net = localStorage.getItem('net');
        const client = getRestClient()
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const param = new Parameter('', ParameterType.ByteArray, hash)
        const tx = TransactionBuilder.makeInvokeTransaction('getVoters', [param], contract, gasPrice, gasLimit)
        const res = await client.sendRawTransaction(tx.serialize(), true);
        const voters = res.Result.Result.map(i => {
            return {
                address: new Crypto.Address(i[0]).toBase58(),
                weight: parseInt(utils.reverseHex(i[1]), 16)
            }
        })
        console.log(voters)
        return voters;
    },
    setCurrentVote({ commit }, { vote }) {
        commit('UPDATE_CURRENT_VOTE', {vote})
    }

}

export default {
    state,
    mutations,
    actions
}
