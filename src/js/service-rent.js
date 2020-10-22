// 동적 상품리스트 레이아웃 구현
$(document).ready(function(){
  var ProductList = [];
  ProductList = document.getElementsByClassName("servicerent-product-element");
  
  if(ProductList.length%3 == 2){
    
    var storebox = document.getElementsByClassName("servicerent-product-elementbox")[0];
    var layoutbox = document.createElement('div');
    
    layoutbox.setAttribute("class", "servicerent-product-element");
    layoutbox.setAttribute("style", "display:block");
    storebox.appendChild(layoutbox);
    ProductList[ProductList.length-1].style.border="none";
    ProductList[ProductList.length-1].style.cursor="default";
  }
  
  $('.servicerent_default_review').css("display", "none");
  
  $(document).on('click', '.srvr_reveiwlist', function(){
    $.ajax({
      url:'/service-rent_reviewlist',
      type:'get',
      success:function(result){
        ReviewlistClick();
        Reviewlist(result);
      }
    });
  });
  
  $(document).on('click', '.srvr_productlist', function(){
    
    $.ajax({
      url:'/service-rent_productlist',
      type:'get',
      success:function(result){
        ProductlistClick();
        Productlist(result);
      }
    });
  });
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

function DelbtnClick(element){
  var deleteform = $(element);
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
      
      deleteform.submit();
    }
  })
}

function ReviewlistClick(){
  $('.servicerent-product-element').css('display', 'none');
  $('.servicerent_review').css('display', 'block');
  $('.srvr_reveiwlist').css("color", "black");
  $('.srvr_productlist').css("color", "darkgray");
}

function ProductlistClick(){
  $('.servicerent-product-element').css('display', 'block');
  $('.servicerent_review').css('display', 'none');
  $('.srvr_reveiwlist').css("color", "darkgray");
  $('.srvr_productlist').css("color", "black");
}

function Reviewlist(e) {
  if(e.review.length != 0){
    $('.servicerent_default_product').css("display", "none");
    $('.servicerent_default_review').css("display", "none");
    
    var html = '';
    for(var i=0; i<e.review.length; i++){
      html += '<div class=\"product_userinfo_review_element\">';
      html += '<div class=\"review_element_user\">';
      html += '<img class=\"review_element_img\" src=\"../../src/images/user.svg\">';
      html += '<div class=\"review_element_grade\">'+ e.review[i].grade +'</div>'
      html += '<div class=\"review_element_id\">'+ e.review[i].id +'</div>'
      html += '<div class=\"review_element_date\">'+ e.review[i].created_at +'</div>'
      html += '</div>';
      html += '<div class=\"review_element_content\">'+ e.review[i].content +'</div>'
      html += '<div class=\"review_element_star\">';
      for(var count=0; count<5; count++){
        if(e.review[i].rate > count){
          html += "<div class=\'star_fill\'>\u2605</div>";
        } else {
          html += "<div class=\'star_empty\'>\u2605</div>";
        }
      }
      html += '<div class=\"review_element_rate\">'+ e.review[i].rate +'</div>'
      html += '</div>';
      html += '</div>';
    } 
    $('.servicerent_review').html(html);
  } else {
    $('.servicerent_default_product').css("display", "none");
    $('.servicerent_default_review').css("display", "block");
  }
}

function Productlist(e) {
  if(e.product.length != 0){
    $('.servicerent_default_product').css("display", "none");
    $('.servicerent_default_review').css("display", "none");
    
    var html = '';
    for(var i=0; i<e.product.length; i++){
      var j = 0;
      
      html += '<div class=\"servicerent-product-element\">'
      html += '<form method=\"get\" action=\"/product\" onclick=\"ProductClick(this)\">';
      html += '<img class=\"srvr_element_img\" src=\"../../src/uploads/'+ e.product[i].list[j].name +'\">';
      html += '<div class=\"srvr_element_title\">'+ e.product[i].title +'</div>';
      html += '<div class=\"srvr_element_price\">'+ e.product[i].price +'</div>';
      html += '<div class=\"srvr_element_likebox\">';
      html += '<i class=\"srvr_element_icon fas fa-heart\"></i>';
      html += '<div class=\"srvr_element_count\">'+ e.product[i].LikeCount +'</div>';
      html += '</div>';
      html += '<input type=\"hidden\" name=\"element_token\" value=\"'+ e.product[i].key +'\">';
      html += '<input type=\"submit\" class=\"element_btn\" style=\"display:none\">';
      html += '</form>';
      html += '<div class=\"srvr_element_btn\">';
      html += '<form class=\"srvr_element_udform\" method=\"get\" action=\"/product_update\" onclick=\"UpbtnClick(this)\">';
      html += '<div class=\"srvr_element_update\">수정</div>';
      html += '<input type=\"hidden\" name=\"element_uptoken\" value=\"'+ e.product[i].key +'\">';
      html += '<input type=\"submit\" class=\"element_upbtn\" style=\"display:none\">';
      html += '</form>';
      html += '<form class=\"srvr_element_udform\" id=\"srvr_element_deleteform\" method=\"post\" action=\"/product_delete\" onclick=\"DelbtnClick()\">';
      html += '<div class=\"srvr_element_delete\">삭제</div>';
      html += '<input type=\"hidden\" name=\"element_deltoken\" value=\"'+ e.product[i].key +'\">';
      html += '</form>';
      html += '</div>';
      html += '</div>';
    }
    $('.servicerent-product-elementbox').html(html);
    
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
    
    // var div_box = document.getElementsByClassName('servicerent-product')[0];
    // var div_default = document.getElementsByClassName('servicerent_defaul_product')[0];
    
    // if(div_default){
      //   div_box.style.height="25rem";
      // }
    } else {
      $('.servicerent_default_product').css("display", "block");
      $('.servicerent_default_review').css("display", "none");
    }
  }
  
  