<style scoped>
</style>

<template>
  <div>
    <breadcrumb  :current="$t('exchange.exchange')" v-on:backEvent="handleRouteBack"></breadcrumb>
  <table class="table">
    <th>Coin</th>
    <th>Price (USD)</th>
    <th>Market Cap</th>
    <th>24hr Volume</th>
    <th>24hr Change</th>
    <tr v-for="(result,index) in results" class="tx-item" v-if="index<20">
      <td  v-for="(value, key) in result">
        {{ formatPrice(value) }} 
      </td>
    </tr>
  </table>  
</div>
</template>


<script>
import axios from "axios";
import Breadcrumb from "../../Breadcrumb";
import { isNumber } from "util";

export default {
  name: "Coincap",
  components: {
    Breadcrumb
  },
  data() {
    return {
      transactions: "",
      result: "",
      results: "",
      coin: "",
      price: "",
      mcap: "",
      vol: "",
      dailychange: "",
      filteredlist: "",
      intervalId: "",
      interval: 60000
    };
  },
  mounted: function() {
    this.refresh();
    let that = this;
    this.intervalId = setInterval(() => {
      that.getPrices();
    }, this.interval);
  },
  computed: {},
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    formatPrice(value) {
      if (isNumber(value)) {
        let val = (value / 1).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return "$"+ val;
      } else return value;
    },
    handleBack() {
      this.$router.push({ name: "Exchange" });
    },
    getPrices() {
      const url = "http://coincap.io/front";
      this.axios
        .get(url)
        .then(response => {
          if (response.status === 200 && response.data) {
            const pricelist = response.data;

            const filteredlist = pricelist.map(t => {
              const coin = t.long + " (" + t.short + ")";
              const price = t.price;
              const mcap = t.mktcap;
              const vol = t.volume;
              const dailychange = t.cap24hrChange + "%";

              return {
                coin,
                price,
                mcap,
                vol,
                dailychange
              };
            });
            this.results = filteredlist;
          } else {
            console.log(response);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    refresh() {
      this.$store.dispatch("showLoadingModals");
      setTimeout(() => {
        this.$store.dispatch("hideLoadingModals");
      }, 1000);
      this.getPrices();
    },
    handleRouteBack() {
      this.$router.push({ name: "Exchange" });
    }
  }
};
</script>