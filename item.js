$(document).ready(function(){
  itemposition();   // 아이템 구역 설정
});

function itemposition(){
  var top = ($(window).height() - CANVASHEIGHT) / 2;
  $("#item").css({"top": top});
}

// 유리한 아이템
var gooditem=["Adagio(느리게)!","공이 하나 더 생겼군","largamente! 폭넓게!","내가 도와주겠네!"];
// 불리한 아이템
var baditem=["Allegro(빠르게)!","staccato! 공이 잘 안보일테니 조심하게!"];

function getgood(num){  // 유리한 아이템 먹었을때
  $("#itemresult").text("아이템 획득!");
  setTimeout(function (){ // 1초뒤 랜덤으로 생성된 인자에 따라 아이템 함수 실행
    $("#itemresult").text(gooditem[num]);
    if(num==0){
      good1();
    }else if(num==1){
      good2();
    }else if(num==2){
      good3();
    }else if(num==3){
      good4();
    }
  },1000);
  
}

function getbad(num){   // 불리한 아이템 먹었을때
  $("#itemresult").text("아이템 획득!");
  setTimeout(function (){
    $("#itemresult").text(baditem[num]);
    if(num==0){
      bad1();
    }else if(num==1){
      bad2();
    }
  },1000);
}

function good1(){
  adagio();
}
function good2(){
  double();
}
function good3(){
  largament();
}
function good4(){
  help();
}
function bad1(){
  allegro();
}
function bad2(){
  staccato();
}