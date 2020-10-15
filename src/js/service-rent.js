// 동적 상품리스트 레이아웃 구현
$(document).ready(function(){
  var ProductList = [];
  ProductList = document.getElementsByClassName("servicerent-product-element");
  
  if(ProductList.length%3 == 2){
    
    var storebox = document.getElementsByClassName("servicerent-product")[0];
    var layoutbox = document.createElement('div');
    
    layoutbox.setAttribute("class", "servicerent-product-element");
    layoutbox.setAttribute("style", "display:block");
    storebox.appendChild(layoutbox);
    ProductList[ProductList.length-1].style.border="none";
    ProductList[ProductList.length-1].style.cursor="default";
  }

  var div_box = document.getElementsByClassName('servicerent-product')[0];
  var div_topbox = document.getElementsByClassName('servicerent_topbox')[0];
  var div_default = document.getElementsByClassName('servicerent_default')[0];
  
  if(div_default){
    div_box.style.height="25rem";
    div_topbox.style.display="none";
  }
});

function ProductClick(element){
  var product = $(element).find(".element_btn")
  
  console.log(product);

  product[0].click();
}

function UpbtnClick(element){
  var product = $(element).find(".element_upbtn")
  
  product[0].click();
}

function DelbtnClick(){
  swal({
    title:'삭제하시겠습니까?',
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
  }).then(function(result) {
    if(result) {
      $("#srvr_element_deleteform").submit();
    }
  })
}

