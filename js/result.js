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

// 내부함수
function getQueryVariables(){
  var _vars = $(location).attr('search').substring(1).split("&");
  var _new = new Array()
  for(var i=0; i<_var.length;i++){
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
    grid[i] = [_x, _y, _w, _h];
    _y += dy;
  }
  return _grid
}
function canvasControl(){
  var back_args;
  var rtx, rty;
  for(var i=0; i<values_number; i++){
    back_args = bar_positions[i];
    back_args[2] = bar_full;
    ctx.fillStyle = '#000000';
    ctx.fillRect.apply(this, back_args);
    ctx.fillStyle = bar_colors[i];
    ctx.fillRect.apply(this, bar_positions[i]);
    ctx.font = '55px roboto';
    ctx.fillStyle = '#ffffff';
    rtx = bar_positions[i][0] + bar_positions[i][2];
    rty = bar_positions[i][1] + 55;
    if(values_ratio[i]){
      ctx.textAlign = 'left';
      ctx.fillText(values_ratio[i].toFixed(1) + "%", rtx, _y + 51);
    } else {
      ctx.textAlign = 'right';
      ctx.fillText(values_ratio[i].toFixed(1) + "%", rtx, _y + 51);
    }
  }
}

//외부함수
$("#result-box").ready(function(){canvasControl();})
