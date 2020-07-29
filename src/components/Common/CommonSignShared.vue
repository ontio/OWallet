<style scoped>
.sign-container {
    display: flex;
}
.label {
    width:200px;
     margin-right:10px;
}
.sign-content {
    flex:1;

}

</style>
<template>
    <div class="sign-container">
        <p class="label">{{$t('sharedTx.signTx')}}</p>

        <div class="sign-content">
            <div v-if="wallet.type === 'CommonWallet'">
                <a-input type="password" class="input-pass" :placeholder="$t('pax.inputPassword')" v-model="password"></a-input>
            </div>

            <div class="ledger-status" v-if="wallet.type === 'HardwareWallet'">
                <div class="font-bold" style="margin-bottom: 15px;">{{$t('ledgerWallet.connectApp')}}</div>
                <span class="font-medium-black">{{$t('ledgerWallet.status')}}: </span>
                <span class="font-medium">{{ledgerStatus}} </span>
                <p>{{$t('pax.ledgerSignMultiTimes')}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {DEFAULT_SCRYPT} from '../../core/consts'
import {decryptWallet} from '../../core/utils'
import {legacySignWithLedger} from '../../core/ontLedger'
import {Crypto, Transaction, TransactionBuilder, TxSignature, utils, RestClient} from 'ontology-ts-sdk'

export default {
    name: 'SignSharedTx',
    props: ['wallet'],
    data() {
        const sharedWallet = JSON.parse(sessionStorage.getItem('sharedWallet'));
        return {
            password: '',
            sharedWallet
        }
    },
    mounted(){
        if(this.wallet.type === 'HardwareWallet') {
            this.$store.dispatch('getLedgerStatus')
        }
    },
    beforeDestroy() {
        clearInterval(this.intervalId);
        this.$store.dispatch('stopGetLedgerStatus')
    },
    computed:{
        ...mapState({
            ledgerStatus: state => state.LedgerConnector.ledgerStatus,
            ledgerPk : state => state.LedgerConnector.publicKey,
            ledgerWallet: state => state.LedgerConnector.ledgerWallet,
        })
    },
    methods: {
        async signSharedTx(isFirstSign, tx) {
            if(this.wallet.type === 'CommonWallet' && !this.password
            || this.wallet.type === 'HardwareWallet' && !this.ledgerPk) {
                return;
            }
            const M = this.sharedWallet.requiredNumber;
            const pks = this.sharedWallet.coPayers.map(p => new Crypto.PublicKey(p.publickey))
           const txTemp = Transaction.deserialize(tx)
            if (this.wallet.type === 'CommonWallet') {
                const pri = decryptWallet({
                    key: this.wallet.wallet.key,
                    address: this.wallet.address,
                    salt: this.wallet.wallet.salt
                    }, this.password);
                if (!pri) {
                    return;
                }
                TransactionBuilder.signTx(txTemp, M, pks, pri)
            } else {
                txTemp.payer = new Crypto.Address(this.wallet.sharedWalletAddress);
                let res;
                try {
                    res = await legacySignWithLedger(txTemp.serializeUnsignedData())
                } catch(err) {
                    this.ledgerStatus = '';
                    this.$store.dispatch('hideLoadingModals')
                    alert(err.message)
                    return;
                }
                const sig = new TxSignature();
                sig.M = M;
                sig.pubKeys = pks;
                if(isFirstSign) {
                    sig.sigData = ['01' + res];
                    txTemp.sigs.push(sig);
                } else {
                    const sigVal = '01' + res;
                    txTemp.sigs[0].sigData.push(sigVal);
                }

            }
            this.$emit('sharedTxSigned', txTemp.serialize())
        }
    }
}
</script>
