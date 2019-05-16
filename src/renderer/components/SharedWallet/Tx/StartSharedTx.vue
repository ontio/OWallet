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
        <p class="tx-title">{{$t('sharedTx.createTx')}}</p>
        <div class="tx-content">
             <div class="input-item">
                 <p class="label">{{$t('sharedTx.contractHash')}}</p>
                 <a-input v-model="contractHash"></a-input>
            </div>   
            <div class="input-item">
                 <p class="label">{{$t('sharedTx.method')}}</p>
                 <a-input v-model="method"></a-input>
            </div>       
            <div class="input-item">
                 <p class="label">{{$t('sharedTx.parameters')}}</p>
                 <a-textarea row="3" v-model="parameters"></a-textarea>
            </div>                 
        </div>
        <p class="tx-title">{{$t('sharedTx.starterSign')}}</p>
        <div class="tx-content">
            <div class="input-item">
                <span class="label">{{$t('sharedTx.selectSponsor')}}</span>
                <a-select :options="localSigners" class="select-sponsor"  @change="handleChangeSponsor"></a-select>
            </div>
        
            <common-sign-shared 
                ref="commonSign"
                :tx="tx" 
                :wallet="sponsorPayer" 
                @sharedTxSigned="handleTxSigned">
            </common-sign-shared>
        </div>
            
        <div class="btns-container">        
                <a-button type="primary" class="btn-next" @click="confirm">
                {{$t('pax.confirm')}}</a-button>
            </div>
        
        <a-modal
            :title="$t('sharedTx.startTx')"
            :visible="visible"
            >
            <template slot="footer">
                <a-button type="primary"  @click="handleOk">
                {{$t('sharedTx.copy')}}
                </a-button>
            </template>
            <p>{{$t('sharedTx.txSerialized')}} </p>
            <p>{{serializedTx}}</p>
        </a-modal>
    </div>
</template>
<script>
import CommonSignShared from '../../Common/CommonSignShared'
import {utils, TransactionBuilder, Crypto} from 'ontology-ts-sdk'
export default {
    name: 'StartSharedTx',
    props: ['sharedWallet','localSigners'],

    components: {
        CommonSignShared
    },
    data() {
        return {
            tx: '',
            sponsorPayer: '',
            visible: false,
            serializedTx: '',
            contractHash: '',
            method: '',
            parameters: ''
        }
    },
    methods: {
        handleChangeSponsor(value,option) {
            const payers = []
            for(let p of this.sharedWallet.coPayers) {
                if(p.address !== value) {
                    payers.push(p)
                } else {
                    this.sponsorPayer = this.localSigners.find(item=> item.address === value)
                }
            }
        },
        varifyForm() {
            if(!this.contractHash || !this.method) {
                return false;
            }
            if(this.parameters) {
                try {
                    const params = JSON.parse(this.parameters)
                    if(!Array.isArray(params)) {
                        return false;
                    }
                } catch(err) {
                    return false;
                }
            }
            return true;
        },
        confirm() {
            const isFirstSign = true;
            if(this.varifyForm()) {
                const contractAddr = new Crypto.Address(utils.reverseHex(this.contractHash))
                const params = JSON.parse(this.parameters)
                const payer = new Crypto.Address(this.sharedWallet.address)
                const tx = TransactionBuilder.makeInvokeTransaction(this.method, params, contractAddr, '500', '20000', payer);
                this.tx = tx.serialize();
                this.$refs.commonSign.signSharedTx(isFirstSign);
            }
        },
        handleTxSigned(tx) {
            this.serializedTx = tx;
            this.visible = true;
        },
        handleOk() {
            this.$copyText(this.serializedTx);
            this.$message.success(this.$t('common.copied'))
            this.clearData()
        },
        clearData() {
            this.tx = '';
            this.serializedTx = '';
            this.visible = false;
        }
    }
}
</script>
