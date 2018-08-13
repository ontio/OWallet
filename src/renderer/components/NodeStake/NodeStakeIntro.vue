<style scoped>
.intro-content {
    width:540px;
    margin:4rem auto;
}
.btn-known {
    margin:20px auto;
    text-align: center;
}
.btn-known button {
    width:150px !important;
}
</style>
<template>
    <div>
        <div class="intro-content">
            Ontology Triones种子节点招募规则
            xxxxxxxxxxxxxxxxxxxx
        </div>
        <div class="footer-btns">
            <div class="btn-known">
                <a-button type="primary" class="btn-next" @click="next">{{$t('nodeStake.iHaveKnown')}}</a-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NodeStakeIntro',
    methods: {
        next() {
            this.$router.push({name: 'NodeStake'})
        }
    }
}
</script>
