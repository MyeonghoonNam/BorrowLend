$(document).ready(() => {
  $("#header").load("../../pages/header.html");
})


function menuopen(){
    $(".nav").show();
    $(".nav").animate({
      left:0
    });
  $(".userwrap").show();
  $(".userwrap").animate({
    left:0
  });
}
function  menuclose(){
    $(".nav").hide();
    $(".nav").animate({
      left:'-' + 40 + '%'
    });
  $(".userwrap").hide();
  $(".userwrap").animate({
    left:'-' + 40 + '%'
  });
}

$(document).ready(function(){
  $(".menu > li > a").click(function(){
    $("#service-menu").append();
  });
});


