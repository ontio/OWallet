<template>
    <div class="basic-container">
        <div class="basic-label">
            <a-input class="input" :class="validLabel?'':'error-input'" :placeholder="$t('createSharedWallet.label')"
            v-model="label" @change="validateLabel"></a-input>
        </div>
        <p class="copayer-label font-bold">{{$t('createSharedWallet.copayers2_12')}}</p>
        <div class="basic-pks">
            <div class="pk-item" v-for="(item,index) in pks" :key="index">
                <a-input class="input" :class="item.nameValid?'':'error-input' " :placeholder="$t('createSharedWallet.name')"
                v-model="item.name" ></a-input>
                <a-input class="input" :class="item.pkValid?'':'error-input' " :placeholder="$t('createSharedWallet.publicKey')" v-model="item.publickey"
                @change="validatePublickey(index,item.publickey)"></a-input>
                <span class="delete-icon" @click="removePk(index)"></span>
                <p class="error-pk" v-if="!item.pkValid">{{$t('createSharedWallet.invalidPk')}}</p>
            </div>
            <a-button class="btn-add" style="margin-top:30px;" @click="addNewPk" v-if="pks.length<12">
                {{$t('createSharedWallet.add')}}
            </a-button>
        </div>
        <div class="basic-pk-btns">
            <div class="btn-container">
                <a-button type="default"  @click="cancel" class="btn-cancel">
                    {{$t('createSharedWallet.cancel')}}</a-button>
                <a-button type="primary" @click="next" class="btn-next">
                    {{$t('createSharedWallet.next')}}</a-button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {Crypto} from 'ontology-ts-sdk'
export default {
    name: 'BasicInfo',
    data() {
        return {
            label: '',
            validLabel:true,
            pks:[
                {name:'',publickey:'', nameValid:true, pkValid: true},
                {name:'',publickey:'', nameValid:true, pkValid: true},
            ]
        }
    },
    mounted(){
        this.label = this.$store.state.CreateSharedWallet.label;
        const copayers = this.$store.state.CreateSharedWallet.copayers;
        this.pks = copayers.map(p => {
            return {
                name: p.name,
                publickey: p.publickey,
                nameValid: true,
                pkValid: true
            }
        })
    },
    computed:{
        ...mapState({

        }),
    },
    methods: {
        addNewPk() {
            this.pks.push({
                name:'', publickey:'', nameValid:true, pkValid: true
            })
        },
        removePk(index) {
            if(this.pks.length <= 2) {
                this.$message.error(this.$t('createSharedWallet.pksLte2'))
                return;
            }
            const pks = this.pks.slice()
            pks.splice(index, 1)
            this.pks = pks;
        },
        validateLabel() {
            if(!this.label) {
                this.validLabel = false;
                return;
            }
            const length = this.label.split('').length;
            if(length > 12) {
                this.$message.error(this.$t('createSharedWallet.walletNameErr'))
                this.validLabel = false;
            } else {
                this.validLabel = true;
            }
        },
        validatePublickey(index,value) {
            console.log(index, value)
            if(value && value.length !== 66) {
                this.pks[index].pkValid = false;
            } else {
                this.pks[index].pkValid = true;
            }
        },
        validInput() {
            if(!this.label) {
                return false;
            }
            for(let i = 0; i < this.pks.length; i++) {
                const p = this.pks[i];
                if(!p.name || !p.publickey || !p.nameValid || !p.pkValid) {
                    return false;
                }
                for (let j = 0; j < this.pks.length; j++) {
                    const pp = this.pks[j]
                    if(i !== j && p.publickey === pp.publickey) {
                        this.$message.error(this.$t('createSharedWallet.duplicatePks'))
                        return false;
                    }
                    if(i !== j &&  p.name === pp.name) {
                        this.$message.error(this.$t('createSharedWallet.duplicateNames'))
                        return false;
                    }
                }
            }

            return true;
        },
        next() {
            if(!this.label) {
                this.$message.error(this.$t('createSharedWallet.emptyLabel'))
                return;
            }
            if(this.validInput()) {
                const copayers = this.pks.map(p => {
                    return {
                        name: p.name,
                        publickey: p.publickey,
                        address: Crypto.Address.fromPubKey(new Crypto.PublicKey(p.publickey)).toBase58()
                    }
                })
                this.$store.commit('UPDATE_CREATE_SHARED_LABEL', {label: this.label})
                this.$store.commit('UPDATE_CREATE_SHARED_COPAYERS', {copayers})
                this.$store.commit('ADD_CREATE_SHARED_STEP')
            }
        },
        cancel() {
            this.$router.push({name: 'Wallets'})
        },
        importSharedWallet() {
            this.$router.push({name:'ImportSharedWallet'})
        }
    }
}
</script>

<style>

.basic-container {
    padding-bottom:90px;
    overflow:auto;
}
.basic-label {
    width:540px;
    margin:2px auto;
}

.copayer-label {
    margin-left: 172px;
    margin-top: 40px;
}

.basic-pks {
    width:540px;
    margin:0px auto;
}
.pk-item {
    margin-bottom:15px;
}
.pk-item :first-child {
    width: 150px;
    margin-right: 20px;
    display: inline-block;
}
.pk-item :nth-child(2) {
    width:318px;
}
.delete-icon {
    height: 24px;
    width:24px;
    /* display: inline-block; */
    background:url('../../../assets/delete.png') center center;
    background-size:contain;
    float: right;
    margin-right: 10px;
    cursor: pointer;
    margin-top:3px;
}
.basic-pk-box {
    border:1px solid #dddddd;
    width:100%;
    height:300px;
    padding:10px;
    position: relative;
}
.basic-pk-add {
    border-top: 1px solid #dddddd;
    width: calc(100% - 20px);
    position: absolute;
    bottom: 10px;
    left: 10px;
    padding-top: 10px;
}
.basic-pk-item {
    width:100%;
    float:left;
}
.basic-pk-item span {
    margin-right:10px;
}
.basic-add-item {
    display: inline-block;
    width:40%;
}
.basic-add-item input {
    width:80%;
}

.basic-pk-btns {
    position: fixed;
    bottom:0;
    width:calc(100% - 4rem);
    height:85px;
    left:4rem;
    background: #FFFFFF;
    box-shadow: 0 -1px 6px 0 #F2F2F2;
    z-index: 1000;
}
.basic-pk-btns button:first-child {
    float:left;
}
.basic-pk-btns :nth-child(2) {
    float:right;
}
.basic-pk-btns :nth-child(3) {
    float:right;
    margin-right:20px;
}

.error-input {
    border-color: red;
}
.error-pk {
    padding-left: 175px;
    font-size: 13px;
    color: red;
}
</style>

