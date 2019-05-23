import axios from 'axios'


const state = {
    wallet : {
        // for json and hardware wallet
        publicKey: '',
        address: '',
        //for shared wallet
        coPayers: [],
        requiredNumber:'',
        totalNumber:''
    },
    balance: {
        ont: 0,
        ong: 0,
        waitBoundOng:0,
        unboundOng: 0
    },
    transfer: {
        balance : {
            ont: 0,
            ong: 0
        },
        oep4s:[],
        from:'',
        to: '',
        amount:0,
        asset:'ONT',
        gas:0.01,
        coPayers : [],
        sponsorPayer:'',
        isRedeem: false
    },
    pendingTx: {
        
    },
    currentSigner: '',
    localCopayers : [],
    redeem: {
        claimableOng: 0,
        balanceOng: 0
    },
    nep5Ont: 0
}

const mutations = {
    UPDATE_CURRENT_WALLET(state, payload){
        state.wallet = Object.assign({}, state.wallet, payload.wallet);
    },
    UPDATE_TRANSFER(state, payload) {
        state.transfer = Object.assign({}, state.transfer, payload.transfer)
    }, 
    UPDATE_LOCAL_COPAYERS(state, payload) {
        state.localCopayers = payload.localCopayers
    },
    UPDATE_PENDINGTX(state, payload) {
        state.pendingTx = payload.pendingTx
    },
    UPDATE_CURRENT_SIGNER(state, payload) {
        state.currentSigner = payload.account
    },
    UPDATE_NATIVE_BALANCE(state, payload) {
        state.balance = payload.balance
    },
    CLEAR_NATIVE_BALANCE(state, payload) {
        state.balance = {}
    },
    CLEAR_CURRENT_TRANSFER(state, payload) {
        state.transfer = {
            balance: {
                ont: 0,
                ong: 0
            },
            oep4s: [],
            from: '',
            to: '',
            amount: 0,
            asset: 'ONT',
            gas: 0.01,
            coPayers: [],
            sponsorPayer: ''
        }
    },
    UPDATE_CURRENT_REDEEM(state, payload) {
        state.redeem = payload.redeem
    },
    UPDATE_NEP5_ONT(state, payload) {
        state.nep5Ont = payload.nep5Ont
    },
    UPDATE_TRANSFER_REDEEM_TYPE(state, payload) {
        state.transfer.isRedeem = payload.type;
        state.transfer.asset = payload.type ? 'ONG' : 'ONT'
    }

}

const actions = {
    clearTransferBalance({commit}) {
        commit('CLEAR_CURRENT_TRANSFER')
    },
    getNativeBalance({commit}, {address}) {
        const network = localStorage.getItem('net')
        const urlNode = network === 'TEST_NET' ? 'https://polarisexplorer.ont.io' : 'https://explorer.ont.io';
        const url = `${urlNode}/api/v1/explorer/address/balance/${address}`
        const balance = {}
        return axios.get(url).then(res => {
          if (res.data.Result) {
            for (let r of res.data.Result) {
              if (r.AssetName === 'ong') {
                balance.ong = r.Balance;
              }
              if (r.AssetName === 'waitboundong') {
                balance.waitBoundOng = r.Balance;
              }
              if (r.AssetName === 'unboundong') {
                balance.unboundOng = r.Balance;
              }
              if (r.AssetName === 'ont') {
                balance.ont = r.Balance;
              }
            }
            commit('UPDATE_NATIVE_BALANCE', {
              balance
            })
            return balance; // get balance succeed
          }
        }).catch(err => {
          console.log(err)
          return null; // get balance failed
        })
    }
}

export default {
    state,
    mutations,
    actions
}
