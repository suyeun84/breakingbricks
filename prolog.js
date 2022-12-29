var pronum=-1;
$(document).ready(function(){
	$("#probut").on("click",pronext);
	$("#proskipbut").on("click",proskip);
	pronext();
});

var protext=["천재라고 불리우던 음악가가 있었다. 그는 뛰어난 실력으로 많은 사람들의 주목을 받았다.",
"그러나 그도 슬럼프를 피할 수는 없었다. 수많은 존경의 목소리가 비난의 목소리로 바뀌었다.",
"그는 슬럼프를 반전시킬 악상을 떠올리기 위해 끊임없이 생각하며 잠에 드는데...",
"꿈에서 전설적인 음악가라 불리우던 당신이 나타나 이 음악가를 도와주기로 한다. 슬럼프에 빠진 음악가를 도울 수 있는 것은 당신밖에 없다! 위기를 극복할 수 있도록 도와주자!",
"-1"];

var text;
var textinterval;
var i;
function pronext(){
	$("#prolog").css("display","block");
	$("#probut").css("display","block");
	$("#proskip").css("display","block");
	pronum+=1;
	$("#textin").html("");
	text=protext[pronum];
	text=text.split("");	// text에 한문장을 한글자씩 쪼개서 넣음.
	i=0;
	if(pronum!=4){	// 이미지 및 텍스트 변경
		$("#proimg").attr("src","image/proimage"+pronum+".PNG");
		textinterval=setInterval(typing,30);
	}
	if(pronum==1){	// 2번째 장면에서 이미지에 텍스트 노출
		showcomment();
	}
	else if(pronum==2){
		$("#procomment").css("display","none");
	}
	else if(pronum==4){
		$("#prologcontent").css("display","none");
		$("#content").css("display","block");
	}
}

function showcomment(){	// 이미지에 댓글 효과
	$("#procomment").css("display","block");
	$("#com1").fadeIn(2000);
	$("#com2").fadeIn(4000);
	$("#com3").fadeIn(4500);
	$("#com4").fadeIn(6000);
	$("#com5").fadeIn(7000);
}

function typing(){	// 타이핑 되는듯한 효과
	if(i<text.length){
		$("#textin").append(text[i]);
		i++;
	}else{
		clearInterval(textinterval);
	}
}

function proskip(){
	$("#prologcontent").css("display","none");
	$("#content").css("display","block");
}