<template>
	<div>
		<breadcrumb :routes="routes"
			:current="$t('vote.new')"
			v-on:backEvent="back"></breadcrumb>
		<div class="create-container">
			<div class="form-group">
				<p class="title">{{$t('vote.title')}}</p>
				<a-textarea v-model="title"
					placeholder="Title of the voted issue"
					:autosize="{ minRows: 2, maxRows: 6 }"
                    @keyup="onTitleInput"
					class="common-input title-input">
				</a-textarea>
				<span class="title-length">{{title.length}}/{{title_limit}}</span>
			</div>
            <div class="date-container">
                <div class="date-start">
                    <p class="title">{{$t('vote.votingStarts')}}</p>
                    <div>
                        <a-date-picker placeholder="Date" v-model="startDate" class="input-date"/>
                        <a-time-picker placeholder="Time" v-model="startTime" class="input-time"/>
                    </div>
                </div>
                <div class="date-end">
                    <p class="title">{{$t('vote.votingEnds')}}</p>
                    <div>
                        <a-date-picker placeholder="Date" v-model="endDate" class="input-date"/>
                        <a-time-picker placeholder="Time" v-model="endTime" class="input-time"/>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <p class="title">{{$t('vote.detail')}}</p>
                <a-textarea v-model="content"
					placeholder="Detailed information of the voting"
					:rows="6"
                    @keyup="onDetailInput"
					class="common-input title-input">
				</a-textarea>
				<span class="title-length">{{content.length}}/{{detail_limit}}</span>
            </div>

            <div class="btns-container">
                <a-button type="default" class="btn-cancel" @click="back">{{ $t('vote.back') }}</a-button>
                <a-button type="primary" class="btn-next" @click="submit">{{ $t('vote.submit') }}</a-button>
            </div>
            <!-- <p class="create-tip">{{$t('vote.nodeCanVoteOnly')}}</p> -->

		</div>
        <sign-send-tx :visible="signVisible" :tx="tx" :wallet="vote_wallet"
        v-on:signClose="handleCancel"
        v-on:txSent="handleTxSent"
        ></sign-send-tx>
	</div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import SignSendTx from '../../Common/SignSendTx'

import { mapState } from "vuex";
var dateFormat = require('dateformat');

export default {
	name: "VoteCreate",
	components: {
        Breadcrumb,
        SignSendTx
	},
	data() {
		const routes = [
			{ name: this.$t("vote.node"), path: "/node" },
			{ name: this.$t("vote.votingTopics"), path: "/vote/votes" }
		];
		return {
            title_limit: 150,
            detail_limit: 2000,
			routes,
            title: "",
            content: '',
            startDate:null,
            startTime: null,
            endDate: null,
            endTime: null,
            tx: '',
            signVisible: false
		};
    },
    computed: {
        ...mapState({
            vote_wallet: state => state.Vote.voteWallet,
        })
    },
	methods: {
		back() {
			this.$router.back();
        },
        onTitleInput(e) {
            const value = e.target.value;
            if(this.title.length > this.title_limit) {
                this.title = this.title.substr(0, this.title_limit)
            }
            if (/[\u4E00-\u9FA5]/g.test(value)) { // 中文字符
                this.$message.warning(this.$t('vote.onlySupportEnglish'))
                this.title = this.title.substring(0, value.length-1)
            }
        },
        onDetailInput(e) {
            const value = e.target.value;
            if(this.content.length > this.detail_limit) {
                this.content = this.content.substr(0, this.detail_limit)
            }
            if (/[\u4E00-\u9FA5]/g.test(value)) { // 中文字符
                this.$message.warning(this.$t('vote.onlySupportEnglish'))
                this.content = this.content.substring(0, value.length-1)
            }
        },
        validateInput(str) {
            str = str.trim();
            if(!str) {
                this.$message.warning(this.$t('vote.fillBlanks'))
                return false;
            }
            if(/[\u4E00-\u9FA5]/g.test(str)) {
                this.$message.warning(this.$t('vote.onlySupportEnglish'))
                return false
            }
            return true;
        },
        submit() {
            if(!this.validateInput(this.title) || !this.validateInput(this.content)) {
                return;
            }
            if(!this.title || !this.content || !this.startDate || !this.startTime || !this.endDate || !this.endTime) {
                this.$message.warning(this.$t('vote.fillBlanks'))
                return
            }
            const start_time_str = dateFormat(this.startDate, 'isoDate') + ' ' + dateFormat(this.startTime, 'isoTime')
            const end_time_str = dateFormat(this.endDate, 'isoDate') + ' ' + dateFormat(this.endTime, 'isoTime')
            const startTime = Math.floor((new Date(start_time_str).getTime()) / 1000)
            const endTime = Math.floor((new Date(end_time_str).getTime()) / 1000)
            if(startTime >= endTime) {
                this.$message.warning(this.$t('vote.startTimeError'))
                return
            }
            if(Date.now() >= new Date(end_time_str).getTime()) {
                this.$message.warning(this.$t('vote.endTimeError'))
                return 
            }
            const voters = []
            const vote = {
                title: this.title,
                content: this.content,
                startTime ,
                endTime,
                voters
            }
            this.$store.dispatch('createVote', {vote}).then(tx => {
                this.tx = tx;
                this.signVisible = true;
            } )
        },
        handleCancel() {
            this.signVisible = false;
            this.tx = ''
        },
        handleTxSent() {
            this.signVisible = false;
            this.$router.back();
        }
	}
};
</script>
<style lang="scss" scoped>
.create-container {
	width: 550px;
	margin: 0 auto;
	margin-top: 20px;
}
.title {
	font-size: 14px;
	font-family: AvenirNext-Medium, AvenirNext;
	font-weight: 500;
	color: rgba(0, 0, 0, 1);
	margin-bottom: 6px;
}
.common-input {
	border: 1px solid rgba(208, 210, 217, 1);
	border-radius: 0;
}
.common-input:focus {
	box-shadow: 0 0 0 2px rgba(208, 210, 217, 0.6);
}
.form-group {
	position: relative;
    margin-bottom:36px;
}
.title-length {
	position: absolute;
	right: 0;
	bottom: -20px;
	font-size: 12px;
	font-family: AvenirNext-Regular, AvenirNext;
	font-weight: 400;
	color: rgba(0, 0, 0, 1);
    opacity: 0.6;
}
.input-date {
    width:140px;
    margin-right:5px;
	border-radius: 0;
}
.input-time {
    width:110px;
    input {
	border-radius: 0 !important;
    }

}
.date-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 36px;
}
.btns-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin:0 auto;
    margin-top: 27px;
    margin-bottom: 16px;
    button:first-child {
        margin-right:40px;
    }
}
.create-tip {
    font-size:14px;
    font-family:AvenirNext-Regular,AvenirNext;
    font-weight:400;
    color:rgba(0,0,0,1);
    opacity: 0.4;
    text-align: center;
}
</style>