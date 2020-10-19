$(document).ready(function(){

  if(document.getElementsByClassName('message_info')[0]){
    $('.message_firstdefault').css("display", "none");
    $('.message_left').css("display", "block");
    $('.message_right').css("display", "block");
  } else {
    $('.message_firstdefault').css("display", "block");
    $('.message_left').css("display", "none");
    $('.message_right').css("display", "none");
  }

  var messageList = document.getElementsByClassName('message_info');

  for(var i=0; i < messageList.length; i++){
    if(messageList[i].children[4].getAttribute('value')== 'Y') {
      messageList[i].style.color = "darkgray";
      messageList[i].children[2].style.color = "darkgray";
    }
  }

  $('.message_info').hover(function(){
    $(this).find('.message_sentid').css('text-decoration', 'underline');
    $(this).find('.message_senttitle').css('text-decoration', 'underline');
  }, function(){
    $(this).find('.message_sentid').css('text-decoration', 'none');
    $(this).find('.message_senttitle').css('text-decoration', 'none');
  })
  
  // 받은쪽지 태그 클릭 시
  $(document).on('click', '.message_recvtag', function(){
    $.ajax({
      url:'/message_recvlist',
      type:'get',
      success:function(result){
          $('.message_default').css("display", "block");
          $('.message_display').css("display", "none");
          $('.message_sent_content_img').remove();
          $('.message_info').remove();

          var html = "";
          for(var i=0; i<result.recv_message.length; i++){
            var message_sent_id = result.recv_message[i].sent_id;
            var message_sent_date = result.recv_message[i].sent_date;
            var sent_title = result.recv_message[i].title;
            var message_key = result.recv_message[i].key;
            var message_readtoken = result.recv_message[i].read_recv;

            html += "<div class='message_info'>";
            html += "<div class='message_sentid'>" + message_sent_id + "</div>";
            html += "<div class='message_sentdate'>" + message_sent_date + "</div>";
            html += "<div class='message_senttitle'>" + sent_title + "</div>";
            html += "<input type='hidden' class='message_token' value=\'"+ message_key +"\'>";
            html += "<input type='hidden' class='message_read' value=\'" + message_readtoken +"\'>";
            html += "</div>"
          }
          $('.message_left').html(html);

          if(document.getElementsByClassName('message_info')[0]){
            $('.message_firstdefault').css("display", "none");
            $('.message_left').css("display", "block");
            $('.message_right').css("display", "block");
          } else {
            $('.message_firstdefault').css("display", "block");
            $('.message_left').css("display", "none");
            $('.message_right').css("display", "none");
          }

          var messageList = document.getElementsByClassName('message_info');

          for(var i=0; i < messageList.length; i++){
            if(messageList[i].children[4].getAttribute('value')== 'Y') {
              messageList[i].style.color = "darkgray";
              messageList[i].children[2].style.color = "darkgray";
            }
          }

          $('.message_info').hover(function(){
            $(this).find('.message_sentid').css('text-decoration', 'underline');
            $(this).find('.message_senttitle').css('text-decoration', 'underline');
          }, function(){
            $(this).find('.message_sentid').css('text-decoration', 'none');
            $(this).find('.message_senttitle').css('text-decoration', 'none');
          })

          $('.message_senttag').css('color', 'darkgray');
          $('.message_recvtag').css('color', 'black');
      }
    });
  });

  // 받은쪽지함 쪽지 클릭 시
  $(document).on('click', '.message_info', function(){
    var token = $(this).find(".message_token").attr("value");
    $(this).css('color', 'darkgray');
    $(this).find(".message_senttitle").css('color', 'darkgray');
    // var readtoken = "Y";

    $.ajax({
      url:'/message_recvlist',
      type:'post',
      data:{
        token:token
      },
      success:function(result){
          $('.message_default').css("display", "none");
          $('.message_display').css("display", "block");
          $('.message_sent_content_img').remove();

          var sent_grade = result.userinfo[0].grade;
          var sent_name = result.userinfo[0].id;
          var title = result.message.title;
          var imgsrc = result.message.Imglist;
          var content = result.message.content;

          var img = "";
          for(var i=0; i<imgsrc.length; i++){
            img += "<img class='message_sent_content_img' src=\'" + imgsrc[i] + "\'>";
          }
          
          $('.message_sent_span').html("보낸사람");
          $('.sent_grade').html(sent_grade);
          $('.sent_name').html(sent_name);
          $('.message_sent_title').html(title);
          $('.message_sent_content').html(content);
          $('.message_sent_imgbox').append(img);
          currSlide = 1;
          handleImgSlider(currSlide);

      }
    });
  });

  // 보낸쪽지 태그 선택 시
  $(document).on('click', '.message_senttag', function(){
    $.ajax({
      url:'/message_sentlist',
      type:'get',
      success:function(result){
          
          $('.message_default').css("display", "block");
          $('.message_display').css("display", "none");
          $('.message_sent_content_img').remove();
          $('.message_info').remove();

          var html = "";
          for(var i=0; i<result.sent_message.length; i++){
            var message_recv_id = result.sent_message[i].recv_id;
            var message_recv_date = result.sent_message[i].sent_date;
            var recv_title = result.sent_message[i].title;
            var message_key = result.sent_message[i].key;

            html += "<div class='message_recvinfo'>";
            html += "<div class='message_recvid'>" + message_recv_id + "</div>";
            html += "<div class='message_recvdate'>" + message_recv_date + "</div>";
            html += "<div class='message_recvtitle'>" + recv_title + "</div>";
            html += "<input type='hidden' class='message_token' value=\'"+ message_key +"\'>";
            html += "</div>"
          }
          $('.message_left').html(html);

          if(document.getElementsByClassName('message_recvinfo')[0]){
            $('.message_firstdefault').css("display", "none");
            $('.message_left').css("display", "block");
            $('.message_right').css("display", "block");
          } else {
            $('.message_firstdefault').css("display", "block");
            $('.message_left').css("display", "none");
            $('.message_right').css("display", "none");
          }
          
          $('.message_recvinfo').hover(function(){
            $(this).find('.message_recvid').css('text-decoration', 'underline');
            $(this).find('.message_recvtitle').css('text-decoration', 'underline');
          }, function(){
            $(this).find('.message_recvid').css('text-decoration', 'none');
            $(this).find('.message_recvtitle').css('text-decoration', 'none');
          })

          $('.message_senttag').css('color', 'black');
          $('.message_recvtag').css('color', 'darkgray');

      }
    });
  });

  //보낸쪽지함 쪽지 선택 시
  $(document).on('click', '.message_recvinfo', function(){
    var token = $(this).find(".message_token").attr("value");

    $.ajax({
      url:'/message_sentlist',
      type:'post',
      data:{
        token:token
      },
      success:function(result){
          $('.message_default').css("display", "none");
          $('.message_display').css("display", "block");
          $('.message_sent_content_img').remove();

          
          var recv_grade = result.userinfo[0].grade;
          var recv_id = result.userinfo[0].id;
          var title = result.message[0].title;
          var imgsrc = result.message[0].Imglist;
          var content = result.message[0].content;

          var img = "";
          for(var i=0; i<imgsrc.length; i++){
            img += "<img class='message_sent_content_img' src=\'" + imgsrc[i] + "\'>";
          }
          

          $('.message_sent_span').html("받는사람");
          $('.sent_grade').html(recv_grade);
          $('.sent_name').html(recv_id);
          $('.message_sent_title').html(title);
          $('.message_sent_content').html(content);
          $('.message_sent_imgbox').append(img);
          currSlide = 1;
          handleImgSlider(currSlide);

      }
    });
  });
});

let currSlide = 1;

function handleImgSlider(num){
  
  var slides = document.querySelectorAll(".message_sent_content_img");
  let messageimg_count = slides.length;
  
  $(".message_sent_Imgprevbtn").css("display","none");
  $(".message_sent_Imgnextbtn").css("display","none");

  if(messageimg_count>1){
    $(".message_sent_Imgprevbtn").css("display","inline");
    $(".message_sent_Imgnextbtn").css("display","inline");
    
  }

  if(num>slides.length){
    currSlide = 1;
  } if(num<1){
    currSlide = slides.length;
  }

  if(messageimg_count>0){
    $('.message_sent_imgbox').css("display", "block");
    for(let i=0; i<slides.length; i++){
      slides[i].style.display="none";
    }
    slides[currSlide-1].style.display="block";
  } else {
    $('.message_sent_imgbox').css("display", "none");
  }
}

function Previewbtn_Click(num){
  handleImgSlider((currSlide+=num));
}
