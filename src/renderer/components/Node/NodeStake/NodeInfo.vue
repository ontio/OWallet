<template>
<div>
    <!-- <div v-if="!stakeWallet.key" class="ledger-not-support">
        <p>{{$t('nodeInfo.ledgerWalletNotSupportForNow')}}
             <a href=mailto:contact@ont.io>contact@ont.io</a>
        </p>
       
    </div> -->
    <div class="container"  >
        <div class="info-container">
        <div class="left-half">
            <div class="form-item">
                <label for="">{{$t('nodeInfo.name')}}</label>
                <a-input v-model="info.name" :placeholder="$t('nodeInfo.enterName')"></a-input>
            </div>
            <div class="form-item">
                <label for="">{{$t('nodeInfo.logo')}}</label>
                <a-input v-model="info.logo_url" :placeholder="$t('nodeInfo.enterLogo')"></a-input>
            </div>
            <div class="form-item">
                <label for="">{{$t('nodeInfo.location')}}</label>
                <a-input v-model="info.region" :placeholder="$t('nodeInfo.enterLocation')"></a-input>
            </div>
            <div class="form-item">
                <label for="">{{$t('nodeInfo.ip')}}</label>
                <a-input v-model="info.ip" :placeholder="$t('nodeInfo.enterIp')"></a-input>
            </div>
           
            <div class="form-item">
                <label for="">{{$t('nodeInfo.description')}}</label>
                <a-textarea rows="4" v-model="info.introduction" :placeholder="$t('nodeInfo.enterDesc')"></a-textarea>
            </div>
        </div>
        <div class="right-half">
            <div class="form-item">
                <label for="">{{$t('nodeInfo.website')}}</label>
                <a-input v-model="info.website" :placeholder="$t('nodeInfo.enterWebsite')"></a-input>
            </div>
            <div class="form-item">
                <label for="">{{$t('nodeInfo.telegram')}}</label>
                <a-input v-model="info.telegram" :placeholder="$t('nodeInfo.enterTelegram')"></a-input>
            </div>
            <div class="form-item">
                <label for="">{{$t('nodeInfo.twitter')}}</label>
                <a-input v-model="info.twitter" :placeholder="$t('nodeInfo.enterTwitter')"></a-input>
            </div>
            <div class="form-item">
                <label for="">{{$t('nodeInfo.facebook')}}</label>
                <a-input v-model="info.facebook" :placeholder="$t('nodeInfo.enterFacebook')"></a-input>
            </div>
            <div class="form-item-column">
                <label for="">{{$t('nodeInfo.contactOntologyEmail')}}</label>
                <div>
                    <a-input v-model="info.contact_mail" :placeholder="$t('nodeInfo.enterContactEmail')"></a-input>
                </div>
            </div>
            <div class="form-item">
                <label for="">{{$t('nodeInfo.openEmail')}}</label>
                <a-input v-model="info.open_mail" :placeholder="$t('nodeInfo.enterOpenEmail')"></a-input>
            </div>
        </div>
        </div>
        <div class="form-bottom">
            <label for="">{{$t('nodeInfo.ifOpenInfo')}}</label>
            <a-switch v-model="info.open_flag"></a-switch>
        </div>
        <div class="footer-btns">
            <div class="btn-container">
            <a-button class="btn-next" @click="onSubmit" >{{$t('nodeInfo.submit')}}</a-button>
            </div>
        </div>
        <sign-send-tx :visible="signVisible" :tx="tx" :wallet="stakeWallet"
        v-on:signClose="handleTxCancel"
        v-on:afterSign="handleAfterSign"
        ></sign-send-tx>
    </div>
</div>
</template>
<script>
import {mapState} from 'vuex'
import SignSendTx from '../../../components/Common/SignSendTx'
import { utils, Crypto } from 'ontology-ts-sdk'
export default {
    name: 'NodeInfo',
    data() {
        return {
            info: {
                open_flag: false
            },
            tx: '',
            signVisible: false,
            node_info: ''
        }
    },
    components: {
        SignSendTx
    },
    mounted() {
        this.fetchNodeInfo(this.nodePublicKey)
    },
    computed: {
        ...mapState({
            nodePublicKey: state => state.NodeStake.nodePublicKey,
            stakeWallet: state => state.NodeStake.stakeWallet
        })
    },
    
    methods: {
        async fetchNodeInfo() {
            const info = await this.$store.dispatch('fetchNodeInfo', this.nodePublicKey)
            this.info = Object.assign({},this.info, info);
        },
        async onSubmit() {
            const data = Object.assign({}, this.info)
            data.public_key = this.nodePublicKey
            data.address = this.stakeWallet.address
            const node_info = JSON.stringify(data)
            this.node_info = utils.str2hexstr(node_info)
            this.tx = this.node_info
            this.signVisible = true;
        },
        handleTxCancel() {
            this.signVisible = false;
            this.tx = null;
        },
        handleAfterSign(signed) {
            if(this.stakeWallet.key) { // 普通钱包
                    const data =  {
                    node_info: this.node_info,
                    public_key: this.stakeWallet.publicKey,
                    address: this.stakeWallet.address,
                    signature: typeof signed === 'string' ? signed : signed.serializeHex()
                }
                this.$store.dispatch('updateNodeInfo', data).then(res => {
                    this.signVisible = false;
                    this.tx = null;
                    if(res.code === 0){
                        this.$message.success(this.$t('nodeInfo.updateSuccess'))
                    } else {
                        this.$message.error(this.$t('nodeInfo.updateFailed'))
                    }
                    
                })
            } else { // ledger 钱包
                const data = {
                    node_info: signed,
                    publicKey: this.stakeWallet.publicKey
                }
                this.$store.dispatch('updateLedgerNodeInfo', data).then(res => {
                    this.signVisible = false;
                    this.tx = null;
                    if(res.code === 0){
                        this.$message.success(this.$t('nodeInfo.updateSuccess'))
                    } else {
                        this.$message.error(this.$t('nodeInfo.updateFailed'))
                    }
                    
                })
            }
           
        }

    }
}
</script>
<style lang="scss" scoped>
.info-container {
    margin: 30px 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    .left-half {
        margin-right: 40px;
    }
    .left-half, .right-half {
        flex: 1;
    }
    
}
.form-bottom {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        label {
            margin: 0;
            margin-right: 20px;
        }
}
.form-item {
    display: flex;
    label {
        width: 100px;
        // margin-right: 10px;
    }
    input {
        flex: 1;
    }
    textarea {
        flex: 1;
    }
    margin-bottom: 20px;
}
.form-item-column {
    margin-bottom: 20px;
    div {
        padding-left: 100px;
        input {
        }
    }
    
}
.btn-container {
    text-align: center;
}
</style>