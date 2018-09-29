<style scoped>
td img {
  width: 20px;
}
.pageNumber {
  padding: 2px;
}

.btn-item button {
  font-size: 16px !important;
  height: 40px !important;
  width: 150px !important;
  margin-right: 20px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>

<template>
  <div id="container">
    <div class="btn-item">
                <a-button class="btn-next" @click="handleExchangeChangelly">{{$t('exchange.changelly')}}</a-button>
                <a-button class="btn-next" @click="handleExchangeCryptonex">{{$t('exchange.cryptonex')}}</a-button>
    </div>

      <div class ="grid">
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
 </div>
</template>

<script>
import axios from "axios";
import { isNumber, isNullOrUndefined } from "util";

export default {
  name: "Exchange",
  components: {},
  data() {
    return {
      result: [],
      results: [],
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
    handleExchangeChangelly() {
      this.$router.push({ name: "Changelly" });
    },
    handleExchangeCryptonex() {
      this.$router.push({ name: "Cryptonex" });
    },
    formatPrice(value) {
      if (isNumber(value)) {
        let val = (value / 1).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return "$" + val;
      } else return value;
    },
    setColor: num => {
      return num > 0 ? "color:green;" : "color:red;";
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
      try {
        if (short.length > 0) {
          return (
            "https://www.cryptocompare.com" + this.imageData[short].ImageUrl
          );
        } else {
          return "";
        }
      } catch (err) {}
    },
    refresh() {
      this.$store.dispatch("showLoadingModals");
      setTimeout(() => {
        this.$store.dispatch("hideLoadingModals");
      }, 1000);
      this.getPrices();
    }
  }
};
</script>