<template>
    <div>
        Vote list
    </div>
</template>
<script>
export default {
    name: 'VoteList',
    mounted() {
        // this.$store.dispatch('getAllVotes')
        // this.$store.dispatch('getAdminVotes', {address: 'AY2SBxjPtEigEXpYcbuhtUmaEWp55NCSLH'})
        this.$store.dispatch('getVoters', {hash: '2558a34d4d20964ca1d272ab26ccce9511d880579593cd4c9e01ab91ed00f325'})
    }
}
</script>
<style>

</style>