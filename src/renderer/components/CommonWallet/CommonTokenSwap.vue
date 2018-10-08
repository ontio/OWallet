<style scoped>

  .content-container {
    display: flex;
    margin-top: 40px;
  }

  .left-half {
    flex-basis: 50%;
    padding:10px 15px;
  }

  .right-half {
    flex-basis: 50%;
    padding: 10px 20px;
  }
  .swap-btns {
      width:70%;
      margin:30px auto;
  }
  .swap-btns :last-child {
      float: right;
  }
  .error-amount {
      border-color:red !important;
  }
</style>
<template>
    <div>
        <breadcrumb :current="$t('commonWalletHome.swap')" :routes="routes"
                v-on:backEvent="backToWallets"></breadcrumb>
        <div class="content-container">
            <div class="left-half">
                <p class="font-regular">{{$t('commonWalletHome.swapText')}}</p>
                <p class="font-regular">{{$t('commonWalletHome.stepFollow')}}</p>
                <p class="font-medium">{{$t('commonWalletHome.step1')}}</p>
                <p class="font-medium">{{$t('commonWalletHome.step2')}}</p>
                <p class="font-medium">{{$t('commonWalletHome.step3')}}</p>                
            </div>
            <div class="right-half">
                <p class="font-medium-black">{{$t('commonWalletHome.swapAmount')}}</p>
                <a-input class="input" v-model="amount"
                @change="validateAmount" :class="validAmount? '': 'error-amount'"
                ></a-input>
                <p class="font-regular">{{$t('commonWalletHome.nep5Balance')}}
                    <span class="font-medium-black">{{nep5Ont}}</span> </p>
                <p class="font-medium-black">{{$t('commonWalletHome.password')}}</p>
                <a-input class="input" v-model="password" type="password"
                @change="validatePass" :class="validPassword? '': 'error-amount'"
                ></a-input>
                <div class="swap-btns">
                     <a-button type="default" class="btn-cancel" @click="cancel">{{$t('commonWalletHome.cancel')}}</a-button>
                     <a-button type="primary" class="btn-next" @click="submit" :disabled="sending">{{$t('commonWalletHome.swap')}}</a-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Breadcrumb from '../Breadcrumb'
import {mapState} from 'vuex'
import {varifyPositiveInt} from '../../../core/utils.js'
import {SWAP_ADDRESS, DEFAULT_SCRYPT} from '../../../core/consts'
import {Crypto, SDK} from 'ontology-ts-sdk'

export default {
    name: 'CommonTokenSwap',
    data() {
        const currentWallet = JSON.parse(sessionStorage.getItem('currentWallet'))
        const routes = [{name: currentWallet.label, path:'/dashboard'}]
        return {
            currentWallet,
            routes,
            amount: 0,
            password:'',
            sending:false,
            validAmount:true,
            validPassword:true,
            nep5Ont: 0
        }
    },
    components: {
        Breadcrumb
    },
    computed: {
    },
    mounted(){
        this.getNep5Balance();
    },
    methods: {
        getNep5Balance() {
            const NEO_TRAN = 100000000;
            SDK.getNeoBalance(this.currentWallet.address).then(res => {
                if(res.result) {
                    const nep5Ont = res.result / NEO_TRAN
                    this.nep5Ont = nep5Ont;
                } else {
                    this.nep5Ont = 0;
                }
            })
        },
        backToWallets() {
            this.$router.push({name: 'Wallets'})
        },
        cancel() {
            this.$router.push('/dashboard')
        },
        validateAmount(){
            if(!this.amount || !varifyPositiveInt(this.amount)) {
                this.validAmount = false;
                return;
            }
            if(Number(this.amount) > Number(this.nep5Ont)) {
                this.validAmount = false;
                return;
            }
            this.validAmount = true;
        },
        validatePass(){
            if(!this.password ) {
                this.validPassword = false
                return;
            }
            this.validPassword = true;
        },
        submit() {
            if(!this.amount || !this.validAmount) {
                this.$message.error(this.$t('commonWalletHome.validAmount'))
                return;
            } 
            if(!this.password) {
                this.$message.error(this.$t('commonWalletHome.emptyPass'))
                return;
            }
            const from = this.currentWallet.address
            const to = SWAP_ADDRESS
            const value = this.amount;
            const encKey = this.currentWallet.key;
            const salt = this.currentWallet.salt;
            // must transform password to base when call Ont.SDK's api
            const password = Buffer.from(this.password).toString('base64');
            const params = DEFAULT_SCRYPT;
            const resp =  SDK.neoTransfer(from, to, value, encKey,password,salt,'', params)
            if(resp.then) {
                resp.then(res => {
                    if(res.result) {
                        const title = this.$t('common.transSentSuccess')
                        this.$router.push({name:'Dashboard'})
                        setTimeout(() => {
                            this.$success({
                                title: title,
                                content: 'NEP5 Transaction hash: ' + res.result
                            })
                        }, 100)
                    } else {
                        this.$message.error(this.$t('common.networkErr'))
                    }
                })
            } else {
                if(resp.error === 53000 ) {
                    this.$message.error(this.$t('common.pwdErr'))
                    return;
                }
            }
            
        }
    }
}
</script>
