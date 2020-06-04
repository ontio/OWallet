<style scoped>
.intro-content {
  width: 540px;
  margin: 0rem auto;
}
.btn-known {
  margin: 20px auto;
  text-align: center;
}
.btn-known button {
  width: 150px !important;
}
.select-ontid {
  width: 100%;
}
.intro-item {
  margin-bottom: 15px;
}
.intro-content p {
  margin-bottom: 5px;
}
.change-payer-radio {
    width:100%;
}
.payer-radio-item {
    margin-bottom:15px;
}
</style>
<template>
    <div>
        <breadcrumb  :current="$t('nodeStake.nodeStake')" v-on:backEvent="handleRouteBack"></breadcrumb>
        <div class="intro-content">
            <div class="intro-item">
                <p class="font-medium-black">{{$t('nodeStake.selectOntid')}}</p>
                <a-select :options="identities" class="select-ontid" @change="changeIdentity"></a-select>

            </div>
            <div class="intro-item">
                <p class="font-medium-black">{{$t('nodeStake.selectStakeWallet')}}</p>
                <a-radio-group @change="changePayerWallet" v-model="payerWalletType" class="change-payer-radio">
                <a-radio value="commonWallet" class="payer-radio-item">{{$t('createIdentity.commonWallet')}}</a-radio>
                <a-radio value="ledgerWallet" class="payer-radio-item">{{$t('createIdentity.ledgerWallet')}}</a-radio>

                <div v-if="payerWalletType === 'commonWallet'">
                    <a-select :options="normalWallet" class="select-ontid" 
                    :placeholder="$t('createIdentity.selectCommonWallet')"
                        @change="handleChangePayer">
                    </a-select>
                </div>

                <div v-if="payerWalletType === 'ledgerWallet'">

                    <div class="payer-ledger-status">
                    <div class="font-bold" style="margin-bottom: 10px;">{{$t('ledgerWallet.connectApp')}}</div>
                    <span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span>
                    <span class="font-medium">{{ledgerStatus}} </span>
                    </div>
                    
                </div>

                </a-radio-group>
            </div>
        </div>
        <div class="footer-btns">
            <div class="btn-known">
                <a-button type="primary" class="btn-next" @click="next">{{$t('nodeStake.next')}}</a-button>
            </div>
        </div>
    </div>
</template>

<script>
import Breadcrumb from "../../Breadcrumb";
import { mapState } from "vuex";
import axios from 'axios'
import {ONT_PASS_NODE, ONT_PASS_NODE_PRD, ONT_PASS_URL} from '../../../../core/consts'
export default {
  name: "NodeStakeIntro",
  data() {
    return {
        payerWalletType: 'commonWallet',
        payerWallet: '',
        stakeIdentity: '',
        payerWalletAddress:''
    };
  },
  components: {
    Breadcrumb
  },
  mounted() {
    this.$store.dispatch("fetchWalletsFromDb");
    this.$store.dispatch("fetchIdentitiesFromDb");
  },
  beforeDestroy(){
      this.$store.dispatch('stopGetLedgerStatus')
   },
  computed: {
      ...mapState({
        ledgerStatus: state => state.LedgerConnector.ledgerStatus,
        ledgerPk : state => state.LedgerConnector.publicKey,
        ledgerWallet: state => state.LedgerConnector.ledgerWallet
      }),
    normalWallet: {
      get() {
        const list = this.$store.state.Wallets.NormalWallet.slice();
        return list.map(i => {
          return Object.assign({}, i, {
            label: i.label + " " + i.address,
            value: i.address
          });
        });
      }
    },
    hardwareWallet: {
      get() {
        const list = this.$store.state.Wallets.HardwareWallet.slice();
        return list.map(i => {
          return Object.assign({}, i, {
            label: i.label + " " + i.address,
            value: i.address
          });
        });
      }
    },
    identities: {
      get() {
        const list = this.$store.state.Identities.Identities.slice();
        return list.map(i => {
          return Object.assign({}, i, {
            label: i.label + " " + i.ontid,
            value: i.ontid
          });
        });
      }
    }
  },
  methods: {
    handleRouteBack() {
      this.$router.go(-1);
    },
    next() {     
        if(!this.stakeIdentity) {
            this.$message.error(this.$t('nodeStake.selectIdentity'))
            return;
        }
        if(this.payerWalletType === 'commonWallet' && !this.payerWallet) {
            this.$message.error(this.$t('nodeStake.selectIndividualWallet'))
            return;
        }
        if(this.payerWalletType === 'ledgerWallet' && !this.ledgerWallet.address) {
            this.$message.error(this.$t('nodeStake.selectLedgerWallet'))
            return;
        }
     //get qualified state
     let address = '',
        stakeWallet = ''
     if(this.payerWalletType === 'commonWallet' && this.payerWallet){
        address = this.payerWallet.address
        stakeWallet = this.payerWallet
     } else {
         address = this.ledgerWallet.address
         stakeWallet = this.ledgerWallet
     }
     this.$store.dispatch('showLoadingModals')
     const net = localStorage.getItem('net')
     const ontPassNode = net === 'TEST_NET' ? ONT_PASS_NODE : ONT_PASS_NODE_PRD
     axios.get(ontPassNode + ONT_PASS_URL.GetQualifiedState, {
         params: {
             ontid: this.stakeIdentity.ontid,
             address: address
         }
     }).then(res => {
         if(res.data.QualifiedState === 0) {
             this.$store.commit('UPDATE_STAKE_IDENTITY', {stakeIdentity: this.stakeIdentity})
             this.$store.commit('UPDATE_STAKE_WALLET', {stakeWallet: stakeWallet})             
         } else if(res.data.QualifiedState === 1) {
             this.$store.dispatch('hideLoadingModals')
             this.$message.error(this.$t('nodeStake.invalidOntid'))
             return;
         } else if(res.data.QualifiedState === 2) {
             this.$store.dispatch('hideLoadingModals')
             this.$message.error(this.$t('nodeStake.invalidAddress'))
             return;
         }
         axios.get(ontPassNode + ONT_PASS_URL.GetStakeInfo, {
             params: {
                 ontid: this.stakeIdentity.ontid
             }
         }).then(res => {
             this.$store.commit('UPDATE_STAKE_DETAIL', { detail:res.data})
             if(res.data.status) {
                 this.$router.push({name: 'NodeStakeManagement'})
             } else {
                 this.$router.push({name: 'NodeStakeRegister'})
             }
         })
     }).catch(err => {
         console.log(err)
         this.$store.dispatch('hideLoadingModals')
         this.$message.error(this.$t('common.networkErr'))
     }) 

      
    },
    changePayerWallet(e) {
        this.payerWalletType = e.target.value
        if(e.target.value === 'ledgerWallet') {
            this.$store.dispatch('getLedgerStatus')
        }
      },
    handleChangePayer(value) {
        this.payerWallet = this.normalWallet.find((v)=>{return v.address === value})
    },
    changeIdentity(value) {
        this.stakeIdentity = this.identities.find(v => v.ontid === value)
    }
  }
};
</script>
