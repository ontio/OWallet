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
      <div class="changelly-widget"  
        <iframe
          src="https://changelly.com/widget/v1?from=BTC&to=ONT&merchant_id=pzjsilenplyn7jgd&address=&amount=1&ref_id=pzjsilenplyn7jgd&color=196BD8"
          width="1000"
          height="500"
          class="changelly"
          scrolling="no"
          style="overflow-y: hidden; border: none"
        >
          Unable to connect to changelly
        </iframe>
      </div>
   </div>
</template>

<script>
import Breadcrumb from '../../Breadcrumb'
export default {
  name: "Changelly",
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
  }
};
</script>