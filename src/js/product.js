$(document).ready(function(){
  $(".slider").slick({
    dots:true,
    arrows:true,
    slidesToShow: 1,
    slidesToScroll: 1,
  }).on('setPosition', function (event, slick) {
    slick.$slides.css('height', slick.$slideTrack.height() + 'px');
  });

  var check = document.getElementsByClassName('info_pricecheck')[0];

  if(check.value == "0") {
    check.style.display = "none";
  } else {
    check.style.display = "block";
  }

  var btn = document.getElementsByClassName('product_likebtn')[0];
  var token = document.getElementsByClassName('info_pid')[0];
  var uid = document.getElementsByClassName('info_uid')[0];
  
  $('.product_likebtn').click(function(){
    $.ajax({
      url:'/product_like',
      dataType:'json',
      type:'POST',
      data:{count:btn.getAttribute("value"),
            key:token.getAttribute("value"),
            uid:uid.getAttribute("value")
      },
      success:function(result){
          $("i").remove(".product_likebtn");
          if(result.count === "1"){
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