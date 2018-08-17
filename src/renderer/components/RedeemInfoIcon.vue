<style scoped>
.redeem-info-icon {
    margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
}

</style>
<template>
    <div>
        <a-icon type="info-circle-o" class="redeem-info-icon" @click="show"/>
        <a-modal
            title="Redeem Info"
            v-model="visible"
            @ok="handleOk"
            >
            <p class="font-regular"><span class="font-medium">{{$t('redeemInfo.claimableOngName')}}</span> {{$t('redeemInfo.claimableOng')}}</p>
            <p class="font-regular"><span class="font-medium">{{$t('redeemInfo.unboundOngName')}}</span> {{$t('redeemInfo.unboundOng')}}</p>
        </a-modal>
    </div>
</template>
<script>
export default {
    name: 'RedeemInfoIcon',
    data(){
        return {
            visible:false
        }
    },
    methods:{
        show() {
            this.visible = true;
        },
        handleOk() {
            this.visible = false;
        }
    }
}
</script>

