
<style scoped>
.dapps-container {
    padding: 20px 20px;
}
.dapp-item {
    margin: 15px;
    cursor: pointer;
    background: #f5f7fb;
    font-family: AvenirNext-Medium;
    font-size: 18px;
    color: #515457;
    line-height: 24px;
    height:15rem;
    border: 1px solid #f5f7fb;
}
.dapp-item:hover {
    border:1px solid #196BD8;
}

.dapp-title {
    padding: 15px;
    border-bottom: 1px solid #cccccc;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.dapp-title > img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
}

.dapp-content {
    padding: 15px;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 14px;
}
</style>

<template>
    <div class="negative-margin-top dapps-container">
        <a-row>
            <a-col :md="8" :lg="8" :xl="6">
                <div @click="handleExchangeChangelly" class="dapp-item">
                    <div class="dapp-title">
                        <img :src="require('../assets/changelly.png')" alt />
                        <span>{{$t('exchange.changelly')}}</span>
                    </div>
                    <p class="dapp-content">Cryptocurrency Exchange Platform</p>
                </div>
            </a-col>
            <a-col :md="8" :lg="8" :xl="6">
                <div
                    @click="handleExchangeCryptonex"
                    class="dapp-item"
                    :title="$t('exchange.cryptonex')"
                >
                    <div class="dapp-title">
                        <img :src="require('../assets/cryptonex.png')" alt />
                        <span>{{$t('exchange.cryptonex')}}</span>
                    </div>
                    <p class="dapp-content">
                        Buy Bitcoin, Ethereum, Cryptonex
                        Quick online purchase using a bank card
                    </p>
                </div>
            </a-col>
            <a-col :md="8" :lg="8" :xl="6">
                <div
                    class="dapp-item"
                    @click="handleDappSesameseed"
                >
                    <div class="dapp-title">
                        <img :src="require('../assets/sesameseed.png')" alt />
                        <span>{{$t('dapps.sesameSeed')}}</span>
                    </div>
                    <p class="dapp-content">{{$t('dapps.sesameseedDesc')}}</p>
                </div>
            </a-col>
            <a-col :md="8" :lg="8" :xl="6">
                <div
                    class="dapp-item"
                    @click="handleOntidMgmt"
                >
                    <div class="dapp-title">
                        <img :src="require('../assets/ontid.svg')" alt />
                        <span>ONT ID</span>
                    </div>
                    <p class="dapp-content">{{$t('dapps.ontidMgmt')}}</p>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import axios from "axios";
import { isNumber, isNullOrUndefined } from "util";
import { open } from "../../core/utils";

export default {
    name: "Dapps",
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
        this.$confirm({
            title: this.$t('dapps.notification'),
            content: this.$t('dapps.userPolicy'),
            onOk() {},
            onCancel: () => {
                this.$router.back();
            }
        })
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
            // this.$router.push({ name: "Changelly" });
            const changellyURL =
                "https://widget.changelly.com?currencies=&from=btc&to=ont&amount=1&address=&fiat=true&fixedTo=false&theme=default&ref_id=su5srryl1mhz4fno&merchant_id=su5srryl1mhz4fno";
            open(changellyURL);
        },
        handleExchangeCryptonex() {
            // this.$router.push({ name: "Cryptonex" });
            const cryptonexURL = "https://wallet.cryptonex.org/member/sign-in";
            open(cryptonexURL);
        },
        handleDappSesameseed() {
            this.$router.push({name: 'AuthorizeLoginSesameseed'});
        },
        handleOntidMgmt() {
            this.$router.push({name:'Identitys'})
        },
        formatPrice(value) {
            if (isNumber(value)) {
                let val = (value / 1)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                                filteredlist =>
                                    filteredlist.coin_long == "Ontology"
                            );
                            const reorderedArray = this.reorderArray(
                                filteredlist,
                                ONTindex,
                                0
                            );
                            this.results = reorderedArray;

                            this.loading = false;
                        } catch (err) {
                            this.results = filteredlist;
                            console.log(err);
                        }
                    } else {
                        console.log(response);
                    }
                })
                .catch(err => {
                    this.loading = false;
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
                        "https://www.cryptocompare.com" +
                        this.imageData[short].ImageUrl
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