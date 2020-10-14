// 동적 게시판 리스트 레이아웃 구현


function BoardClick(element){
  var board = $(element).find(".board_element_btn")
  
  console.log(board);

  board[0].click();
}

