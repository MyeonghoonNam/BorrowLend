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
    $(".logo a").css({color: "white"});
    $('html, body').css({'overflow': 'hidden', 'height': '150%'});
  }
  else if($("input:checkbox[id='hamburger']").is(":checked") == false){
    $(".nav").hide();
    $(".nav").animate({
      left:'-' + 100 + '%'
    });
    $(".userwrap").hide();
    $(".userwrap").animate({
      left:'-' + 100 + '%'
    });
    $(".logo a").css({color: "black"});
    $('html, body').css({'overflow': '', 'height': ''});
  }
}


function  servicemenu1(){
  $("#service-menu").toggle();
  if($(".service-menu1").text() == "﹀"){
    $(".service-menu1").text("︿");
  }
  else if($(".service-menu1").text() == "︿"){
    $(".service-menu1").text("﹀");
  }
}

function  servicemenu2(){
  $("#customersupport-menu").toggle();
  if($(".service-menu2").text() == "﹀"){
    $(".service-menu2").text("︿");
  }
  else if($(".service-menu2").text() == "︿"){
    $(".service-menu2").text("﹀");
  }
}

function  servicemenu3(){
  $("#service-menu").toggle();
  if($(".service-menu1").text() == "﹀"){
    $(".service-menu1").text("︿");
  }
  else if($(".service-menu1").text() == "︿"){
    $(".service-menu1").text("﹀");
  }
}

function  servicemenu4(){
  $("#customersupport-menu").toggle();
  if($(".service-menu2").text() == "﹀"){
    $(".service-menu2").text("︿");
  }
  else if($(".service-menu2").text() == "︿"){
    $(".service-menu2").text("﹀");
  }
}


