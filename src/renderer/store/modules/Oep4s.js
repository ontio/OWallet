import {Oep4, RestClient, Crypto, utils} from 'ontology-ts-sdk'
import {TEST_NET, MAIN_NET} from '../../../core/consts'
import { BigNumber } from 'bignumber.js';
import axios from 'axios';

function getRestClient() {
    const net = localStorage.getItem('net');
    let url = ''
    if (net === 'TEST_NET') {
        url = TEST_NET + ':20334'
    } else {
        url = MAIN_NET + ':20334'
    }
    const restClient = new RestClient(url);
    return restClient;
}

const oep4s = localStorage.getItem('oep4s')? JSON.parse(localStorage.getItem('oep4s')) : [];

const state = {
    oep4s,
    balance:{ont:0, ong:0}
}

const mutations = {
    ADD_OEP4(state, payload) {
        const oep4s = [...state.oep4s, payload.newOep4]
        localStorage.setItem('oep4s', JSON.stringify(oep4s))
        state.oep4s = oep4s;
    },
    UPDATE_ONT_BALANCE(state, payload) {
        state.balance = payload.balance
    },
    UPDATE_OEP4S(state, payload) {
        state.oep4s = payload.oep4s
    }
}

const actions = {
    async addOep4Token({commit, dispatch}, {scriptHash, address})  {
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
                return 'ADD_SUCCESS'
            }
        } catch(err) {
            console.log(err)
            return 'NETWORK_ERROR'
        }
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
        const net = localStorage.getItem('net')
        const urlNode = net === 'TEST_NET' ? 'https://polarisexplorer.ont.io' : 'https://explorer.ont.io';
        const url = `${urlNode}/api/v1/explorer/address/balance/${address}`
        dispatch('showLoadingModals');
        try {
            const res = await axios.get(url)
            let ontBalance = {ont:0, ong:0};
            if (res.data.Result) {
                for (let r of res.data.Result) {
                    if (r.AssetName === 'ong') {
                        ontBalance.ong = r.Balance;
                    }
                    if (r.AssetName === 'ont') {
                        ontBalance.ont = r.Balance;
                    }
                }
                commit('UPDATE_ONT_BALANCE', {balance: ontBalance})
            }
            const temp = []
            const oep4Old = state.oep4s;
            for (let i = 0; i < oep4Old.length; i++) {
                const bi = await dispatch('queryOep4Balance', {
                    scriptHash: oep4Old[i].scriptHash,
                    address,
                    decimal: oep4Old[i].decimal
                })
                temp.push({ ...oep4Old[i]})
                temp[i].balance = bi;
            }
            commit('UPDATE_OEP4S', {oep4s: temp})
            commit('UPDATE_TRANSFER_BALANCE', {
                balance: ontBalance,
                oep4s: temp
            })
            dispatch('hideLoadingModals');            
        }catch(err) {
            console.log(err);
            alert('Network error.Please try later.')
        }
    }
}

export default {
    state,
    mutations,
    actions
}
