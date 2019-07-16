import {Oep4, RestClient, Crypto, utils} from 'ontology-ts-sdk'
import {TEST_NET, MAIN_NET} from '../../../core/consts'
import { BigNumber } from 'bignumber.js';
import axios from 'axios';
import {
  getRestClient,
  getTokenListUrl
} from '../../../core/utils'


// Deprecated
const oep4s = localStorage.getItem('oep4s')? JSON.parse(localStorage.getItem('oep4s')) : [];

const oep4_selected = {
    'TEST_NET': [],
    'MAIN_NET': []
}

const state = {
    oep4s,
    completedTx: []
}

const mutations = {
    ADD_OEP4(state, payload) {
        const oep4s = [...state.oep4s, payload.newOep4]
        localStorage.setItem('oep4s', JSON.stringify(oep4s))
        state.oep4s = oep4s;
    },
    UPDATE_OEP4S(state, payload) {
        state.oep4s = payload.oep4s
    },
    UPDATE_OEP4_TX_LIST(state, payload) {
        state.completedTx = payload.txList
    }
}

const actions = {
    async addOep4Token({commit, dispatch, state}, {scriptHash, address})  {
        try {
            const restClient = getRestClient()
            const res = await restClient.getContract(scriptHash);
            console.log(res)
            if (!res.Result) {
                return 'NO_CONTRACT'
            } else {
                const name = await dispatch('queryOep4Name', scriptHash)
                const symbol = await dispatch('queryOep4Symbol', scriptHash)
                const decimal = await dispatch('queryOep4Decimal', scriptHash)
                const balance = await dispatch('queryOep4Balance', {scriptHash, address, decimal})
                const net = localStorage.getItem('net')
                const newOep4 = {name, symbol, scriptHash, decimal, balance, net}
                commit('ADD_OEP4', {newOep4})
                dispatch('registerOep4Info', scriptHash)
                dispatch('queryTxForOep4', {address, oep4s: [...state.oep4s, newOep4]})
                return 'ADD_SUCCESS'
            }
        } catch(err) {
            console.log(err)
            return 'NETWORK_ERROR'
        }
    },

    async registerOep4Info({commit, dispatch}, scriptHash) {
        const net = localStorage.getItem('net');
        let url = ''
        if(net === 'TEST_NET') {
            url = 'https://polarisexplorer.ont.io/api/v1/explorer/oep4/info'
        } else {
            url = 'https://explorer.ont.io/api/v1/explorer/oep4/info'
        }
        axios.post(url, {
            scriptHash
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    },

    async queryOep4Name({commit}, scriptHash) {
        const contractAddr = new Crypto.Address(utils.reverseHex(scriptHash));
        const oep4 = new Oep4.Oep4TxBuilder(contractAddr);
        const tx = oep4.queryName();
        const restClient = getRestClient()
        const res = await restClient.sendRawTransaction(tx.serialize(), true);
        if(res.Result.Result) {
            const val = utils.hexstr2str(res.Result.Result);
            return val;
        } else {
            return 'OEP4'
        }
    },
    async queryOep4Symbol({ commit }, scriptHash) {
        const contractAddr = new Crypto.Address(utils.reverseHex(scriptHash));
        const oep4 = new Oep4.Oep4TxBuilder(contractAddr);
        const tx = oep4.querySymbol();
        const restClient = getRestClient()
        const res = await restClient.sendRawTransaction(tx.serialize(), true);
        if (res.Result.Result) {
            const val = utils.hexstr2str(res.Result.Result);
            return val;
        } else {
            return 'OEP4'
        }
    },
    async queryOep4Decimal({ commit }, scriptHash) {
        const contractAddr = new Crypto.Address(utils.reverseHex(scriptHash));
        const oep4 = new Oep4.Oep4TxBuilder(contractAddr);
        const tx = oep4.queryDecimals();
        const restClient = getRestClient()
        const res = await restClient.sendRawTransaction(tx.serialize(), true);
        if (res.Result.Result) {
            const val = parseInt(res.Result.Result, 16);
            return val;
        } else {
            return 0
        }
    },
    async queryOep4Balance({commit}, {scriptHash, address, decimal=0}) {
        const contractAddr = new Crypto.Address(utils.reverseHex(scriptHash));
        const oep4 = new Oep4.Oep4TxBuilder(contractAddr);
        const tx = oep4.queryBalanceOf(new Crypto.Address(address));
        const restClient = getRestClient()
        const res = await restClient.sendRawTransaction(tx.serialize(), true);
        if(res.Result.Result) {
            const bi = new BigNumber(utils.reverseHex(res.Result.Result), 16)

            const val = bi.dividedBy(Math.pow(10,decimal)).toNumber()
            return val;
        } else {
            return 0;
        }
    },
    async queryBalanceForOep4({commit, dispatch, state}, address) {
        dispatch('showLoadingModals');
        try {
            const net = localStorage.getItem('net');

            const temp = await Promise.all(state.oep4s.map((item) => {
                    if(item.net !== net) { // 避免多余的查询
                        return Promise.resolve(0)
                    }
                    return dispatch('queryOep4Balance', {
                        scriptHash: item.scriptHash,
                        address,
                        decimal: item.decimal
                    })
                })
            )
            console.log(temp);
            const newOep4s = state.oep4s.map((item, index) => ({
                ...item,
                balance: temp[index]
            }))
            commit('UPDATE_OEP4S', {oep4s: newOep4s})
            dispatch('hideLoadingModals');            
        } catch(err) {
            dispatch('hideLoadingModals');
            console.log(err);
            alert('Network error.Please try later.')
        }
    },
    async queryTxForOep4({commit, dispatch}, {address,oep4s}) {
        const net = localStorage.getItem('net')
        const url = net === 'TEST_NET' ? 'https://polarisexplorer.ont.io' : 'https://explorer.ont.io';
        axios.get(url + '/api/v1/explorer/address/' + address + '/10/1').then(response => {
            if (response.status === 200 && response.data && response.data.Result) {
                const txlist = response.data.Result.TxnList;
                const completed = []
                for (const t of txlist) {
                    // if(t.TransferList.length === 1 && t.TransferList[0].ToAddress === ONG_GOVERNANCE_CONTRACT) {
                    //   continue;
                    // }
                    for (const tx of t.TransferList) {
                        if(tx.AssetName === 'ong'){
                            continue;
                        } 
                        for(let o of oep4s) {
                            let amount = tx.Amount
                            if(o.symbol === tx.AssetName || tx.AssetName === 'LCY') { // They give the wrong symbol for token LUCKY
                                if (tx.FromAddress === address) {
                                    amount = '-' + amount;
                                } else {
                                    amount = '+' + amount;
                                }
                                completed.push({
                                    txHash: t.TxnHash,
                                    asset: tx.AssetName,
                                    amount: amount
                                })
                                break;
                            }
                        }
                        
                    }

                }
                commit('UPDATE_OEP4_TX_LIST', {txList: completed})
            }
        }).catch(err => {
            dispatch('hideLoadingModals');
            console.log(err)
        })
    }
}

export default {
    state,
    mutations,
    actions
}
