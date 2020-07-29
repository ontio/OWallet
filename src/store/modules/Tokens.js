import httpService, {
  getRestClient,
  getTokenListUrl,
  getTokenBalanceUrl
} from '../../core/utils'

// should contain native, oep4, oep5, oep8 tokens
const oep4_default = {
  'TEST_NET': {},
  'MAIN_NET': {}
}
const oep4Tokens = localStorage.getItem('oep4Tokens') ? JSON.parse(localStorage.getItem('oep4Tokens')) : oep4_default;



/*

*/

const state = {
    oep4Tokens,
    oep4WithBalances: []
}

const mutations = {
    UPDATE_OEP4_TOKENS(state, {oep4s}) {
        const net = localStorage.getItem('net')
        state.oep4Tokens[net] = oep4s;
        localStorage.setItem('oep4Tokens', JSON.stringify(state.oep4Tokens))
    },
    UPDATE_OEP4_TOKEN(state, {oep4}) {
        const net = localStorage.getItem('net')
        const oep4s = Object.assign({}, state.oep4Tokens[net]);
        if(oep4s[oep4.contract_hash]) {
            for (let k of Object.keys(oep4s)) {
              if (oep4s[k].contract_hash === oep4.contract_hash) {
                  if(oep4.selected) {
                      oep4s[k].selected = oep4.selected;
                  } else {
                      delete oep4s[k];
                  }
                break;
              }
            }
        } else {
            oep4s[oep4.contract_hash] = oep4;
        }

        state.oep4Tokens[net] = oep4s;
        localStorage.setItem('oep4Tokens', JSON.stringify(state.oep4Tokens))
    },
    UPDATE_OEP4_BALANCES(state, {balances}) {
        state.oep4WithBalances = balances;
    },
    CLEAR_OEP4S_BALANCES(state) {
        state.oep4WithBalances = []
    }
}

const actions = {
    async fetchOep4Selections({commit, state}, {page_size, page_number}) {
        const url = getTokenListUrl('oep4', page_size, page_number);
        const net = localStorage.getItem('net')
        const res = await httpService.get(url)
        console.log(res)
        const list = res.result.records.map(item => {
            item.selected = false;
            for(let k of Object.keys(state.oep4Tokens[net])) {
                const o = state.oep4Tokens[net][k]
                if(o.contract_hash === item.contract_hash) {
                    item.selected = o.selected;
                    break;
                }
            }
            return item;
        })
        const total = res.result.total;
        // commit('UPDATE_OEP4_SELECTIONS', {list, total})
        return {list, total}
    },

    async fetchTokenBalances({commit,state}, {address}) {
        const url = getTokenBalanceUrl('oep4',address)
        const net = localStorage.getItem('net')
        const res = await httpService.get(url)
        const balances = [];
        const oep4s = state.oep4Tokens[net];
        for (let k of Object.keys(oep4s)) {
            const oep4 = oep4s[k]
            const item = Object.assign({}, oep4)
            item.balance = 0;
            for(let r of res.result) {
                console.log(r.asset_name, oep4.symbol)
                if (r.asset_name === oep4.symbol) {
                    item.balance = r.balance;
                    break;
                }
            }
            balances.push(item)
        }
        console.log(balances)
        commit('UPDATE_OEP4_BALANCES', {
          balances
        })
        return balances
    }
}

export default {
    state,
    mutations,
    actions
}
