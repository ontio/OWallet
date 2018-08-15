<style scoped>
.content-container {
    width:540px;
    margin:20px auto;
}
.label {
    font-family: AvenirNext-Bold;
    font-size: 14px;
    color: #000000;
    margin-bottom:30px;
}
.qrcode {
    text-align:center;
    margin-bottom:40px;
}
.address-item {
    margin-bottom: 20px;
}
.address-item  :first-child{
    width:40%;
    float: left;
    font-family: AvenirNext-Regular;
    font-size: 14px;
    color: #000000;
}

.value-item {
    width:60%;
    float:right;
}
.value-item :first-child {
    width:280px;
    display: block;
    float: left;
    word-break: break-all;
}
.font-regular {
    font-family: AvenirNext-Regular;
    font-size: 14px;
    color: #000000;
}
.copy-icon {
    width:18px;
    height:18px;
    display: inline-block;
    margin-left: 10px;
    background: url('../../assets/copy.png') center center;
    background-size: cover;
    cursor: pointer;
    margin-top:10px;
}
</style>
<template>
    <div>
        <breadcrumb :current="$t('commonWalletHome.receive')" :routes="routes" v-on:backEvent="backToWallets"></breadcrumb>
        <div class="content-container">
            <p class="label">{{$t('commonWalletHome.walletQrCode')}}</p>
            <div class="qrcode">
                <vue-qrcode :value="address" :options="{size:200}"></vue-qrcode>
            </div>
            <div class="address-item clearfix">
                <span>{{$t('commonWalletHome.walletAddress')}}</span>
                <div class="value-item">
                    <span class="font-regular">{{address}}</span>
                    <span class="copy-icon" @click="copy(address)"></span>
                </div>
            </div>
            <div class="address-item clearfix" v-if="pk">
                <span>{{$t('commonWalletHome.publicKey')}}</span>
                <div class="value-item">
                    <span class="font-regular">{{pk}}</span>
                    <span class="copy-icon" @click="copy(pk)"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb'
import VueQrcode from '@xkeshi/vue-qrcode'
export default {
    name:'CommonReceive',
    components:{
        Breadcrumb,
        VueQrcode
    },
    data() {
        const type = this.$route.params.walletType
        let wallet, walletName, routes, address, pk;
        if(type === 'commonWallet') {
            wallet = JSON.parse(sessionStorage.getItem('currentWallet'))
            walletName = wallet.label
            routes = [{name: walletName, path:'/dashboard'}]
            address = wallet.address
            pk = wallet.publicKey
        } else {
            wallet = JSON.parse(sessionStorage.getItem('sharedWallet'))
            walletName = wallet.sharedWalletName
            routes = [{name: walletName, path:'/sharedWallet/home'}]
            address = wallet.sharedWalletAddress
            pk = ''
        }

        return {
            address,
            pk,
            walletName,
            routes,
        }
    },
    mounted() {

    },
    methods: {
        backToWallets() {
            this.$router.push({name:'Wallets'})
        },
        copy(value) {
            this.$copyText(value);
            this.$message.success(this.$t('common.copied'))
        }
    }
}
</script>
