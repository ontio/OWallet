<style scoped>
.tx-container {
    padding:20px 60px;
    text-align: left;
}
.tx-title {
    font-size: 18px;
    font-weight: 500;
}
.tx-content {
    margin:0 30px;
}
.input-item {
    display: flex;
    margin-bottom:15px;
}
.input-item input, textarea {
    flex:1;
}
.input-itme textarea {
    height:130px;
}
.label {
    width:200px;
    margin-right:10px;         
}
.select-sponsor {
    flex:1;
}
.btns-container {
    margin: 30px auto;
    text-align: center;
}
</style>
<template>
    <div class="tx-container">
        <p class="tx-title">{{$t('sharedTx.addSign')}}</p>
        <div class="tx-content">
             <div class="input-item">
                 <p class="label">{{$t('sharedTx.txContent')}}</p>
                 <a-textarea v-model="txbody"></a-textarea>
            </div>           
        </div>
        <p class="tx-title">{{$t('sharedTx.currentSign')}}</p>
        <div class="tx-content">
            <div class="input-item">
                <span class="label">{{$t('sharedTx.selectSigner')}}</span>
                <a-select :options="localSigners" class="select-sponsor"  @change="handleChangeSigner"></a-select>
            </div>
        
            <common-sign-shared
                ref="commonSign"
                :wallet="signer" 
                @sharedTxSigned="handleTxSigned">
            </common-sign-shared>
        </div>
            
        <div class="btns-container">        
                <a-button type="primary" class="btn-next" @click="confirm">
                {{$t('pax.confirm')}}</a-button>
            </div>
        
        <a-modal
            :title="$t('sharedTx.addSign')"
            :visible="visible"
            @cancel="handleCopy"
            >
            <template slot="footer">
                <a-button type="default"  @click="handleCopy">
                {{$t('sharedTx.copy')}}
                </a-button>
                <a-button  type="primary" key="submit" :loading="loading" @click="handleSend" v-if="canSendTx">
                {{$t('sharedTx.send')}}
                </a-button>
            </template>
            <p>{{$t('sharedTx.txSerialized')}} </p>
            <p>{{serializedTx}}</p>
            <p v-if="canSendTx">{{$t('sharedTx.isSendTxTip')}}</p>
        </a-modal>
    </div>
</template>
<script>
import {getNodeUrl, getRestClient} from '../../../../core/utils'
import {Transaction, Crypto, TransactionBuilder, TxSignature, utils, RestClient} from 'ontology-ts-sdk'
import CommonSignShared from '../../Common/CommonSignShared'

export default {
    name: 'SignSharedTx',
    props: ['localSigners', 'sharedWallet'],
    data() {
        return {
            txbody: '',
            signer: '',
            canSendTx: false,
            loading: false,
            visible: false,
            serializedTx: ''
        }
    },
    components: {
        CommonSignShared
    },
    methods: {
        handleChangeSigner(value) {
            for(let p of this.sharedWallet.coPayers) {
                if(p.address !== value) {
                } else {
                    this.signer = this.localSigners.find(item=> item.address === value)
                }
            }
        },
        varifyForm() {
            if(!this.txbody || !this.signer) {
                return false;
            } else {
                return true;
            }
        },
        confirm() {
            const isFirstSign = false;
            this.txbody = this.txbody.trim();
            if(this.varifyForm()) {
                this.$refs.commonSign.signSharedTx(isFirstSign, this.txbody);
            } else {
                this.$message.error(this.$t('sharedTx.paramsError'))
            }
        },
         handleTxSigned(tx) {
            const M = this.sharedWallet.requiredNumber;
            const txBefore = Transaction.deserialize(tx)
            const sigNumBefore = txBefore.sigs[0].sigData.length;
            if(sigNumBefore >= M) {
                this.canSendTx = true;
            }
            this.serializedTx = tx;
            this.visible = true;
        },
        handleCopy() {
            this.$copyText(this.serializedTx);
            this.$message.success(this.$t('common.copied'))
            this.clearData()
        },
        clearData() {
            this.txbody = '';
            this.serializedTx = '';
            this.visible = false;
        },

        async handleSend() {
             //send tx
            const restClient = getRestClient();
            this.$store.dispatch('showLoadingModals')
            try {
                const res = await restClient.sendRawTransaction(this.serializedTx)
                console.log(res)
                if(res.Error === 0) {
                    this.$store.dispatch('hideLoadingModals')
                    this.$message.success(this.$t('sharedTx.txSentSuccess'), 3)
                    this.clearData();
                    const title = this.$t('common.transSentSuccess')
                    setTimeout(() => {
                        this.$success({
                            title: title,
                            content: 'Transaction hash: ' + res.Result
                        })
                    }, 100)
                    return res.Result;
                } else {
                    if(res.Result.indexOf('balance insufficient') > -1 ) {
                        this.$message.error(this.$t('common.balanceInsufficient'), 5)
                    } else if(res.Result.indexOf('cover gas cost') > -1){
                        this.$message.error(this.$t('common.ongNoEnough'), 5)
                    } else {
                        this.$message.error(res.Result, 5)
                    }
                    this.$store.dispatch('hideLoadingModals')
                    return '';
                }
            }catch(err) {
                console.log(err)
                this.$message.success(this.$t('commonWalletHome.networkError'))
                return '';
            }
        }
    }
}
</script>
