import { NODE_CURRENT_STAKES, VOTE_ROLE, DEFAULT_SCRYPT } from '../../../core/consts'
import httpService, { getRestClient } from '../../../core/utils'
import { TransactionBuilder, Crypto, utils, Parameter, ParameterType, TxSignature, WebsocketClient } from 'ontology-ts-sdk'
import {
    message
} from 'ant-design-vue'
import i18n from '../../../common/lang';

const gasPrice = '500'
const gasLimit = '200000'
const contract_hash = {
    MAIN_NET: 'c0df752ca786a99755b2e8950060ade9fa3d4e1b',
    TEST_NET: '6c977ca7036c991fa430ba3b34643e146501218c'
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
    my_weight: 0,
    all_voters: [], // 当前是所有节点用户
    current_vote_records: [] // 当前vote的投票情况
}

export const VOTE_STATUS_TEXT = {
    NOT_START: 'NOT_START',
    IN_PROGRESS: 'IN_PROGRESS',
    FINISHED: 'FINISHED',
    CANCELED: 'CANCELED'
}

export const MY_VOTED = {
    'APPROVED': 'APPROVED',
    'REJECTED': 'REJECTED',
    'NOT_VOTED': 'NOT_VOTED'
}

const formatNumber = function (val) {
    return parseInt(utils.reverseHex(val), 16)
}
function formatVoteInfo(infos) {
    if (!infos) {
        return []
    }
        const votes = []
        for (const data of infos) {
            const sr = new utils.StringReader(data);
            const hasValue = sr.readVarUint() > 0;
            if (hasValue) {
                const admin = new Crypto.Address(sr.read(20)).toBase58();
                // tslint:disable:variable-name
                const topic_title_length = sr.readVarUint();
                const topic_title = utils.hexstr2str(sr.read(topic_title_length));
                const topic_detail_length = sr.readVarUint();
                const topic_detail = utils.hexstr2str(sr.read(topic_detail_length));
                const voters_length = sr.readVarUint();
                const voters = [];
                for (let i = 0; i < voters_length; i++) {
                    const voter_addr = new Crypto.Address(sr.read(20)).toBase58();
                    const weight = sr.readUint128();
                    voters.push({
                        address: voter_addr,
                        weight
                    });
                }
                const start_time = sr.readUint64();
                const end_time = sr.readUint64();
                const approves = sr.readUint64();
                const rejects = sr.readUint64();
                const status = sr.readUint8();
                const hash = sr.readH256();
                const vote = {
                    admin,
                    title: topic_title,
                    content: topic_detail,
                    voters,
                    startTime: start_time * 1000,
                    endTime: end_time * 1000,
                    approves,
                    rejects,
                    status,
                    hash
                };
                votes.push(vote)
            }
        }
    return votes
}
// const formatVoteInfo = function (infos) {
//     if (!infos) {
//         return [];
//     }
//     const votes = []
//     for (const info of infos) {
//         let item = info;
//         if (info && info.Result && info.Result.Result) {
//             item = info.Result.Result
//         }
//         const vote = {
//             admin: new Crypto.Address(item[0]).toBase58(),
//             title: utils.hexstr2str(item[1]),
//             content: utils.hexstr2str(item[2]),
//             voters: item[3] ? item[3].map(i => {
//                 return {
//                     address: new Crypto.Address(i[0]).toBase58(),
//                     weight: parseInt(utils.reverseHex(i[1]), 16)
//                 }
//             }) : [],
//             startTime: String(formatNumber(item[4])).length <= 10 ?  formatNumber(item[4]) * 1000 : formatNumber(item[4]),
//             endTime: String(formatNumber(item[5])).length <= 10 ?  formatNumber(item[5]) * 1000 : formatNumber(item[5]),
//             approves: formatNumber(item[6]),
//             rejects: formatNumber(item[7]),
//             status: formatNumber(item[8]),
//             hash: item[9]
//         }
//         if (vote.status === 0) {
//             vote.statusText = VOTE_STATUS_TEXT.CANCELED
//         } else {
//             const now = Date.now()
//             if (vote.startTime > now) {
//                 vote.statusText = VOTE_STATUS_TEXT.NOT_START
//             } else if (vote.startTime <= now && vote.endTime >= now) {
//                 vote.statusText = VOTE_STATUS_TEXT.IN_PROGRESS
//             } else if (vote.endTime < now) {
//                 vote.statusText = VOTE_STATUS_TEXT.FINISHED
//             }
//         }

//         votes.push(vote)
//     }
//     return votes;
// }

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
    },
    UPDATE_ALL_VOTERS(state, { all_voters }) {
        state.all_voters = all_voters
    },
    UPDATE_CURRENT_VOTE_RECORDS(state, { records }) {
        state.current_vote_records = records
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
            const tx = TransactionBuilder.makeWasmVmInvokeTransaction('listAdmins', [], contract, gasPrice, gasLimit)
            const res2 = await client.sendRawTransaction(tx.serialize(), true);
            // console.log(res2)
            let is_voter = false
            let weight = 0
            const all_voters = res1.result.map(item => ({ name: item.name, address: item.address, weight: item.current_stake }))
            commit('UPDATE_ALL_VOTERS', { all_voters })
            for (let node of res1.result) {
                if (node.address === address) {
                    is_voter = true;
                    weight = node.current_stake
                    break;
                }
            }
            let is_admin = false
            const result = res2.Result.Result
            const sr = new utils.StringReader(result);
            const addr_length = sr.readVarUint();
            for (let i = 0; i < addr_length; i++) {
                if (new Crypto.Address(sr.read(20)).toBase58() === address) {
                    is_admin = true;
                    break;
                }
            }
            // for (let addr of res2.Result.Result) {
            //     if (new Crypto.Address(addr).toBase58() === address) {
            //         is_admin = true;
            //         break;
            //     }
            // }
            let role = [];
            if (is_voter) role.push(VOTE_ROLE.VOTER)
            if (is_admin) role.push(VOTE_ROLE.ADMIN)
            console.log(role)
            commit('UPDATE_VOTE_ROLE', { role })
            commit('UPDATE_MY_WEIGHT', { weight })
            dispatch('hideLoadingModals')
        } catch (err) {
            alert(err)
            console.log(err)
            dispatch('hideLoadingModals')
            message.error(i18n.t('common.networkErr'))
        }
    },
    async getAllVotes({ commit, dispatch }, {showLoading}) {
        showLoading && dispatch('showLoadingModals')
        const net = localStorage.getItem('net');
        const client = getRestClient()
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const tx = TransactionBuilder.makeWasmVmInvokeTransaction('listTopics', [], contract, gasPrice, gasLimit)
        try {
            const res2 = await client.sendRawTransaction(tx.serialize(), true);
            if (res2.Error !== 0) {
                throw res2;
            }
            // 处理结果
            const result = res2.Result.Result
            const sr = new utils.StringReader(result);
            const hash_length = sr.readVarUint();
            const hashes = []
            for (let i = 0; i < hash_length; i++) {
                hashes.push(sr.read(32))
            }
            // const hashes = res2.Result.Result || []
            console.log(hashes)
            const txes = hashes.map(hash => {
                return TransactionBuilder.makeWasmVmInvokeTransaction('getTopicInfo', [new Parameter('', ParameterType.H256, hash)], contract, gasPrice, gasLimit)
            })
            let infos = await Promise.all(txes.map(tx => { return client.sendRawTransaction(tx.serialize(), true) }))
            infos = infos.map(item => item.Result.Result)
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
        // dispatch('showLoadingModals')
        const address = state.voteWallet.address;
        const net = localStorage.getItem('net');
        const client = getRestClient()
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const param = new Parameter('admin', ParameterType.ByteArray, new Crypto.Address(address).serialize())
        const tx = TransactionBuilder.makeWasmVmInvokeTransaction('getTopicInfoListByAdmin', [param], contract, gasPrice, gasLimit)
        try {
            const res = await client.sendRawTransaction(tx.serialize(), true);
            if (res.Error !== 0) {
                throw res;
            }
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
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const address = state.voteWallet.address
        const addr = new Crypto.Address(address)
        const params = [
            new Parameter('', ParameterType.ByteArray, hash),
            new Parameter('', ParameterType.ByteArray, addr.serialize()),
            new Parameter('', ParameterType.Boolean, type)
        ]
        let tx = TransactionBuilder.makeWasmVmInvokeTransaction('voteTopic', params, contract, gasPrice, gasLimit, addr)
        return tx;
    },
    stopVote({ commit, dispatch, state }, { hash }) {
        const net = localStorage.getItem('net');
        const client = getRestClient()
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const address = state.voteWallet.address
        const addr = new Crypto.Address(address)
        const params = [
            new Parameter('', ParameterType.ByteArray, hash)
        ]
        let tx = TransactionBuilder.makeWasmVmInvokeTransaction('cancelTopic', params, contract, gasPrice, gasLimit, addr)
        return tx;
    },
    createVote({ commit, dispatch, state }, { vote }) {
        const net = localStorage.getItem('net');
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const address = state.voteWallet.address
        const addr = new Crypto.Address(address)
        const voters = state.all_voters;
        const params = [
            new Parameter('', ParameterType.ByteArray, addr.serialize()),
            new Parameter('', ParameterType.String, vote.title),
            new Parameter('', ParameterType.String, vote.content),
            new Parameter('', ParameterType.Integer, vote.startTime),
            new Parameter('', ParameterType.Integer, vote.endTime),
            new Parameter('', ParameterType.Array, voters.map(voter =>
                new Parameter('', ParameterType.Array, [
                    new Parameter('', ParameterType.Address, new Crypto.Address(voter.address)),
                    new Parameter('', ParameterType.Integer, voter.weight)
                ]
            )))
        ]
        let tx = TransactionBuilder.makeWasmVmInvokeTransaction('createTopic', params, contract, gasPrice, gasLimit, addr)
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
        let tx = TransactionBuilder.makeWasmVmInvokeTransaction('setVoterForTopic', params, contract, gasPrice, gasLimit, addr)
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
        const tx = TransactionBuilder.makeWasmVmInvokeTransaction('getVoters', [param], contract, gasPrice, gasLimit)
        const res = await client.sendRawTransaction(tx.serialize(), true);
        if (res.Error === 0) {
            const voters = res.Result.Result.map(i => {
                return {
                    address: new Crypto.Address(i[0]).toBase58(),
                    weight: parseInt(utils.reverseHex(i[1]), 16)
                }
            })
            console.log(voters)
            return voters;
        } else {
            console.log(res)
            return []
        }
    },

    async isVoter({ commit, dispatch, state }, { hash }) {
        const voters = await dispatch('getVoters', {hash})
        const address = state.voteWallet.address;
        if (voters.find(item => item.address === address)) {
            return true;
        } else {
            return false;
        }
    },

    async getVotedInfo({ commit }, { hash, address }) {
        const net = localStorage.getItem('net');
        const client = getRestClient()
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const params = [
            new Parameter('', ParameterType.ByteArray, hash),
            new Parameter('', ParameterType.Address, new Crypto.Address(address))
        ]
        const tx = TransactionBuilder.makeWasmVmInvokeTransaction('getVotedInfo', params, contract, gasPrice, gasLimit)
        const res = await client.sendRawTransaction(tx.serialize(), true);
        console.log(res)
        if (res.Error === 0) {
            // return res.Result.Result // 1 赞成；2反对；其他：未投票
            const result = formatNumber(res.Result.Result);
            if (result == 1) {
                return MY_VOTED.APPROVED
            } else if (result == 2) {
                return MY_VOTED.REJECTED
            } else {
                return MY_VOTED.NOT_VOTED
            }
        }
        return;
    },

    async getVotedRecords({ commit, dispatch, state }, { hash }) {
        const net = localStorage.getItem('net');
        const client = getRestClient()
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const params = [
            new Parameter('', ParameterType.ByteArray, hash)
        ]
        const tx = TransactionBuilder.makeWasmVmInvokeTransaction('getVotedAddress', params, contract, gasPrice, gasLimit)
        const res = await client.sendRawTransaction(tx.serialize(), true);
        console.log(res)
        if (res.Error === 0) {
            const result = res.Result.Result || []
            const records = result.map(i => {
                return {
                    address: new Crypto.Address(i[0]).toBase58(),
                    isApproval: formatNumber(i[1]) === 1 ? true : false
                }
            })
            const voters = await dispatch('getVoters', {hash})
            for (let item of records) {
                for (let voter of voters) {
                    if (voter.address === item.address) {
                        const voter_with_name = state.all_voters.find(item => item.address === voter.address)
                        item.name = voter_with_name ? voter_with_name.name : ''
                        item.weight = voter.weight
                    }
                }
            }
            commit('UPDATE_CURRENT_VOTE_RECORDS', {records})
        }
        return;
    },
    
    setCurrentVote({ commit }, { vote }) {
        commit('UPDATE_CURRENT_VOTE', {vote})
    },
    async updateCurrentVote({ commit }, { hash }) {
        const net = localStorage.getItem('net');
        const client = getRestClient()
        const contract = new Crypto.Address(utils.reverseHex(contract_hash[net]))
        const params = [
            new Parameter('', ParameterType.ByteArray, hash)
        ]
        const tx = TransactionBuilder.makeWasmVmInvokeTransaction('getTopicInfo', params, contract, gasPrice, gasLimit)
        const res = await client.sendRawTransaction(tx.serialize(), true);
        console.log(res)
        if (res.Error === 0) {
            const votes = formatVoteInfo([res.Result.Result])
            console.log(votes)
            commit('UPDATE_CURRENT_VOTE', { vote: votes[0]})
        }
    }

}

export default {
    state,
    mutations,
    actions
}
