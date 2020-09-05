// var thisfilefullname = document.URL.substring(document.URL.lastIndexOf('/') + 1, document.URL.length);

// var thisfilename = thisfilefullname.substring(thisfilefullname.lastIndexOf('.'), 0);

// console.log(thisfilename);

// var mark1 = document.getElementsByClassName('mark1')[0]
// var item1 = document.getElementsByClassName('small-item1')[0]
// var mark2 = document.getElementsByClassName('mark2')[0]
// var item2 = document.getElementsByClassName('small-item2')[0]
// var name;
// var mainname;
// var subname;

// if(thisfilename == 'store' || 'message' || 'honor'){
//   if(thisfilename == 'store'){
//     name = '장터';
//   } else if (thisfilename == 'message') {
//       name = '쪽지';
//   } else {
//       name = '명예의 전당';
//   } 

//   mark1.innerHTML = '>';

//   $(mark1).css({
//     color:'darkgray'
//   });

//   item1.innerHTML = name;

//   $(item1).css({
//     color:'black'
//   });

//   $(mark2).css({
//     display:'block'
//   });
  
//   $(item2).css({
//     display:'block'
//   });

// } else {
//   if(thisfilename == 'sevice-rent' || 'service-like') {
//     mainname = '서비스';
//   } else {
//     mainname = '고객지원';
//   }

//   if(thisfilename == 'service-rent'){
//     subname = '대여물품';
//   } else if(thisfilename == 'service-like') {
//     subname = '관심물품';
//   } else if(thisfilename == 'customer-notice') {
//     subname = '공지사항';
//   } else if(thisfilename == 'customer-q&a') {
//     subname = 'Q&A';
//   }

//   mark1.innerHTML = '>';
  
//   $(mark1).css({
//     color:'darkgray'
//   });
  
//   item1.innerHTML = mainname;
  
//   $(item1).css({
//     color:'darkgray'
//   });
  
//   mark2.innerHTML = '>';
  
//   $(mark2).css({
//     color:'darkgray'
//   });
      
//   item2.innerHTML = subname;
  
//   $(item2).css({
//     color:'black'
//   });
// }
//   // console.log(name);
function Page_Title(){
  var thisfilefullname = document.URL.substring(document.URL.lastIndexOf('/') + 1, document.URL.length);

  var thisfilename = thisfilefullname.substring(thisfilefullname.lastIndexOf('.'), 0);

  console.log(thisfilename);

  return thisfilename;
}

function s_layout(s){
  var mark1 = document.getElementsByClassName('mark1')[0]
  var item1 = document.getElementsByClassName('small-item1')[0]
  var mark2 = document.getElementsByClassName('mark2')[0]
  var item2 = document.getElementsByClassName('small-item2')[0]
  var name = s;

  mark1.innerHTML = '>';

  $(mark1).css({
    color:'darkgray'
  });

  item1.innerHTML = name;

  $(item1).css({
    color:'black'
  });

  $(mark2).css({
    display:'none'
  });
  
  $(item2).css({
    display:'none'
  });
};

function l_layout(m, s){
  var mark1 = document.getElementsByClassName('mark1')[0]
  var item1 = document.getElementsByClassName('small-item1')[0]
  var mark2 = document.getElementsByClassName('mark2')[0]
  var item2 = document.getElementsByClassName('small-item2')[0]
  
  var mainname=m;
  var subname=s;

  mark1.innerHTML = '>';
  
  $(mark1).css({
    color:'darkgray'
  });
  
  item1.innerHTML = mainname;
  
  $(item1).css({
    color:'darkgray'
  });
  
  mark2.innerHTML = '>';
  
  $(mark2).css({
    color:'darkgray',
    display:'block'
  });
      
  item2.innerHTML = subname;
  
  $(item2).css({
    color:'black',
    display:'block'
  });
};

var filename = Page_Title();

if(filename == 'store' || 'message' || 'honor'){
  if(filename == 'store'){
    var name = '장터';
    s_layout(name);
  } else if (filename == 'message') {
    var name = '쪽지';
    s_layout(name);
  } else if (filename == 'honor'){
    var name = '명예의 전당';
    s_layout(name);
  } 
} 

if(filename == 'service-rent' || 'service-like') {
    var mainname = '서비스';

    if(filename == 'service-rent'){
      var subname = '대여물품';
      l_layout(mainname, subname);
    } else if(filename == 'service-like'){
      var subname = '관심물품';
      l_layout(mainname, subname);
    }
} 

if(filename == 'customer-notice' || 'customer-q&a') {
    var mainname = '고객지원';
    if(filename == 'customer-notice'){
      var subname = '공지사항';
      l_layout(mainname, subname);
    } else if(filename == 'customer-q&a'){
      var subname = 'Q&A';
      l_layout(mainname, subname);
    }
}
