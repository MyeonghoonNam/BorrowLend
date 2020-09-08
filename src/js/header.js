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

function  submenu1(){
  $("#service-menu").toggle();
}

function  submenu2(){
  $("#customersupport-menu").toggle();
}