<template>
    <div class="success-container">
        <img :src="require('../../../assets/success.svg')" alt="">
        <p class="success-tip">{{$t('nodeApply.registerSuccess')}}</p>
        <a-button class="btn-next" @click="onComplete">{{$t('nodeApply.completeNodeInfo')}}</a-button>
        <p class="later-tip" @click="onLater">{{$t('nodeApply.later')}}</p>
    </div>
</template>
<script>
export default {
    name: 'NodeApplySuccess',
    methods: {
        onComplete() { // 进入节点管理页面且打开信息填写的tab
            
        },
        onLater() {
            this.$router.push({name: 'MyNode'})
        }
    }
}
</script>
<style lang="scss" scoped>
.success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin-top: -4rem;
    img {
        width: 80px;
        height: 80px;
        margin-bottom: 20px;
    }
    .success-tip {
        font-size:24px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(0,0,0,1);
        margin-bottom: 40px;
    }
    button {
        margin-bottom: 23px;
    }
    .later-tip {
        font-size:14px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(0,0,0,.6);
        cursor: pointer;
        text-decoration: underline;
    }
}
</style>