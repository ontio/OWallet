<style scoped>
.pax-container {
    text-align: center;
    position: relative;
}
</style>
<template>
    <div>
        <breadcrumb :routes="routes" :current="$t('sharedWalletHome.txMgmt')" @backEvent="handleBack"></breadcrumb>
        <div class="pax-container">
            <div class="pax-header">
                
                <a-radio-group :value="status" @change="handleStatusChange" class="status-group">
                    <a-radio-button value="0">{{$t('sharedTx.startTx')}}</a-radio-button>
                    <a-radio-button value="1">{{$t('sharedTx.signTx')}}</a-radio-button>
                </a-radio-group>
                
            </div>
            <div class="tx-content">
                <start-shared-tx v-if="status === '0'" :localSigners="localCopayers" :sharedWallet="sharedWallet"></start-shared-tx>
                <sign-shared-tx v-if="status === '1'" :localSigners="localCopayers" :sharedWallet="sharedWallet"></sign-shared-tx>
            </div>
        </div>            
    </div>
</template>

<script>
import Breadcrumb from '../../Breadcrumb'
import StartSharedTx from './StartSharedTx'
import SignSharedTx from './SignSharedTx'
import dbService from '../../../../core/dbService'

export default {
    name: 'SharedTxMgmt',
    components: {
        Breadcrumb,
        StartSharedTx,
        SignSharedTx
    },
    data() {
        const sharedWallet = JSON.parse(sessionStorage.getItem('sharedWallet'));
        const routes = [
            {name: sharedWallet.sharedWalletName, path:'/sharedWallet/home'}
        ]
        return {
            routes,
            status: '0',
            localCopayers: [],
            sharedWallet
        }
    },
    mounted() {
        this.updateLocalCopayers()
    },
    methods: {
        handleStatusChange(e) {
           this.status = e.target.value
        },
        handleBack() {
            this.$router.push({path: '/Wallets'});
        },
        updateLocalCopayers() {
            var that = this;
                const coPayers = this.sharedWallet.coPayers;
                const localCopayers = []
                dbService.find({type: {$in:['CommonWallet', 'HardwareWallet']}}, function (err, accounts) {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    for (let cp of coPayers) {
                        for (let ac of accounts) {
                            if (cp.address === ac.address) {
                                localCopayers.push(Object.assign({}, cp, {value:ac.address, label:ac.wallet.label, type: ac.type, wallet: ac.wallet}))
                            }
                        }
                    }
                    if (localCopayers.length > 0) {
                        that.localCopayers = localCopayers;
                    }
                })
        },
    }
}
</script>
