import $ from 'jquery'
const state = {
  showLoading: false
}

const mutations = {
  SHOW_LOADING_MODALS(state) {
    state.showLoading = true;
  },
  HIDE_LOADING_MODALS(state) {
    state.showLoading = false
  }
}

const actions = {
  showLoadingModals({commit}) {
    // $("#loadingModal").modal('show')
    commit('SHOW_LOADING_MODALS')
  },
  hideLoadingModals({commit}) {
    // Wait for the animation to end
    const tid = setTimeout( () => {
      commit('HIDE_LOADING_MODALS')
      clearTimeout(tid)
    }, 500)
    
        // setTimeout(()=>{
        //   $("#loadingModal").modal('hide')
        //   $('body').removeClass('modal-open');
        //   if ($('.modal-backdrop')) {
        //     $('.modal-backdrop').remove();
        //   }
        // }, 500)
    
  }
}

export default {
  actions,
  mutations,
  state
}
