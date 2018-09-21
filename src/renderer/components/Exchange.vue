<style scoped>
.exchange-container {
  position: relative;
  width: 100%;
  height: 100vh;
}
.center-content {
  width: 540px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: auto;
  margin-right: auto;
  transform: translate(-50%, -50%);
}
.btn-item {
  text-align: center;
  margin-bottom: 80px;
}
.btn-item p {
  text-align: center;
  font-size: 16px;
  margin-bottom: 5px;
}
.btn-item button {
  font-size: 18px !important;
  height: 80px !important;
  width: 300px !important;
}
</style>

<template>
    <div class="exchange-container">
        <div class="center-content">
            <div class="btn-item">
                <a-button class="btn-next" @click="handleExchangeChangelly">{{$t('exchange.changelly')}}</a-button>
            </div>
            <div class="btn-item">
                <a-button class="btn-next" @click="handleExchangeCryptonex">{{$t('exchange.cryptonex')}}</a-button>
            </div>
             <div class="btn-item">
                <a-button class="btn-next" @click="handleExchangeCoincap">{{$t('exchange.coincap')}}</a-button>
            </div>
        </div>
    </div>
    
</template>

<script>
export default {
  name: "Exchange",
  methods: {
    handleExchangeChangelly() {
      this.$router.push({ name: "Changelly" });
    },
    handleExchangeCryptonex() {
      this.$router.push({ name: "Cryptonex" });
    },
    handleExchangeCoincap() {
      this.$router.push({ name: "Coincap" });
    }  
  }
};
</script>