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
    display: inline-block;
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
</style>
<template>
    <div>
        <breadcrumb :current="$t('sharedWalletHome.copayers')" :routes="routes" v-on:backEvent="backToWallets"></breadcrumb>
        <div class="">
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
        </div>
    </div>
</template>
<script>
import Breadcrumb from '../../Breadcrumb'
export default {
    name: 'SharedWalletCopayer',
    components: {
        Breadcrumb
    },
    data() {
        const sharedWallet = JSON.parse(sessionStorage.getItem('sharedWallet'))
        return {
            sharedWallet,
            routes:[{name:sharedWallet.sharedWalletName, path:'/sharedWallet/home'}]
        }
    },
    methods: {
        backToWallets() {
            this.$router.push({name:'Wallets'})
        }
    }
}
</script>
