// $(document).ready(function(){

// });

function StatusClick(element){
  var text = $(element).text();
  
  if(text == "정상"){
    swal({
      title:'정지',
      text:'해당 사용자가 서비스를 이용할 수 없습니다.',
      icon: 'warning',
      closeOnClickOutside:false,
      closeOnEsc:false,
      buttons : {
        confirm : {
          text:"확인",
          value:true,
          className:'product_delete_alert_confirm'
        },
        cancle : {
          text:"취소",
          value:false,
          className:'product_delete_alert_cancle'
        }
      }
    }).then(function(value) {
      if(value){
        swal({
          title:'정지되었습니다.',
          icon: 'success',
          closeOnClickOutside:false,
          closeOnEsc:false
        }).then(function(){
          var form = $(element).closest('.userlist_form');
          form.submit();
        })
      }
    })
  } else {
    swal({
      title:'정지 해제',
      text:'해당 사용자가 서비스를 이용할 수 있습니다.',
      icon: 'warning',
      closeOnClickOutside:false,
      closeOnEsc:false,
      buttons : {
        confirm : {
          text:"확인",
          value:true,
          className:'product_delete_alert_confirm'
        },
        cancle : {
          text:"취소",
          value:false,
          className:'product_delete_alert_cancle'
        }
      }
    }).then(function(value) {
      if(value){
        swal({
          title:'정지가 해제되었습니다.',
          icon: 'success',
          closeOnClickOutside:false,
          closeOnEsc:false
        }).then(function(){
          var form = $(element).closest('.userlist_form');
          form.submit();
        })
      }
    })
  }
}

