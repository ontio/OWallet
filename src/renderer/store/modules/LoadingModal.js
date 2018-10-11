import $ from 'jquery'

const actions = {
  showLoadingModals() {
    $("#loadingModal").modal('show')
  },
  hideLoadingModals() {
    // Wait for the animation to end
    
        setTimeout(()=>{
          $("#loadingModal").modal('hide')
          $('body').removeClass('modal-open');
          if ($('.modal-backdrop')) {
            $('.modal-backdrop').remove();
          }
        }, 500)
    // $(document).ready(function(){
    //   $('#loadingModal').on('shown.bs.modal', function () {
    //     $("#loadingModal").modal('hide')
    //     $('.modal-backdrop').hide();
    //     // $('.modal-backdrop').hide();
    //     // setTimeout(()=>{
    //     //   $('body').removeClass('modal-open');
    //     //   if ($('.modal-backdrop')) {
    //     //     $('.modal-backdrop').remove();
    //     //   }
    //     // }, 500)

    //   })
    // })
    
  }
}

export default {
  actions
}
