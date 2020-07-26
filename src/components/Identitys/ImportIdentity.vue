<template>
  <div>
    <breadcrumb :current="$t('importIdentity.import')" v-on:backEvent="back"></breadcrumb>
    <div class="shared-container">
      <div class="steps-content">
        <basic-info></basic-info>
      </div>
    </div>
  </div>

</template>

<script>
  import BasicInfo from './Import/BasicInfo'
  import Breadcrumb from '../Breadcrumb'
  import {mapState} from 'vuex';

  export default {
    name: 'ImportIdentity',
    data() {
      return {
        steps: [{
          title: this.$t('importIdentity.basicInfo'),
          content: 'First-content',
        }]
      }
    },
    components: {
      BasicInfo,
      Breadcrumb
    },
    methods: {
      back() {
        this.$router.push({name: 'Identitys'})
      }
    }
  }
</script>
