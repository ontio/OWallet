<style scoped>
.pending-container {
    width:600px;
    margin:4rem auto;
}
</style>

<template>
    <div>
        <breadcrumb :routes="routes" :current="$t('sharedWalletHome.pendingTx')" v-on:backEvent="backToWallets"></breadcrumb>
        <div class="pending-container">
            <pending-confirm 
            v-on:signEvent="handleSignEvent"
            v-if="!showInputPass"></pending-confirm>
            <pending-tx-sign 
            v-on:backEvent="handleBackEvent"
            v-on:submitEvent="handleSubmitEvent"
            v-if="showInputPass"></pending-tx-sign>
        </div>
    </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb'
import PendingConfirm from './Transfer/PendingConfirm'
import PendingTxSign from './Transfer/PendingTxSign'

export default {
    name:'PendingTxHome',
    data() {
        const sharedWallet = JSON.parse(sessionStorage.getItem('sharedWallet'));
        const routes = [{name: sharedWallet.sharedWalletName, path:'/sharedWallet/home'}]
        return {
            routes,
            showInputPass:false
        }
    },
    components: {
        Breadcrumb,
        PendingConfirm,
        PendingTxSign
    },
    methods: {
        backToWallets() {
            this.$router.push({name:'Wallets'})
        },
        handleSignEvent() {
            this.showInputPass = true;
        },
        handleBackEvent() {
            this.showInputPass = false;
        },
        handleSubmitEvent(){
            this.$router.push({path:'/sharedWallet/home'})
            //this.$store.dispatch('fetchPendingTx')
        }
    }
}
</script>
