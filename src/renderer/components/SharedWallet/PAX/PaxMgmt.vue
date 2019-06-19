<style scoped>
.pax-container {
    text-align: center;
    position: relative;
}
.btn-ethScan {
    position: absolute;
    right:0;
    top:-40px;
}
.status-group {
    margin:10px auto;
}
.table-container {
    position: relative;;
}

.table-btns {
    text-align: right;
    margin-bottom:5px;
}
.table-btns button {
    margin-left: 15px;
}
.pax-header {
    position: relative;
}
.select-current {
    width:300px;
}
.pax-selectPayer {
    margin-bottom: 10px;
    text-align: left;
}
.text-small {
    font-size: 14px;
    margin-top: 20px;
}
.detail-link {
    text-align: center;
    cursor: pointer;
}
</style>
<template>
    <div>
        <breadcrumb :routes="routes" :current="$t('sharedWalletHome.paxMgmt')" @backEvent="handleBack"></breadcrumb>
        <div class="pax-container">
            <div class="pax-header">
                
                <!-- <a-button class="btn-ethScan" @click="toEthScan">{{$t('pax.toEthScan')}}</a-button> -->
                <a-radio-group :value="status" @change="handleStatusChange" class="status-group">
                    <a-radio-button value="0">{{$t('sharedWalletHome.unprocessed')}}</a-radio-button>
                    <a-radio-button value="1">{{$t('sharedWalletHome.processing')}}</a-radio-button>
                    <a-radio-button value="2">{{$t('sharedWalletHome.completed')}}</a-radio-button>
                    <a-radio-button value="3">{{$t('pax.txCompleted')}}</a-radio-button>
                </a-radio-group>
                <div v-if="status === '1' " class="pax-selectPayer">
                    <label for="">{{$t('pax.selectCurrentSigner')}}</label>
                    <a-select :options="localCopayers" class="select-current"  @change="handleChangeCurrentSigner"></a-select>
                </div>
            </div>
            <div class="table-btns">
                    <a-button type="primary" :disabled="selectedRowKeys.length < 1" @click="handleVarify">
                    {{$t('pax.toVarify')}}</a-button>
                    <a-button type="primary" :disabled="selectedRowKeys.length < 1 || status === '1' && !currentSigner" 
                    v-if="status === '0' || status === '1' " @click="handleProcess">{{$t('pax.toProcess')}}</a-button>
                </div>
           
                <a-table :rowSelection="(status === '2' || status === '3') ? null : {selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" 
                rowKey="Txhash"
                :columns="currentColumns" 
                :dataSource="data" 
                :pagination="pagination"
                @change="handleTableChange"
                >
                <div slot="action" slot-scope="text, record" class="detail-link" >
                    <a-icon type="arrow-right" @click="handleOpenTxDetail(record)" />
                </div>
                </a-table>
            

        </div>

        <a-modal
            :title="$t('pax.toProcess')"
            :visible="visible"
            @cancel="handleProcessCancel"
            @ok="handleProcessOk"
            >
            <p>{{$t('pax.selectedNum')}} {{selectedNum}}</p>
            <p>{{$t('pax.totalAmount')}} {{totalAmount}}</p>
        </a-modal>

        <a-modal
            :title="$t('pax.varifyResult')"
            :visible="varifyFailedList.length > 0"
            @cancel="handleShowVarifyResultCancel"
            :footer="null"
            >
            <p>{{$t('pax.failedTxhashes')}}</p>
            <p v-for="item of varifyFailedList" :key="item.txhash">
                <a :href="item.url">{{item.txhash}}</a>
            </p>
        </a-modal>
        
    </div>
</template>
<script>
import Breadcrumb from '../../Breadcrumb'
import {PAX_API} from '../../../../core/consts'
import {convertNumber2Str, open} from '../../../../core/utils'
import dbService from '../../../../core/dbService'
import { BigNumber } from 'bignumber.js'

export default {
    name: 'PaxMgmt',
    components: {
        Breadcrumb
    },
    data() {
        const sharedWallet = JSON.parse(sessionStorage.getItem('sharedWallet'));
        const routes = [
            {name: sharedWallet.sharedWalletName, path:'/sharedWallet/home'}
        ]
        const columns = [
            {
                title: this.$t('pax.ethAddress'),
                dataIndex: 'EthAddress'
            },
            {
                title: this.$t('pax.ontAddress'),
                dataIndex: 'OntAddress'
            },
            {
                title: this.$t('pax.amount'),
                dataIndex: 'AmountStr'
            },
            {
                title: this.$t('pax.date'),
                dataIndex: 'Updated'
            },
            {
                title: this.$t('pax.txDetail'),
                key: 'action',
                scopedSlots: {customRender:'action'}
            }
        ]
        return {
            sharedWallet,
            status: '0',
            routes,
            data:[],
            columns,
            currentColumns: columns,
            selectedRowKeys: [],
            selectedRowsPerPage: {},
            pagination: {
                current:1,
                pageSize:10,
                total:30
            },
            localCopayers: [],
            processing_list: [],
            currentSigner: '',
            selectedNum:0,
            totalAmount: 0,
            ethTotal: 0,
            visible: false,
            varifyFailedList: []
        }
    },
    mounted() {
        this.updateLocalCopayers()
        this.fetchList();
    },
    methods: {
        toEthScan() {
            const net = localStorage.getItem('net');
            let url = net === 'TEST_NET' ? PAX_API.EthScanTest : PAX_API.EthScanMain;
            oepn(url)
        },
        handleBack() {
            this.$router.push({path: '/Wallets'});
        },
        async handleVarify() {
            let list = []
            for(let key in this.selectedRowsPerPage) {
                list = list.concat(this.selectedRowsPerPage[key])
            }
            const data = {
                txhashs: [],
                ercaddresses: [],
                oep4addresses: [],
                amounts: []
            }
            list.forEach(item => {
                data.txhashs.push(item.Txhash),
                data.ercaddresses.push(item.EthAddress),
                data.oep4addresses.push(item.OntAddress),
                data.amounts.push(item.Amount)
            })
            this.$store.dispatch('showLoadingModals')        
            const net = localStorage.getItem('net');
            const result = await this.httpService({
                method:'post',
                data,
                url: (net === 'TEST_NET' ? PAX_API.TestHost : PAX_API.Host) + PAX_API.validateTx
            })
            const varifyFailedList = []
            const ethScanHost = net === 'TEST_NET' ? PAX_API.EthScanTest : PAX_API.EthScanMain
            for(let i = 0; i < result.Result.length; i++) {
                if(result.Result[i] !== '0') { // 0: pass; 
                    varifyFailedList.push(
                        {
                           txhash: data.txhashs[i],
                           url: ethScanHost + data.txhashs[i]
                        })
                }  
            }         
            this.varifyFailedList = varifyFailedList;   
            if(varifyFailedList.length === 0) {
                this.$message.success(this.$t('pax.varifySuccess'))
            } else {
                this.$message.error(this.$t('pax.varifyFailed'))
            }
            console.log(result)

        },
        handleShowVarifyResultCancel() {
            this.varifyFailedList = [];
        },
        handleStatusChange(e) {
            this.status = e.target.value
            // if(this.status === '3') {
            //     this.currentColumns = [...this.columns, 
            //     {
            //         title: this.$t('pax.txDetail'),
            //         key: 'action',
            //         scopedSlots: {customRender:'action'}
            //     }]
            // } 
            // else {
            //     this.currentColumns = [...this.columns]
            // }
            this.fetchList()
        },
        handleOpenTxDetail(record) {
            const net = localStorage.getItem('net');
            let url = '';
            if(this.status === '3') {
                let url = `https://explorer.ont.io/transaction/${record.Senthash}`
                const net = localStorage.getItem('net')
                if(net === 'TEST_NET') {
                    url = url+ '/testnet'
                }
            } else {
                url = (net === 'TEST_NET' ? PAX_API.EthScanTest : PAX_API.EthScanMain) + record.Txhash
            }
            open(url)
        },
        onSelectChange (selectedRowKeys,  selectedRows) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            console.log('selectedRow changed: ', selectedRows);
            // 更新选择的条目
            const list = []
            for(let key of selectedRowKeys) {
                for(let item of this.data) {
                    if(key === item.Txhash) {
                        list.push(item)
                    }
                }
            }
            this.selectedRowsPerPage[this.pagination.current] = list;
            this.selectedRowKeys = selectedRowKeys;
        },
        handleProcessCancel() {
            this.visible = false;
        },
        handleProcess() {
            
            let list = []
            for(let key in this.selectedRowsPerPage) {
                list = list.concat(this.selectedRowsPerPage[key])
            }
            this.selectedNum = list.length;
            this.totalAmount = list.reduce((item1, item2) => {
                return (item1.AmountStr ? new BigNumber(item1.AmountStr) : new BigNumber(item1) ).plus(new BigNumber(item2.AmountStr))
            }, 0).toFixed(8)
            this.visible = true;
        },

        handleProcessOk() {
            let list = []
                for(let key in this.selectedRowsPerPage) {
                    list = list.concat(this.selectedRowsPerPage[key])
                }
            if(this.status === '0') {
                this.$store.commit('UPDATE_UNPROCESS_LIST', {list})
                this.$router.push({path:'/sharedWallet/startProcess'})
            } else if(this.status === '1') {
                this.$store.commit('UPDATE_PROCESSING_LIST', {list})
                this.$store.commit('UDPATE_CURRENT_SIGNER', {signer: this.currentSigner})
                this.$router.push({path: '/sharedWallet/signProcess'})
            }
        },
        handleTableChange(pagination) {
            console.log(pagination)
            this.pagination = pagination;
            this.fetchList()
        },
        async fetchList(page,pageSize) {
            const net = localStorage.getItem('net');
            if(this.status) {
                const res = await this.httpService({
                    method: 'get',
                    params: {
                        status: this.status,
                        limit: this.pagination.pageSize,
                        offset: (this.pagination.current - 1)*this.pagination.pageSize,
                        order: 0 // 时间倒序
                    },
                    url: (net === 'TEST_NET' ? PAX_API.TestHost : PAX_API.Host) + PAX_API.fetchApprovalList
                })
                if(res.ErrorCode === 0) {
                    this.data = res.Result.map((item) => {
                        item.AmountStr = convertNumber2Str(item.Amount, 18, 8)
                        if(this.status === '1') {
                            item.cosigners = JSON.parse(item.CoSigners)
                        }
                        return item;
                    });

                    if(this.status === '1') {
                        this.processing_list = this.data;
                    }
                    if(this.currentSigner) {
                        this.handleChangeCurrentSigner(this.currentSigner.address)
                    }
                    
                    const total = res.TotalCount || res.Result.length;
                    this.pagination.total = total;
                } 
            } 
            
        },
        updateLocalCopayers() {
            var that = this;
                const coPayers = this.sharedWallet.coPayers;
                const localCopayers = []
                dbService.find({type: {$in:['CommonWallet', 'HardwareWallet']}}, function (err, accounts) {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    for (let cp of coPayers) {
                        for (let ac of accounts) {
                            if (cp.address === ac.address) {
                                localCopayers.push(Object.assign({}, cp, {value:ac.address, label:ac.wallet.label, type: ac.type, wallet: ac.wallet}))
                            }
                        }
                    }
                    if (localCopayers.length > 0) {
                        that.localCopayers = localCopayers;
                    }
                })
        },
        handleChangeCurrentSigner(value) {
            console.log(value)
            this.currentSigner = this.localCopayers.find((item) => (item.address === value));
            //filter data
            this.data = this.processing_list.filter((item) => {
                return this.isCurrentSigner(value, item.cosigners)
            })
        },
        isCurrentSigner(address, cosigners) {
            for(let i = cosigners.length -1; i > -1; i--) {
                if(cosigners[i].isSign && !cosigners[i+1].isSign) {
                    if(address === cosigners[i+1].address) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return false;
        }
    }
}
</script>
