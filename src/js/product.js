$(document).ready(function(){
  // 이미지 뷰

  // 백업용
  // $(".slider").slick({
  //   dots:true,
  //   arrows:true,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  // }).on('setPosition', function (event, slick) {
  //   slick.$slides.css('height', slick.$slideTrack.height() + 'px');
  //   if(slick.$slideTrack.width()==1600){
  //     slick.$slides.css('height', '288px');
  //   }
  // });

  $(".slider").slick({
    dots:true,
    arrows:true,
    slidesToShow: 1,
    slidesToScroll: 1,
  });

  // 좋아요 기능
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
            var likebtn = "<i class=\"product_likebtn fas fa-heart fa-3x\" value=\"1\"><span class=\"product_likecount\">"+ result.count +"</span></i>";
            $(".product_userinfo").append(likebtn);
          } else {
            var likebtn = "<i class=\"product_likebtn far fa-heart fa-3x\" value=\"0\"><span class=\"product_likecount\">"+ result.count +"</span></i>";
            $(".product_userinfo").append(likebtn);
          }
      }
    });
  });
});

function UserinfoClick(e){
  var submit = $(e).find('.product_usertoken_submit');
  submit[0].click();
}