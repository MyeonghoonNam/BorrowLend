// $(document).ready(() => {
//   $("#header").load("../../pages/header.html");

// })


function menuopen(){
  if($("input:checkbox[id='hamburger']").is(":checked") == true){
    $(".nav").show();
    $(".nav").animate({
      left:0
    });
    $(".userwrap").show();
    $(".userwrap").animate({
      left:0
    });
  }
  else if($("input:checkbox[id='hamburger']").is(":checked") == false){
    $(".nav").hide();
    $(".nav").animate({
      left:'-' + 40 + '%'
    });
    $(".userwrap").hide();
    $(".userwrap").animate({
      left:'-' + 40 + '%'
    });
  }
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


