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

function  servicemenu1(){
  $("#service-menu").toggle();
  if($(".service-menu1").text() == "▼"){
    $(".service-menu1").text("▲");
  }
  else if($(".service-menu1").text() == "▲"){
    $(".service-menu1").text("▼");
  }
}

function  servicemenu2(){
  $("#customersupport-menu").toggle();
  if($(".service-menu2").text() == "▼"){
    $(".service-menu2").text("▲");
  }
  else if($(".service-menu2").text() == "▲"){
    $(".service-menu2").text("▼");
  }
}
