<style scoped>
.intro-content {
  width: 540px;
  margin: 0rem auto;
}
.btn-known {
  margin: 20px auto;
  text-align: center;
}
.btn-known button {
  width: 150px !important;
}
.select-ontid {
  width: 100%;
}
.intro-item {
  margin-bottom: 15px;
}
.intro-content p {
  margin-bottom: 5px;
}
.change-payer-radio {
    width:100%;
}
.payer-radio-item {
    margin-bottom:15px;
}

</style>
<template>
    <div>
      <breadcrumb  :current="$t('exchange.exchange')" v-on:backEvent="handleRouteBack"></breadcrumb>
      <!-- Remove this div and enable this.loadPage in mounted() to open in a new window -->
      <div class="changelly-widget"
        <iframe
          src="https://changelly.com/widget/v1?from=BTC&to=ONT&merchant_id=pzjsilenplyn7jgd&address=&amount=1&ref_id=pzjsilenplyn7jgd&color=196BD8"
          width="1000"
          height="500"
          class="changelly"
          scrolling="no"
          style="overflow-y: hidden; border: none"
        >         
        </iframe>
        </div>
   </div>
</template>

<script>
import Breadcrumb from '../../Breadcrumb'
const changellyURL = 'https://changelly.com/widget/v1?from=BTC&to=ONT&merchant_id=pzjsilenplyn7jgd&address=&amount=1&ref_id=pzjsilenplyn7jgd&color=196BD8'
const {BrowserWindow} = require('electron').remote;

export default {  
  name: "Changelly",
  mounted() {
    //Changelly page set to load as iframe in current window, if new browser
    //window is preferred, enable method this.loadPage() below and remove reference
    //to iFrame in <div> above

    //this.loadPage() 
  },
  data() {
    return {
    };
  },
  components: {
        Breadcrumb
  },
  methods: {
    handleRouteBack() {
      this.$router.push({name: 'Exchange'})      
    },
    loadPage() {
      let win = new BrowserWindow({width: 1000, height: 550, center: true});
            win.on('closed', () => {
            win = null
            })
      win.loadURL(changellyURL)
      }
  }
};
</script>