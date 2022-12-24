// 캔버스
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var CANVASWIDTH = 800;
var CANVASHEIGHT = 500;

// 공
var colorNames = ["red","orange","yellow","green","blue","purple","gray"];
var y = 250;
var x = 400;
var bpColor = "red"; 
var dx = -1;
var dy = 1;
var BALLRADIUS = 10;
var downdirection = 0; // 0이면 왼쪽(좌하향) 1이면 오른쪽(우하향)

// 두번째 공
var y2 = 250;
var x2 = 400;
var bpColor2 = "green"; 
var dx2 = dy2 = 1;
var BALLRADIUS2 = 10;
var secondball=false;   // 두번째 공 활성화 여부
var paddleX2=(CANVASWIDTH-paddleWidth)/2;   // 두번째 공은 자동으로 다른 패드가 등장하여 조작함.

// 블록
var blocks;
var ROWS = 5;
var COLS = 5;
var MARGIN = 50;
var PADDING = 1;
var BLOCKWIDTH = (CANVASWIDTH / COLS);
var BLOCKHEIGHT = 20;
var flag;
var movingBlocks = 0;
var movingSpeed = 0;
var LIFE = 3;

// 패들
var paddleHeight = 30;
var paddleWidth = 100;
var paddleX = (CANVASWIDTH-paddleWidth)/2;

// 점수 및 난이도
var SCORE = 0;
var leaderBoard = [];
var version;

// setInterval 변수
var ball;

// 벽돌, 패드 이미지
var img = new Image();
img.src = "image/note.png";

var padimg = new Image();
padimg.src = "image/padimg.png";

// 아이템 이미지
var item0 = new Image();
item0.src = "image/adagio.png";

var item1 = new Image();
item1.src = "image/double.png";

var item2 = new Image();
item2.src = "image/largamente.png";

var item3 = new Image();
item3.src = "image/help.png";

var item4 = new Image();
item4.src = "image/allegro.png";

var item5 = new Image();
item5.src = "image/staccato.png";

// 효과음
var Ascending = new Audio("audio/Ascending.mp3");
var Descending = new Audio("audio/Descending.mp3");
var Blop = new Audio("audio/Blop.mp3");
var Pling = new Audio("audio/Pling.mp3");
var Breaking = new Audio("audio/Breaking.mp3");
var Correct = new Audio("audio/Correct.mp3");
var Warning = new Audio("audio/Warning.mp3");

//게임 결과 텍스트
var randomlose = ["꿈을 기억하지 못한다", "악몽을 꿨다", "영감 없는 꿈이었다"];
var randomwin = ["명곡을 작성한다", "성공적인 복귀 연주회", "슬럼프 극복"];
/***** 이상 변수 *****/

//페이지 로드되면 body 위치 정중앙 설정
$(document).ready(function(){
  bodyposition();
});

function bodyposition(){
  var margintop = ($(window).height() - CANVASHEIGHT) / 2; 
  $("body").css({"margin-top": margintop});
  var top = ($(window).height() - 300) / 2;
  var left = ($(window).width() - 550) / 2;
  $(".popup").css({"top": top, "left" : left});
  $(".popup1").css({"top": ($(window).height() - 200) / 2, "left" : ($(window).width() - 400) / 2}); 
}

// 메뉴로 가는 버튼 통합
function backtomain() {
  $("#content").css("opacity","1.0");
  $("#content").css("display","block");
  $("#setting").css("display","none");
  $("#showscore").css("display","none");
  $("#gameinfo").css("display","none");
  $("#gamecontent").css("display","none");
  $("#item").css("display","none");
  $("#whenlose").css("display","none");
  $("#whenwin").css("display","none");
}

// 게임 정보 호출
function openinfo(){
  $("#content").css("display","none");
  $("#gameinfo").css("display","block");
  var infocontent = "<br><h3>게임 방법</h3> <br>\
  슬럼프에 빠진 음악가를 도와 꿈 속 악보를 연주하세요.<br>\
  악보를 <div class='highlight'>왼쪽부터 순서대로</div> 연주하면 더 많은 점수를 획득할 수 있습니다.<br>\
  하단 패들의 왼쪽에 맞으면 공이 <div class='highlight'>왼쪽으로</div>, 오른쪽에 맞으면 공이 <div class='highlight'>오른쪽으로</div> 움직입니다.<Br><br>\
  <h3>난이도 정보</h3> <br>\
  드뷔시 : 다섯 마디로 이루어져 있으며, 긴 패들과 느린 공속도를 갖습니다. <br>\
  베토벤 : 여덟 마디로 이루어져 있으며, 중간 패들과 빠른 공속도를 갖습니다. <br>\
  모차르트 : 열 마디로 이루어져 있으며, 짧은 패들과 빠른 공속도를 갖습니다.<br>추가로, 모차르트 난이도는 악보가 좌우로 움직입니다.<br><br>\
  <h3>아이템 정보</h3> <br>\
  adagio : 공의 속도가 느려집니다. <br>\
  largamente : 5초 동안 패들의 길이가 길어집니다. <br>\
  double : 10초 동안 두번째 공이 활성화됩니다. <br>\
  help : 5초 동안 자동으로 연주합니다. <br>\
  allegro : 공의 속도가 빨라집니다. <br>\
  staccato : 공이 잠시 보이지 않게 됩니다. <br><br>";
  document.getElementById('infocontent').innerHTML = infocontent;
}

// 점수 보기 호출
function openscore(){
  $("#content").css("display","none");
  $("#showscore").css("display","block");
  $("#whenwin").css("display","none");
  document.getElementById('scorecontent').innerHTML = '<h1>순위표<h1>';
  if(leaderBoard.length == 0)
  {
    $("#scorecontent").append("<br>아직 순위가 없습니다!");
  }
  
  for(var i = 0; i <= leaderBoard.length; i++)
  {
    if (i==9) break;
    if(leaderBoard[i] !== undefined && leaderBoard[i] !== null)
    {
      $("#scorecontent").append("<br>" + (i+1) + "위 : ");
      $("#scorecontent").append(leaderBoard[i] + "점<br>");
    } 
  }
}

/********** 이하 환경 설정 **********/

// 환경 설정 호출
function setting() {
  var colordiv = document.getElementById("colorTable");
  var parent = document.getElementById("colorTable");
  var child = parent.getElementsByClassName("ctbox");
  while(child[0]){
    colordiv.removeChild(child[0]);
  }

  for (var i = 0; i < colorNames.length; i++) {
    var ndiv = document.createElement("div");
    ndiv.setAttribute("class", "ctbox");
    ndiv.innerHTML = colorNames[i];
    ndiv.style.backgroundColor = colorNames[i];
    colordiv.appendChild(ndiv);
  }
  $(".ctbox").on("click", function() {
    bpColor = $(this).text();
    alert("공 색깔: " + bpColor);
    });
}


function opensetting(){
  $("#content").css("opacity","0.5");
  $("#setting").css("display","block");
  setting();
  $("#settingclose").on("click", function() {
    backtomain();
  })
}
 function tonote(){
   img.src="image/note.png";
   alert("벽돌 모양 변경");
 }
 function tonote1(){
   img.src="image/note1.png";
   alert("벽돌 모양 변경");
 }

function music_volume(){
    var volume = document.getElementById("music_volume");
    document.getElementById('bg').volume = volume.value;
}

function effect_volume(){
  var volume = document.getElementById("effect_volume");
  Ascending.volume = volume.value;
  Descending.volume = volume.value;
  Blop.volume = volume.value;
  Pling.volume = volume.value;
  Breaking.volume = volume.value;
  Correct.volume = volume.value;
  Warning.volume = volume.value;
}

// 게임 종료
function close_window()
 {
  if (confirm("Close Window?")) {
    close();
  }
}

/********** 이하 게임 시작 시 **********/

// 마우스 움직임 감지
document.addEventListener("mousemove", mouseMoveHandler, false);
	
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
  }
}

// 시작 설정
function opengame(){
  SCORE = 0;
  $("#content").css("display","none");
  $("#level").css("display","block");
  init();
}
function init(){
  y = 250;
  x = 400;
  dx = -1;
  dy = 1;
  BALLRADIUS = 10;

  // 두번째 공
  y2 = 250;
  x2 = 400;
  dx2 = dy2 = 1;
  BALLRADIUS2 = 10;
  secondball = false;

  ROWS = 5;
  COLS = 4;
  BLOCKWIDTH = (CANVASWIDTH / COLS);
  BLOCKHEIGHT = 20;
  LIFE = 3;

  paddleHeight = 30;
  paddleWidth = 100;
  paddleX = (CANVASWIDTH-paddleWidth)/2;

}

function gameOver(){
  document.getElementById('bg').pause();
  context.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  clearInterval(ball);
  if(check()==false || (check()==true && version==3)){
    leaderBoard.push(SCORE);
  }
  leaderBoard.sort(function(a, b){ // 정렬할 때 요소를 문자열 취급하기 때문에 값을 비교하는 함수를 추가하여 내림차순으로 정렬함.
    return b - a;
  });
  init();
}

function replaygame() {
  SCORE = 0;
  init();
  $("#gamecontent").css("display","block");
  $("#item").css("display","block");
  $("#whenlose").css("display","none");
  $("#whenwin").css("display","none");
  if(version == 1){
      version1();
    }
    else if(version == 2){
      version2();
    }
    else if(version == 3){
      version3();
    }
}


// 난이도 설정
$(".selectlevel").click(function(){
  SCORE = 0;
  $("#level").hide();
});

$(".selectlevel:nth-of-type(1)").click(function(){
  $("#gamecontent").css("display","block");
  $("#item").css("display","block");
  version1();
});

$(".selectlevel:nth-of-type(2)").click(function(){
  $("#gamecontent").css("display","block");
  $("#item").css("display","block");
  version2();
});

$(".selectlevel:nth-of-type(3)").click(function(){
  $("#gamecontent").css("display","block");
  $("#item").css("display","block");
  version3();
});

function version1(){
  clearInterval(ball);
  paddleWidth = 100;
  COLS = 5;
  dx = -2;
  dy = 2;
  // 두번째공
  dx2 = dy2 = 2;
  BLOCKWIDTH = (CANVASWIDTH / COLS);
  BLOCKHEIGHT = 30;
  version = 1;
  blockset();
  $("#gamecontent").css({"backgroundImage" : 'url("image/DB.jpg")', "background-size" : "500px",  "background-repeat": "no-repeat",  
    "background-position": "center"});
  document.getElementById('itemsrc').src = "image/Debussy.jpeg";
  document.getElementById('bg').src = "audio/debussy.mp3";
  document.getElementById('bg').play();
  ball = setInterval(draw, 10);
}


function version2(){
  clearInterval(ball);
  paddleWidth = 80;
  COLS = 8;
  dx = -3;
  dy = 3;
  // 두번째공
  dx2 = dy2 = 3;
  BLOCKWIDTH = (CANVASWIDTH / COLS);
  BLOCKHEIGHT = 25;
  version = 2;
  blockset();
  $("#gamecontent").css({"backgroundImage" : 'url("image/BT.jpg")',"background-size" : "800px 500px",  "background-repeat": "no-repeat",  
    "background-position": "center"});
  document.getElementById('itemsrc').src = "image/Beethoven.jpeg";
  document.getElementById('bg').src = "audio/BeethovenSonata.mp3";
  document.getElementById('bg').play();
  ball = setInterval(draw, 10);
}

function version3(){
  clearInterval(ball);
  paddleWidth = 60;
  COLS = 10;
  dx = -3;
  dy = 3;
  // 두번째공
  dx2 = dy2 = 3;
  BLOCKWIDTH = (CANVASWIDTH / COLS);
  BLOCKHEIGHT = 20;
  movingSpeed = 1;
  version = 3;
  blockset();
  $("#gamecontent").css({"backgroundImage" : 'url("image/MZ.jpg")',"background-size" : "800px 500px",  "background-repeat": "no-repeat",  
    "background-position": "center"});
  document.getElementById('itemsrc').src = "image/Mozart.jpeg";
  document.getElementById('bg').src = "audio/MozartSymphony.mp3";
  document.getElementById('bg').play();
  ball = setInterval(draw, 10);
}

// 블록 생성
function blockset(){
  blocks = new Array(ROWS);
  for (var i = 0; i < ROWS; i++) {
    blocks[i] = new Array(COLS);
    for (var j = 0; j < COLS; j++) {
        blocks[i][j] = Math.floor(Math.random()*ROWS);
    }
  }

// item
  var itemflag=true;
  var randrow=0;
  var randcol=0;
  var randlist=[10,11,12,13,14,15]; // 아이템 목록
  var itemn=0;  // 버전에 따른 아이템 개수
  if(version==1)
    itemn=2;
  else if(version==2)
    itemn=3;
  else if(version==3)
    itemn=4;

  randlist.sort(()=>Math.random()-0.5); // 아이템을 랜덤하게 섞음

  for(var i=0;i<itemn;i++){
    while(itemflag){    // 조건에 맞지 않으면 반복
      randrow=Math.floor(Math.random()*ROWS);
      randcol=Math.floor(Math.random()*COLS);
      // 음표블록 또는 아이템블록이 있으면 다시 row, col 값을 랜덤으로 뽑음
      if(blocks[randrow][randcol]!=0&&blocks[randrow][randcol]<10){
        blocks[randrow][randcol]=randlist[i];
        itemflag=false;
      }
    }
    itemflag=true;
  }
}

var ballvisible=true; // 스타카토 아이템 먹었을때 이용하는 변수

// 그리기
function draw(){
  context.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

  x += dx;
  y += dy;

  // 두번째 공
  if(secondball){
    x2 += dx2;
    y2 += dy2;
  }
  drawblocks();
  drawPaddle();
  if(ballvisible){
    drawball();
  }
  // 두번째공
  if(secondball){
    drawball2();
    drawPaddle2();
  }

  if(version == 3){
      if(movingBlocks > BLOCKWIDTH/2)
      {
        movingSpeed = -1;
      }
      else if(movingBlocks < -(BLOCKWIDTH/2))
      {
        movingSpeed = +1;
      }
  }
  else{
    movingBlocks = movingSpeed = 0;
  }

  var row = Math.floor((y-MARGIN)/(BLOCKHEIGHT+PADDING));
  var col = Math.floor(x/(BLOCKWIDTH+PADDING));
  var row2 = Math.floor((y2-MARGIN)/(BLOCKHEIGHT+PADDING));
  var col2 = Math.floor(x2/(BLOCKWIDTH+PADDING));
  if(row < ROWS){
    if(blocks[row][col] == 0){  // 음표블록을 만났을 때
      if(x <= BALLRADIUS || x >= CANVASWIDTH-BALLRADIUS){
        dx = -dx;
        dy = -dy;
      }
      else{
        dy = -dy;
      }
      blocks[row][col] = 1;
      
      if(flag == col){
        SCORE += 10;
        Ascending.play();
      }
      else {
        SCORE += 1;
        Descending.play();
      }
    }
    else if(blocks[row][col]>=10){   // 아이템블록을 만났을 때
      if(blocks[row][col]==10){   // 1번 아이템
        getgood(0);
        Correct.play();
        blocks[row][col]=1;
      }
      else if(blocks[row][col]==11){   // 2번 아이템
        getgood(1);
        Correct.play();
        blocks[row][col]=1;
      }
      else if(blocks[row][col]==12){   // 3번 아이템
        getgood(2);
        Correct.play();
        blocks[row][col]=1;
      }
      else if(blocks[row][col]==13){   // 4번 아이템
        getgood(3);
        Correct.play();
        blocks[row][col]=1;
      }
      else if(blocks[row][col]==14){   // 5번 아이템
        getbad(0);
        Warning.play();
        blocks[row][col]=1;
      }
      else if(blocks[row][col]==15){   // 6번 아이템
        getbad(1);
        Warning.play();
        blocks[row][col]=1;
      }
    }
  }

  // 두번째 공
  if(secondball){   // 두번째 공은 음표블록만 깰 수 있다.
    if(row2 < ROWS){
      if(blocks[row2][col2] == 0){
        dy2 = -dy2;
        blocks[row2][col2] = 1;
        if(flag == col2){
           SCORE += 10;
           Ascending.play();
        }
        else {
          SCORE += 1;
          Descending.play();
        }
      }
    }
  }
  context.fillStyle = "black";
  context.font = "bold 20pt CookieRun-Regular";
  context.fillText("SCORE : " + SCORE, 620, 25);

  context.fillStyle = "black";
  context.font = "bold 20pt CookieRun-Regular";
  context.fillText("LIFE : " + LIFE, 500, 25);

  if(check()){
    gameOver();
    version+=1;

    if(version < 4){
      $("#tonextlevel").css("display", "block");
      $("#gamecontent").css("opacity", "0.5");
    }
    else if(version == 4){
      init();
      $("#gamecontent").hide();
      $("#item").hide();

      var index = Math.floor(Math.random()*3);
      $("#winreason").text(randomwin[index]);
      $("#whenwin").show();
    }
    $("#okay").on("click", function(){
      $("#tonextlevel").css("display", "none");
      $("#gamecontent").css("opacity", "1.0");
      if(version == 2){
        version2();
      }
      else if(version == 3){
        version3();
      }
    });
  }

  // 충돌판정
  if((y <= MARGIN + BALLRADIUS && x <= BALLRADIUS) || (y <= MARGIN + BALLRADIUS && x >= CANVASWIDTH-BALLRADIUS)){
    dy = -dy;     // 위쪽 모서리 닿았을때
    dx = -dx;
    Blop.play();
  }
  if(y <= MARGIN + BALLRADIUS){
    dy = -dy; //상
    Blop.play();
  }
  else if(x <= BALLRADIUS || x >= CANVASWIDTH-BALLRADIUS){
    dx = -dx; //좌 우
    Blop.play();
  }
  else if(y >= CANVASHEIGHT - paddleHeight){
    if(x <= BALLRADIUS || x >= CANVASWIDTH-BALLRADIUS){// 패드로 받았는데 모서리일때
      if(x  >= paddleX && x <= paddleX+ paddleWidth){
        dx = -dx;  
        dy = -dy;
        Pling.play();
      }
    }
    else if(x  >= paddleX && x < paddleX+ (paddleWidth/2)){ // 패드 왼쪽
      dy = -dy;
      if(dx > 0){
        dx = -dx;
      }
      Pling.play();
    }
    else if(x >= paddleX+ (paddleWidth/2) && x < paddleX+ paddleWidth){ // 패드 오른쪽
      dy = -dy;
      if(dx < 0){
        dx = -dx;
      }
      Pling.play();
    }
    else{ // 떨어짐
        if(x <= BALLRADIUS || x >= CANVASWIDTH-BALLRADIUS){
          dx = -dx;  
          dy = -dy;
        }
        else{
          dy = -dy;
        }
        Breaking.play();
        if((--LIFE) == 0){
          gameOver();
          $("#gamecontent").hide();
          $("#item").hide();
          var index = Math.floor(Math.random()*3);
          $("#reason").text(randomlose[index]);
          $("#whenlose").show();
        }
    }
  }


  // 충돌판정 두번째 공
  if(secondball){
    if((y2 <= MARGIN + BALLRADIUS && x2 <= BALLRADIUS) || (y2 <= MARGIN + BALLRADIUS && x2 >= CANVASWIDTH-BALLRADIUS)){
      dy2 = -dy2;     // 위쪽 모서리 닿았을때
      dx2 = -dx2;
    }
    if(y2 <= MARGIN + BALLRADIUS){
      dy2 = -dy2; //상
    }
    else if(x2 <= BALLRADIUS || x2 >= CANVASWIDTH-BALLRADIUS){
      dx2 = -dx2; //좌 우
    }
    else if(y2 >= CANVASHEIGHT - paddleHeight){ // 두번째공은 떨어지지 않음
      if(x2 <= BALLRADIUS || x2 >= CANVASWIDTH-BALLRADIUS){
        dx2 = -dx2;  // 아래쪽 모서리 닿았을때
        dy2 = -dy2;
      }
      else{
        dy2 = -dy2;
      }

    }
  }
}

// 그리기 관련 함수
function drawblocks(){
  movingBlocks += movingSpeed;
  for (var i = 0; i < ROWS; i++) {
    for (var j = 0; j < COLS; j++) {
      context.beginPath();
      context.rect((j * BLOCKWIDTH) + movingBlocks, (i * BLOCKHEIGHT + MARGIN),
      (BLOCKWIDTH - PADDING), (BLOCKHEIGHT - PADDING));
      context.closePath();
      context.strokeStyle = "black";
      context.stroke();
      if (blocks[i][j] == 0) {   // 음표 블록
        context.drawImage(img, ((j * BLOCKWIDTH) + (0.25 * BLOCKWIDTH)) + movingBlocks, (i * BLOCKHEIGHT + MARGIN),
        (0.5*BLOCKWIDTH), (BLOCKHEIGHT - PADDING));
      }else if(blocks[i][j]>=10){ // 아이템 블록
        if(blocks[i][j]==10){
          context.drawImage(item0, ((j * BLOCKWIDTH) + (0.25 * BLOCKWIDTH)) + movingBlocks, (i * BLOCKHEIGHT + MARGIN),
          (0.5*BLOCKWIDTH), (BLOCKHEIGHT - PADDING));
        }else if(blocks[i][j]==11){
          context.drawImage(item1, ((j * BLOCKWIDTH) + (0.25 * BLOCKWIDTH)) + movingBlocks, (i * BLOCKHEIGHT + MARGIN),
          (0.5*BLOCKWIDTH), (BLOCKHEIGHT - PADDING));
        }else if(blocks[i][j]==12){
          context.drawImage(item2, ((j * BLOCKWIDTH) + (0.25 * BLOCKWIDTH)) + movingBlocks, (i * BLOCKHEIGHT + MARGIN),
          (0.5*BLOCKWIDTH), (BLOCKHEIGHT - PADDING));
        }else if(blocks[i][j]==13){
          context.drawImage(item3, ((j * BLOCKWIDTH) + (0.25 * BLOCKWIDTH)) + movingBlocks, (i * BLOCKHEIGHT + MARGIN),
          (0.5*BLOCKWIDTH), (BLOCKHEIGHT - PADDING));
        }else if(blocks[i][j]==14){
          context.drawImage(item4, ((j * BLOCKWIDTH) + (0.25 * BLOCKWIDTH)) + movingBlocks, (i * BLOCKHEIGHT + MARGIN),
          (0.5*BLOCKWIDTH), (BLOCKHEIGHT - PADDING));
        }else if(blocks[i][j]==15){
          context.drawImage(item5, ((j * BLOCKWIDTH) + (0.25 * BLOCKWIDTH)) + movingBlocks, (i * BLOCKHEIGHT + MARGIN),
          (0.5*BLOCKWIDTH), (BLOCKHEIGHT - PADDING));
        }
      }
    }
  }
}
function drawball(){
  context.beginPath();
  context.arc(x, y, BALLRADIUS, 0, 2.0 * Math.PI, true);
  if (bpColor == "red") {
    context.fillStyle = "red";
  }else if (bpColor == "orange") {
    context.fillStyle = "orange";
  }else if (bpColor == "yellow") {
    context.fillStyle = "yellow";
  }else if (bpColor == "green") {
    context.fillStyle = "green";
  }else if (bpColor == "blue") {
    context.fillStyle = "blue";
  }else if (bpColor == "purple") {
    context.fillStyle = "purple";
  }else if (bpColor == "gray") {
    context.fillStyle = "gray";
  }
  context.fill();
  context.closePath();
}
function drawPaddle() {
  context.drawImage(padimg, paddleX, CANVASHEIGHT-paddleHeight, paddleWidth, paddleHeight);
  }

// 승리 확인
function check() {
  for (var c = 0; c < COLS; c++) {
    for (var r = 0; r < ROWS; r++) {
      if (blocks[r][c] == 0) {
        flag = c;
        return false;
      }
    }
  }
  return true;
}
function original(){
  if(version == 1){
      if(dx<0){
      dx = -2;
    }else{
      dx = 2;
    }
    if(dy<0){
      dy = -2;
    }else{
      dy = 2;
    }
  }
  else if(version == 2 || version == 3){
   if(dx<0){
      dx = -3;
    }else{
      dx = 3;
    }
    if(dy<0){
      dy = -3;
    }else{
      dy = 3;
    }
  }
}
function adagio(){  // 공 느려지게 하는 아이템
  if(version == 1){
    if(dx<0){
      dx = -1;
    }else{
      dx = 1;
    }
    if(dy<0){
      dy = -1;
    }else{
      dy = 1;
    }
  }
  else if(version == 2 || version == 3){
    if(dx<0){
      dx = -2;
    }else{
      dx = 2;
    }
    if(dy<0){
      dy = -2;
    }else{
      dy = 2;
    }
  }
    setTimeout(function (){   // 5초뒤 속도 원상복구
    original();
  },5000);
}

function double(){  // 두번째 공이 추가되는 아이템
  secondball=true;
  setTimeout(function (){   // 10초 뒤 사라짐
    secondball=false;
  },10000);
}

function drawball2(){   // 두번째 공
  context.beginPath();
  context.globalAlpha=0.4;
  context.arc(x2, y2, BALLRADIUS2, 0, 2.0 * Math.PI, true);
  context.fillStyle = "green";
  context.fill();
  context.closePath();
  context.globalAlpha=1;
}

function drawPaddle2(){   // 두번째 공을 받는 패드
  paddleX2 = x2 - paddleWidth/2;
  context.globalAlpha=0.4;
  context.drawImage(padimg, paddleX2, CANVASHEIGHT-paddleHeight, paddleWidth, paddleHeight);
  context.globalAlpha=1;
}

function largament(){   // 패드의 크기가 커지는 아이템
  var savepawidth=paddleWidth;
  paddleWidth*=2;
  setTimeout(function (){
    paddleWidth=savepawidth;
  },5000);
}

function help(){   // 패드를 직접 움직여주는 아이템
  document.removeEventListener("mousemove", mouseMoveHandler, false);
  var helppaddle=setInterval(helpInterval,10);
  setTimeout(function (){   // 7초 뒤 다시 조종해야함
    document.addEventListener("mousemove", mouseMoveHandler, false);
    clearInterval(helppaddle);
  },7000);
}
function helpInterval(){  // 패드의 위치 조정
  paddleX=x - paddleWidth/2;
}

function allegro(){   // 속도가 빨라지는 아이템
  if(dx<0){
    dx = -4;
  }else{
    dx = 4;
  }
  if(dy<0){
    dy = -4;
  }else{
    dy = 4;
  }
  setTimeout(function (){   // 5초뒤 속도가 원상복구
    original();
  },5000);
}

function staccato(){  // 공이 깜빡이는 아이템
  var on;
  var off=setInterval(function(){ // 공 안보이게
    ballvisible=false;
  },1500);
  setTimeout(function (){ // 공 보이게
    on=setInterval(function(){
      ballvisible=true;
    },1500);
  },750);
  setTimeout(function(){  // 7초 뒤 원상복구
    clearInterval(off);
    clearInterval(on);
  },7000);
}