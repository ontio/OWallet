<style scoped>
    .send-container {
        width:600px;
        margin:0 auto;
        padding-bottom:5.3rem;
        overflow: auto;
    }
    .steps {
        height:68px;
        padding:0 4rem;

    }
</style>

<template>
    <div>
        <breadcrumb :routes="routes" :current="$t('sharedWalletHome.send')" v-on:backEvent="handleRouteBack"></breadcrumb>
        <div class="send-container">
            <div class="steps">
                <a-steps :current="current">
                    <a-step  v-if="!isRedeem"/>
                    <a-step  />
                    <a-step  />
                </a-steps>
            </div>
            
            <send-asset
            v-on:cancelEvent="handleCancel"
            v-on:sendAssetNext="handleSendAssetNext" 
            v-if="current ===0 && !isRedeem">
            </send-asset>
            <send-confirm
            v-if="current === 1"
            v-on:cancelEvent="handleCancel"
            v-on:sendConfirmNext="handleSendConfirmNext"
            v-on:sendConfirmBack="handleSendConfirmBack"
            ></send-confirm>
            <input-password
            v-if="current === 2"
            v-on:inputPassBack="handleInputPassBack"
            v-on:inputPassNext="handleInputPassNext"
            ></input-password>            
        </div>
    </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb'
import SendAsset from './Transfer/SendAsset'
import SendConfirm from './Transfer/SendConfirm'
import InputPassword from './Transfer/InputPassword'
import {mapState} from 'vuex'
export default {
    name: 'SharedWalletSend',
    components: {
        Breadcrumb,
        SendAsset,
        SendConfirm,
        InputPassword
    },
    computed: {
        ...mapState({
            isRedeem: state => state.CurrentWallet.transfer.isRedeem,
        })
    },
    data() {
        const sharedWallet = JSON.parse(sessionStorage.getItem('sharedWallet'));
        const routes = [{name: sharedWallet.sharedWalletName, path:'/sharedWallet/home'}]
        return {
            sharedWallet,
            routes,
            current: 0
        }
    },
    mounted(){
        this.current = this.isRedeem ? 1 : 0;
    },
    methods: {
        handleRouteBack() {
            this.$router.push({name: 'Wallets'})
        },
        handleCancel() {
            this.$router.go(-1);
        },
        handleSendAssetNext() {
            this.current = 1;
        },
        handleSendConfirmNext() {
            this.current = 2;
        },
        handleSendConfirmBack() {
            this.current = 0;
        },
        handleInputPassBack() {
            this.current = 1;
        },
        handleInputPassNext(){
            this.$router.push({path:'/sharedWallet/home'})
        },
    }
}
</script>
