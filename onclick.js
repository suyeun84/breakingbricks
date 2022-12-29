window.onload = function()
{
    var startgame = document.getElementById('startgame');
    startgame.onclick = opengame;

    var info = document.getElementById('inform');
    info.onclick = openinfo;

    var score = document.getElementById('score');
    score.onclick = openscore;

    var setting = document.getElementById('setup');
    setting.onclick = opensetting;

    var endgame = document.getElementById('endgame');
    endgame.onclick = close_window;

    var note = document.getElementById('note');
    note.onclick = tonote;

    var note1 = document.getElementById('note1');
    note1.onclick = tonote1;
}