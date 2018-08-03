<style scoped>

.import-steps {
    width:540px;
    margin:0 auto;
    height: 4rem;
}
</style>
<template>
<div>
    <breadcrumb :current="$t('importSharedWallet.import')" v-on:backEvent="back"></breadcrumb>
    <div class="import-container">
        <a-steps :current="current" class="import-steps">
            <a-step />
            <a-step  />
        </a-steps>
        <query-shared-wallet v-if="current ===0"></query-shared-wallet>
        <input-pass v-if="current === 1"></input-pass>
    </div>
</div>
    
</template>
<script>
import QuerySharedWallet from './Import/QuerySharedWallet'
import InputPass from './Import/InputPass'
import {mapState} from 'vuex'
import Breadcrumb from '../Breadcrumb'
export default {
    name: 'ImportSharedWallet',
    data() {
        return {

        }
    },
    computed:{
        ...mapState({
            current: state => state.ImportSharedWallet.currentStep
        })
    },
    components: {
        QuerySharedWallet,
        InputPass,
        Breadcrumb
    },
    methods:{
        back(){
            this.$router.push({name:'Wallets'})
        }
    }
}
</script>



