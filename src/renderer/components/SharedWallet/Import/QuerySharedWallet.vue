<style scoped>
.query-input {
    width:540px;
    margin:20px auto;
}
.result-item {
    float:left;
    width:100%;
}

.result-item label {
    width:30%;
    text-align: right;
    float: left;
    font-weight: bold;
}
.result-item span {
    float:left;
    margin-left:10px;
}

.no-result {
    padding: 15px;
}

.result-item-container {
    display: inline-block;
    margin-left:10px;
}

.copayer-item {
    margin-bottom:10px;
}
.copayer-item p {
    margin:0
}
.copayer-name {
    width:10px;
    height:10px;
    border-radius:50%;
    background:#52a2bb;
    display: inline-block;
}

</style>
<template>
    <div class="query-container">
        <div class="query-input">
            <a-input
            class="input"
            v-model="searchText"
            :placeholder="$t('importSharedWallet.inputAddress')"  />
        </div>
        
        <div class="footer-btns">
            <div class="footer-btn-container">
                <a-button class="btn-cancel" type="default" @click="cancel">{{$t('importSharedWallet.cancel')}}</a-button>
                <a-button class="btn-next" type="primary" @click="next" :disabled="!searchText">{{$t('importSharedWallet.search')}}</a-button>            
            </div>
            
        </div>
        
    </div>
</template>

<script>
import axios from 'axios';
import {ONT_PASS_NODE, ONT_PASS_NODE_PRD,ONT_PASS_URL} from '../../../../core/consts'
import dbService from '../../../../core/dbService'
import en from '../../../../common/lang/en'
import zh from '../../../../common/lang/zh'

export default {
    name: 'QuerySharedWallet',
    data() {
        const langType = localStorage.getItem('user_lang') || 'en';
        const lang = langType === 'en' ? en : zh;
        return {
            lang:lang,
            noSuchWallet: false,
            searchText: '',
            sharedWallet:{
            },
            coPayers: [],
            showJoinBtn: false,
            accountToJoin: {
                address: ''
            },
        }
    },
    methods: {
        cancel() {
            this.$router.push({name:'Wallets'})
        },
        next() {
            const net = localStorage.getItem('net')
            const ontPassNode = net === 'TEST_NET' ? ONT_PASS_NODE : ONT_PASS_NODE_PRD
            this.$store.dispatch('showLoadingModals')
            axios.get(ontPassNode+ONT_PASS_URL.QuerySharedWallet, {
                params: {
                    sharedWalletAddress: this.searchText
                }
            }).then(res => {
                this.$store.dispatch('hideLoadingModals')
                if(res.status === 200 && res.data.sharedWalletAddress) {
                    this.sharedWallet = res.data
                    this.$store.commit('UPDATE_SHARED_WALLET', {sharedWallet: res.data})
                    this.$store.commit('ADD_IMPORT_SHARED_STEP');
                } else {
                    this.$store.commit('UPDATE_SHARED_WALLET', {sharedWallet: null} )  
                    this.$message.error(this.$t('importSharedWallet.notFound'))                 
                } 
                // this.$store.commit('ADD_IMPORT_SHARED_STEP');
            }).catch(err => {
                this.$store.dispatch('hideLoadingModals')
                this.$store.commit('UPDATE_SHARED_WALLET', {sharedWallet: null} )   
                this.$message.error(this.$t('commonWalletHome.networkError'))                
                // this.$store.commit('ADD_IMPORT_SHARED_STEP');
            })
        },
    }
}
</script>


