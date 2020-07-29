<template>
<div>
    <div class="content">
        <a-alert :message="$t('createSharedWallet.success')" type="success" showIcon />
        <p>{{$t('createSharedWallet.label')}}: {{label}}</p>
        <p>{{$t('createSharedWallet.address')}}: {{address}}</p>        
    </div>
    <div class="btns">
        <a-button type="primary"  @click="next">{{$t('createSharedWallet.next')}}</a-button>            
    </div>
</div>
    
</template>

<script>
import {mapState} from 'vuex'
export default {
    name:'CreateSuccess',
    computed: {
        ...mapState({
            label: state => state.CreateSharedWallet.label,
            address: state => state.CreateSharedWallet.address
        })
    },
    methods:{
        next() {
            this.$router.push({name:'Dashboard'})
        }
    }
}
</script>

<style scoped>
.content {
    border: 1px solid #dddddd;
    padding: 10px;
}
.content p {
    margin-top:10px;
}

.btns {
    float: right;
    margin-top:20px;
}
</style>

