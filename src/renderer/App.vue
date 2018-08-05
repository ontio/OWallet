<template>
  <div id="app">
    <top-left-nav v-if="$route.name !== 'Home'"></top-left-nav>

    <div class="container-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap/dist/js/bootstrap.min.js'
  import 'vue-antd-ui/dist/antd.css';
  import TopLeftNav from "./components/TopLeftNav";

  export default {
    name: 'ont-wallet-test',
    components: {TopLeftNav},
    data: function () {
      return {}
    },
    created() {
      if (!localStorage.getItem('net')) {
        localStorage.setItem('net', 'TEST_NET');
      }
    }
  }
</script>

<style>
  /* CSS */
  @font-face {
    font-family: SourceSansPro;
    src: url('../../static/fonts/SourceSansPro-Semibold.ttf');
  }

  @font-face {
    font-family: AvenirNext-Bold;
    src: url('../../static/fonts/AvenirNextBold.ttf');
  }
  @font-face {
    font-family: AvenirNext-Medium;
    src: url('../../static/fonts/AvenirNextMedium.ttf');
  }
  @font-face {
    font-family: AvenirNext-Regular;
    src: url('../../static/fonts/avenirnextregular.otf');
  }

  .loading {
    text-align: center;
    background: rgba(0, 0, 0, 0.05);
    width: 100%;
    height: 100%;
  }

  .container-fluid {
    padding-left: 5.13rem !important;
  }

  .font-medium {
    font-family: 'AvenirNext-Medium';
    color: #5E6369;
    font-size: 0.88rem;
  }

  .font-medium-black {
    font-family: 'AvenirNext-Medium';
    color: #000000;
    font-size: 0.88rem;
  }

  .font-bold {
    font-family: 'AvenirNext-Bold';
    color: #5E6369;
    font-size: 14px;
  }

  .btn-cancel {
    width: 120px !important; 
    height: 44px !important;
    background: #F5F7FB !important;
    text-align: center;
    border-radius: 0 !important;
    font-size: 1.13rem !important;
    color: #5E6369 !important;
    font-family: 'AvenirNext-Bold' !important;
    border: none !important;
  }

  .btn-next {
    width: 120px !important;
    height: 44px !important;
    background: #196BD8 !important;
    color: #ffffff !important;
    text-align: center !important;
    border-radius: 0 !important;
    font-size: 1.13rem !important;
    font-family: 'AvenirNext-Bold' !important;
    border: none !important;
  }

  .btn-add {
    width: 80px !important;
    height: 34px !important;
    background: #FBE45A !important;
    border-radius: 0 !important;
    font-family: 'AvenirNext-Bold' !important;
    border: none !important;
    font-size: 18px !important;
  }

  .btn-add:hover {
    border: 1px solid #FBE45A !important;
  }

  .btn-cancel span, .btn-next span {
    width: 100%;
  }

  .input {
    border-radius: 0 !important;
    background: #FFFFFF !important;
    border: 1px solid #DFE2E9 !important;
    height: 34px !important;
  }

  .footer-btns {
    position: fixed;
    bottom: 0;
    width: calc(100% - 4rem);
    height: 85px;
    left: 4rem;
    background: #FFFFFF;
    box-shadow: 0 -1px 6px 0 #F2F2F2;
    z-index: 1000;
  }

  .footer-btn-container {
    width: 540px;
    margin: 20px auto;
  }

  .footer-btn-container :last-child {
    float: right;
  }
</style>
