// $(document).ready(() => {
//   $("#header").load("../../pages/header.html");

// })

$(document).ready(() => {
  var burger = $('.menu-trigger');

    burger.each(function(index){
    var $this = $(this);
    
    $this.on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('active-' + (index+1));
    })
  });
});


function menuopen(){
  if($(".nav").css("display") == "none"){
    $(".nav").show();
    $(".userwrap").show();
    $(".logo a").css({color: "white"});
    $('html, body').css({'overflow': 'hidden', 'height': '150%'});
  }else{
    $(".nav").hide();
    $(".userwrap").hide();
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


