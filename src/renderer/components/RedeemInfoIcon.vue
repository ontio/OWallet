<style scoped>
.redeem-info-icon {
    margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
  color:#D0D2D9;
}
.redeem-info-icon:hover {
    color:#6F7781;
}

</style>
<template>
    <div>
        <!-- <a-icon type="info-circle-o" class="redeem-info-icon" @click="show"/> -->
        <i class="fa fa-info-circle redeem-info-icon" @click="show"></i>
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

