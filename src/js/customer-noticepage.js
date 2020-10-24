$(document).ready(function(){
  
  $(document).on('click', '.notice_updatebtn', function(){
    // var key = $('.qna_answer_key').attr('value');
    var title = $('.notice_titleview').text();
    var content = $('.notice_contentview').text();
    
    var title_html = '';
    title_html = '<input class=\"notice_titleview_update\" value=\"'+ title +'\">';
    $('.notice_titleview').html(title_html);
    
    var content_html = '';
    content_html = '<textarea class=\"notice_contentview_update\" spellcheck=\"false\" wrap=\"hard\" style=\"resize: none;\">'+ content +'</textarea>';
    $('.notice_contentview').html(content_html);
    
    var confirm = '';
    confirm = '<button type=\"button\" class=\"notice_adminbtn notice_update_confirm\">완료</button> ';
    
    var cancle = '';
    cancle = '<button type=\"button\" class=\"notice_adminbtn notice_update_cancle\">취소</button>';
    
    $('.notice_updatebox').html(confirm+cancle);

    $(document).on('click', '.notice_update_confirm', function(){
      var title = $('.notice_titleview_update').val();
      var content = $('.notice_contentview_update').val();
      var key = $('.notice_updatetoken').val();

      $.ajax({
        url:'/customer-notice-update',
        dataType:'json',
        type:'post',
        data:{
          title:title,
          content:content,
          key:key
        },
        success:function(){
          window.location.reload();
        }
      });
    })
  });

  var title = $('.notice_titleview').text();
  var content = $('.notice_contentview').text();
  var updatebtn = $('.notice_updatebtn');
  var deletebtn = $('.notice_deletebtn');

  $(document).on('click', '.notice_update_cancle', function(){
    $('.notice_titleview').html(title);
    $('.notice_contentview').html(content);
    $('.notice_updatebox').empty();
    $('.notice_updatebox').append(updatebtn);
    $('.notice_updatebox').append(' ');
    $('.notice_updatebox').append(deletebtn);
  });
})
