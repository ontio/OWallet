import $ from 'jquery'

const actions = {
  showLoadingModals () {
    $('#loadingModal').modal('show')
  },
  hideLoadingModals () {
    // Wait for the animation to end
    $('#loadingModal').on('shown.bs.modal', function () {
      $('#loadingModal').modal('hide')
    })
  }
}

export default {
  actions
}
