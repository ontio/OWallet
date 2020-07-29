<style scoped>


.wallet-info {
    margin-bottom: 20px;
}
.wallet-info-item label {
    font-weight: bold;
}

.choose-local-wallet {
    margin-bottom:15px;
}
.choose-local-wallet label {
    font-weight: bold;
}
.input-select {
    width:100%;
}

.local-wallet-info {
    padding: 10px;
    background:#52a2bb;
    color: #ffffff;
    margin-bottom:20px;
}

.input-btns {
    position: absolute;
    right: 100px;
    bottom:100px;
}

.input-btns button {
    margin-left:30px;
}
.label {
    font-family: 'PingFangSC-Semibold';
    font-size: 20px;
    color: #5E6369;
    margin-left: 172px;
}
.wallet-address {
    margin-bottom: 40px;
    margin-top: 14px;
}
.wallet-num {
    width:540px;
    margin:0 auto;
    margin-bottom:30px;
    padding-left: 38px;
}
.wallet-num-item {
    padding:6px 3px;
    border-bottom: 1px solid #DFE2E9;
}

.wallet-num-item :last-child {
 float: right;
}
.confirm-pk-box {
    width:540px;
    margin:20px auto;
    margin-bottom:40px;
}
.confirm-pk-item {
    margin-bottom:20px;
}
.confirm-requireNum {
    width:540px;
    margin:12px auto;
}

.confirm-select {
    width:100%;
}

.circle {
    text-align: center;
    border-radius:50%;
    width:1.5rem;
    height:1.5rem;
    line-height: 1.5rem;
    background:#FBE45A;
    font-family: 'AvenirNext-Medium';
    font-size:14px;
    color:#000000;
    vertical-align: middle;
    float: left;
}

.copayer-name {
    margin-left: 20px;
    font-family: 'AvenirNext-Medium';
    font-size:14px;
    color:#000000;
    float: left;
    display: block;
    width:150px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.copayer-address {
    font-family: 'AvenirNext-Medium';
    font-size:14px;
    color:#5E6369;
    float:right;
}
.input-container {
    padding-bottom:5.3rem;
    overflow:scroll;
}
.notfound {
    width:280px;
    height:228px;
    margin:5px auto;
    margin-bottom:15px;
    background:url('../../../assets/notfound.png') center center;
    background-size:cover;
}
.notfound-text {
    width:540px;
    margin: 0 auto;
}
.notfound-p {
    margin:0;
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #5E6369;
    text-align: center;
}
</style>
<template>
    <div class="input-container">
        <div class="wallet-info" v-if="sharedWallet">
            <div class="label wallet-label">{{sharedWallet.sharedWalletName}}</div>
            <div class="label wallet-address">
                {{sharedWallet.sharedWalletAddress}}
            </div>

            <div class="wallet-num">
                <div class="wallet-num-item">
                    <span class="font-medium">{{$t('importSharedWallet.totalCopayerNumber')}}</span>
                    <span class="font-medium-black">{{sharedWallet.totalNumber}}</span>
                </div>
                <div class="wallet-num-item">
                    <span class="font-medium">{{$t('importSharedWallet.requiredCopayerNumber')}}</span>
                    <span class="font-medium-black">{{sharedWallet.requiredNumber}}</span>
                </div>
            </div>
            <div class="confirm-pk-box">
                <div class="confirm-pk-item clearfix" v-for="(pk,index) in sharedWallet.coPayers" :key="pk.publickey">
                    <span class="circle">{{index+1}}</span>
                    <span class="copayer-name">{{pk.name}}</span>
                    <span class="copayer-address">{{pk.address}}</span>
                </div>
            </div>
        </div>

        <div v-if="!sharedWallet">
            <div class="notfound"></div>
            <div class="notfound-text">
                <p class="notfound-p">{{$t('importSharedWallet.sorry')}}</p>
                <p class="notfound-p">{{$t('importSharedWallet.notFound')}}</p>
            </div>
        </div>


        <div class="footer-btns">
            <div class="footer-btn-container">
                <a-button class="btn-cancel" type="default" @click="back">{{$t('importSharedWallet.back')}}</a-button>
                <a-button class="btn-next" type="primary" @click="next" :disabled="!sharedWallet">{{$t('importSharedWallet.join')}}</a-button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {Crypto} from 'ontology-ts-sdk'
import {DEFAULT_SCRYPT} from '../../../core/consts'
import dbService from '../../../core/dbService'
import en from '../../../lang/en'
import zh from '../../../lang/zh'
export default {
    name: 'InputPass',
    data() {
        const langType = localStorage.getItem('user_lang') || 'en';
        const lang = langType === 'en' ? en : zh;
        return {
            lang: lang,
        }
    },
    computed:{
        ...mapState({
            sharedWallet: state => state.ImportSharedWallet.sharedWallet
        }),
    },
    methods: {
        back() {
            this.$store.commit('SUB_IMPORT_SHARED_STEP')
        },

        next() {
            //save to db
            const that = this
            const wallet = {
                type : 'SharedWallet',
                address: this.sharedWallet.sharedWalletAddress,
                wallet: this.sharedWallet
            }
            dbService.insert(wallet, function (err,newDoc) {
                if(err) {
                    that.$message.warning(that.lang.importSharedWallet.joinBefore);
                    that.$store.commit('CLEAR_IMPORT_SHARED_STATE')
                    that.$router.push({name:'Wallets'})
                    return;
                }
                that.$message.success(that.lang.importSharedWallet.success);
                that.$store.commit('CLEAR_IMPORT_SHARED_STATE')
                that.$router.push({name:'Wallets'})
            })


        }
    }
}
</script>




