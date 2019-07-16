<style scoped>
.selection-container {
    height:370px;
    margin-top:-15px;
}
.pages {
    margin:0 auto;
    margin-top:20px;
    text-align: center;
}
.selection-item {
    display: flex;
    justify-content: space-between;
    padding: 7px 0;
    border-bottom:1px solid #DFE2E9;
}
.selection-item p {
    margin: 0;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(0,0,0,1);
}
.oep4-info {
    font-size: 12px;
}
.oep4-info p {
    margin:0;
}
</style>
<template>
    <div>
        <a-modal 
            :title="$t('common.selectOep4')"
            :visible="visible"
            @cancel="handleClose"
            :footer="null"
            :width="400">
           
                <div>
                    <div class="selection-container">
                        <div v-for="item of oep4s" :key="item.contract_hash" class="selection-item">
                            <p>{{item.symbol}}</p> 
                            <!-- <a-checkbox :checked="item.selected" @change="onChangeSelection(item)"></a-checkbox> -->
                            <a-switch :checked="item.selected" @change='onChangeSelection(item)'/>
                        </div>
                    </div>
                    
                    <a-pagination v-model="page_number" :total="total"  @change="handlePageChange" class="pages"/>
                </div>

        </a-modal>
    </div>
</template>
<script>
/* 
从后台获取oep4列表，本地缓存用户选择的记录，对比合约hash，显示选择状态，要有分页；
每次更新选择，触发mutation更新store并更新缓存；
*/
import {mapState} from 'vuex'
export default {
    name: 'Oep4Selection',
    props: ['visible'],
    data() {
        return {
            oep4s: [],
            page_size: 10,
            page_number: 1,
            total: 0,
        }
    },

     mounted() {
    },

    computed: {
        ...mapState({

        })
       
    },
    watch: {
        visible: function(newVal) {
           this.fetchOep4List();
        }
    },
    methods: {
        handleClose() {
            this.page_number = 1;
            this.$emit('closeOep4Selection')
        },
        onChangeSelection(item) {
            item.selected = !item.selected;
            this.$store.commit('UPDATE_OEP4_TOKEN', {oep4: item})
        },
        handlePageChange(page) {
            this.page_number = page;
            this.fetchOep4List();
        },
        fetchOep4List() {
            this.$store.dispatch('showLoadingModals')
            this.$store.dispatch('fetchOep4Selections', {
                    page_size: this.page_size,
                    page_number: this.page_number
                }).then(res => {
                    console.log('result')
                    const {list, total } = res;
                    this.total = total;
                    this.oep4s = list.map(item => Object.assign({}, {
                        contract_hash: item.contract_hash,
                        decimal: item.decimals,
                        symbol: item.symbol,
                        selected: item.selected
                    }))
                })
        }

    }
}
</script>
