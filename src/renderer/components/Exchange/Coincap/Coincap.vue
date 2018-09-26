<style scoped>
td img {
  width: 20px;
}
</style>

<template>
  <div>
    <breadcrumb  :current="$t('exchange.exchange')" v-on:backEvent="handleRouteBack"></breadcrumb>
  <table class="table">
    <thead>
      <tr>
        <td><b>Coin</b></td>
        <td><b>Price (USD)</b></td>
        <td><b>Market Cap (USD)</b></td>
        <td><b>24hr Volume (USD)</b></td>
        <td><b>24hr Change (%)</b></td>
      </tr>
    </thead>
   
    <tbody>
    <tr v-for="(result, index) in results" v-if="index<20">
      <td><img v-bind:src="getCoinImage(result.coin_short)"> {{ result.coin_long }} ({{ result.coin_short}})</td>
      <td>{{ formatPrice(result.price) }}</td>
      <td>{{ formatPrice(result.mcap) }}</td>
      <td>{{ formatPrice(result.vol) }}</td>
      <td v-bind:style="setColor(result.dailychange)">{{ result.dailychange }}%</td>
    </tr>
  </tbody>

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
      result: "",
      results: "",
      coin_short: "",
      coin_long: "",
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
    let that = this;
    setInterval(() => {
      that.getImageData();
    }, this.interval);
  },
  computed: {},
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  created: function() {
    this.getImageData();
  },
  methods: {
    formatPrice(value) {
      if (isNumber(value)) {
        let val = (value / 1).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return "$" + val;
      } else return value;
    },
    setColor: num => {
      return num > 0 ? "color:green;" : "color:red;";
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
              const coin_short = t.short;
              const coin_long = t.long;
              const price = t.price;
              const mcap = t.mktcap;
              const vol = t.volume;
              const dailychange = t.cap24hrChange;

              return {
                coin_short,
                coin_long,
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
    getImageData: function() {
      let self = this;

      this.axios
        .get("https://min-api.cryptocompare.com/data/all/coinlist")
        .then(response => {
          if (response.status === 200 && response.data) {
            this.imageData = response.data.Data;
            this.getPrices();
          }
        })
        .catch(err => {
          this.getPrices();
          console.error(err);
        });
    },
    getCoinImage: function(short) {
      return "https://www.cryptocompare.com" + this.imageData[short].ImageUrl;
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