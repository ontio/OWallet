<style scoped>
    .breadcrumb-container {
        height:4rem;
        padding:1.1rem 0 1.1rem 15px;
        padding-left:5.13rem;
        width:100%;
        position: fixed;
        top:0;
        left:0;
        background:rgba(255,255,255,1);
        z-index: 100;
    }
    .back-icon-container {
        height: 1.7rem;
        line-height: 1.7rem;
        padding-right: 18px;
        border-right: 1px solid #dddddd;
        float: left;
        cursor: pointer;
        color: #1C76DD;
        font-size: 18px;
    }
    .back-icon-container:hover {
        color:#619AE5;
    }
    .back-icon {
        display: inline-block;
        height:10px;
        width:18px;
        background:url(../assets/back.png) center center;
        background-size: cover;
        line-height: 1.7rem;
    }
    .breadcrumb-routes {
        float: left;
        margin-left: 18px;
        height:1.7rem;
        line-height: 1.7rem;    
    }
    .breadcrumb-routes a {
        color: #A5A7A9;
        font-size:16px;
        font-family: AvenirNext-Bold;

    }
    .breadcrumb-current {
        float:left;
        height:1.7rem;
        line-height: 1.7rem;
        margin-left: 18px;
        color: #000000;
        font-size:14px; 
        font-family: AvenirNext-Bold;
    }
    .left-icon {
        font-size: 16px;
        color: #A5A7A9;
        margin-left: 10px;
    }
</style>
<template>
    <div class="breadcrumb-container">
        <div class="back-icon-container" @click="back">
            <span class="fa fa-long-arrow-left"></span>
        </div>
        <div class="breadcrumb-routes" v-for="route in routes" :key="route.path">
            <router-link :to="route.path">{{route.name}}</router-link>
            <a-icon type="right" class="left-icon" />
        </div>
        <div class="breadcrumb-current">
            {{current}}
        </div>
    </div>
</template>

<script>
export default {
    name:'Breadcrumb',
    props:['routes', 'current'],
    methods:{
        back() {
            this.$emit('backEvent');
            // this.$router.back();
        }
    }
}
</script>


