const state = {
    unprocess_list: [
       
    ],
    processing_list: [
         {
           cosigners: []
         }
    ],
    currentSigner: ''
}

const mutations = {
    UPDATE_UNPROCESS_LIST(state, {list}) {
        state.unprocess_list = list;
    },
    UPDATE_PROCESSING_LIST(state, {list}) {
        state.processing_list = list;
    },
    UDPATE_CURRENT_SIGNER(state, {signer}) {
        state.currentSigner = signer
    }
}
const actions = {}

export default {
  state,
  mutations,
  actions
}