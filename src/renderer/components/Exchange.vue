<style scoped>
td img {
  width: 20px;
}

loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>

<template>
  <div id="container">
    <div class="btn-item">
                <a-button class="btn-next" @click="handleExchangeChangelly">{{$t('exchange.changelly')}}</a-button>
                <a-button class="btn-next" @click="handleExchangeCryptonex">{{$t('exchange.cryptonex')}}</a-button>
            </div>
    <div class="loading" v-if="loading">
                <h5>{{$t('exchange.loading')}}</h5>
    </div>
 
      <div class ="grid" v-if="!loading">
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
      interval: 60000,
      loading: true
    };
  },
  mounted: function() {
   /* this.$store.dispatch("showLoadingModals");
    setTimeout(() => {
      this.$store.dispatch("hideLoadingModals");
    }, 8000); */
    let that = this;
    setInterval(() => {
      that.getImageData();
    }, this.interval);
  },
  computed: {},
  beforeDestroy() {
    clearInterval(this.interval);
  },
  created: function() {
    this.getImageData();
  },
  methods: {
    findIndex(array) {
      return array.long == value;
    },
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
    reorderArray(array, initialIndex, destinationIndex) {
      const itemOfInterest = array[initialIndex];
      array.splice(initialIndex, 1);
      array.splice(destinationIndex, 0, itemOfInterest);

      return array;
    },
    getPrices() {
      this.loading = true;
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

            try {
              // Find ONT in list and re-order it to top of the list
              let ONTindex = filteredlist.findIndex(
                filteredlist => filteredlist.coin_long == "Ontology"
              );
              const reorderedArray = this.reorderArray(
                filteredlist,
                ONTindex,
                0
              );
              this.results = reorderedArray;

              this.loading = false
            } catch (err) {
              this.results = filteredlist;
              console.log(err);
            }
          } else {
            console.log(response);
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err);
        });
    },
    test: function(from, to) {
      this.splice(to, 0, this.splice(from, 1)[0]);
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
      }, 8000);
      this.getPrices();
    }
  }
};
</script>