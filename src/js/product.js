$(document).ready(function(){
  $(".slider").slick({
    dots:true,
    arrows:true,
    slidesToShow: 1,
    slidesToScroll: 1,
  }).on('setPosition', function (event, slick) {
    slick.$slides.css('height', slick.$slideTrack.height() + 'px');
  });

  $(document).on('click', '.product_likebtn', function(){
    var btn = document.getElementsByClassName('product_likebtn')[0];
    var token = document.getElementsByClassName('info_pid')[0];
    var uid = document.getElementsByClassName('info_uid')[0];
    $.ajax({
      url:'/product_like',
      dataType:'json',
      type:'post',
      data:{count:btn.getAttribute("value"),
            key:token.getAttribute("value"),
            uid:uid.getAttribute("value")
      },
      success:function(result){
          $("i").remove(".product_likebtn");
          if(result.btn === "1"){
            var likebtn = "<i class=\"product_likebtn fas fa-heart fa-3x\" value=\"1\">";
            $(".product_userinfo").append(likebtn);
          } else {
            var likebtn = "<i class=\"product_likebtn far fa-heart fa-3x\" value=\"0\">";
            $(".product_userinfo").append(likebtn);
          }
      }
    });
  });
  
  
});
