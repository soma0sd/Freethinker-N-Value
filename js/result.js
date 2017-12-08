/*
 * 결과 페이지의 캔버스를 제어하고,
 * 공유버튼을 컨트롤합니다.
 */
var values_label = result.values;
var values_number = result.values.length;
var values_ratio = getQueryVariables();

var canvas = $("#result-box")[0];
var canvas_height =  600;  // canvas.height()
var canvas_width  = 1200;  // canvas.width()
var ctx           = canvas.getContext('2d');

var bar_colors    = result.barcolors;
var bar_positions = getBarXYWH();
var bar_full      = canvas_width * 0.8;
var bar_text_size = 70;

// 내부함수
function getQueryVariables(){
  var _vars = $(location).attr('search').substring(1).split("&");
  var _new = new Array()
  for(var i=0; i<_vars.length;i++){
    _new[i] = _vars[i].split('=')[1];
  }
  return _new;
}
function getBarXYWH(){
  var _grid = new Array();
  var _dy = canvas_height / values_number; // 바 위치
  var _x  = canvas_width * 0.1;            // 바 x 시작점 (고정)
  var _y  = _dy * 0.5;                     // 바 y 시작점 (증가)
  var _h  = _dy * 0.4;                     // 바 두께
  var _w  = 0;
  for(var i=0; i<values_number; i++){
    _w = values_ratio[i] * bar_full / 100
    _grid[i] = [_x, _y, _w, _h];
    _y += _dy;
  }
  return _grid
}
function canvasControl(){
  var rtx, rty;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(var i=0; i<values_number; i++){
    arg = bar_positions[i];
    ctx.fillStyle = '#000000';
    ctx.fillRect(arg[0], arg[1], bar_full, arg[3]);
    ctx.fillStyle = bar_colors[i];
    ctx.fillRect(arg[0], arg[1], arg[2], arg[3]);
    ctx.font = "bold "+bar_text_size+"px roboto";
    ctx.fillStyle = '#ffffff';
    rtx = bar_positions[i][0] + bar_positions[i][2];
    rty = bar_positions[i][1] + bar_text_size;
      if(values_ratio[i] < 80){
      ctx.textAlign = 'left';
      rtx += bar_full*0.01;
    } else {
      ctx.textAlign = 'right';
      rtx -= bar_full*0.01;
    }
    ctx.fillText(new String(values_ratio[i]) + "%", rtx, rty);
  }
}

//외부함수
$("#result-box").ready(function(){
  canvasControl();
})
