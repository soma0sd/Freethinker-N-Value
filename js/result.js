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
var bar_positions = null;
var bar_start     = canvas_width * 0.05;
var bar_full      = canvas_width * 0.9;
var bar_text_size = 0;

var authToken;

init_FB();
canvasControl();

$("#meta-og-image").attr("content", canvas.toDataURL());
$("#meta-og-title").attr("content", "자유사상 가치관 테스트");
$("#meta-og-url").attr("content", $(location).attr('href'));

// 내부함수
function getQueryVariables(){
  var _vars = $(location).attr('search').substring(1).split("&");
  var _new = new Array()
  for(var i=0; i<_vars.length;i++){
    _new[i] = 100 - _vars[i].split('=')[1];
  }
  return _new;
}
function getBarXYWH(){
  var _grid = new Array();
  var _dy = canvas_height / values_number; // 바 위치
  var _x  = bar_start;                     // 바 x 시작점 (고정)
  var _y  = _dy * 0.5;                     // 바 y 시작점 (증가)
  var _h  = _dy * 0.4;                     // 바 두께
  var _w  = 0;
  bar_text_size = _dy * 0.3;
  for(var i=0; i<values_number; i++){
    _w = values_ratio[i] * bar_full / 100
    _grid[i] = [_x, _y, _w, _h];
    _y += _dy;
  }
  return _grid
}
function canvasControl(){
  var rtx, rty;
  bar_positions = getBarXYWH();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(var i=0; i<values_number; i++){
    arg = bar_positions[i];
    ctx.shadowColor = "#676767";
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 7;
    ctx.fillStyle = '#000000';
    ctx.fillRect(arg[0], arg[1], bar_full, arg[3]);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = bar_colors[i];
    ctx.fillRect(arg[0], arg[1], arg[2], arg[3]);
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.font = "bold "+bar_text_size+"px roboto";
    ctx.fillStyle = '#ffffff';
    rtx = arg[0] + arg[2];
    rty = arg[1] + arg[3]*0.5 + bar_text_size*0.5;
      if(values_ratio[i] < 80){
      ctx.textAlign = 'left';
      rtx += bar_full*0.01;
    } else {
      ctx.textAlign = 'right';
      rtx -= bar_full*0.01;
    }
    ctx.fillText(new String(values_ratio[i]) + "%", rtx, rty);
    ctx.fillStyle = bar_colors[i];
    ctx.textAlign = 'left';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText(values_label[i],arg[0],arg[1]-arg[3]*0.09);
  }
}
function init_FB(){
  // window.fbAsyncInit = function() {
  //   FB.init({
  //     appId            : '161236511051720',
  //     autoLogAppEvents : true,
  //     xfbml            : true,
  //     version          : 'v2.11'
  //   });
  // };
  if ( XMLHttpRequest.prototype.sendAsBinary === undefined ) {
      XMLHttpRequest.prototype.sendAsBinary = function(string) {
          var bytes = Array.prototype.map.call(string, function(c) {
              return c.charCodeAt(0) & 0xff;
          });
          this.send(new Uint8Array(bytes).buffer);
      };
  };
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  window.fbAsyncInit = function() {
      FB.init({
        appId  : "404477149649756",
        status : true,
        cookie : true,
        xfbml  : true  // parse XFBML
      });
  };
}
function postImageToFacebook( authToken, filename, mimeType, imageData, message ){
    // this is the multipart/form-data boundary we'll use
    var boundary = '----ThisIsTheBoundary1234567890';
    // let's encode our image file, which is contained in the var
    var formData = '--' + boundary + '\r\n'
    formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
    formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
    for ( var i = 0; i < imageData.length; ++i )
    {
        formData += String.fromCharCode( imageData[ i ] & 0xff );
    }
    formData += '\r\n';
    formData += '--' + boundary + '\r\n';
    formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
    formData += message + '\r\n'
    formData += '--' + boundary + '--\r\n';

    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true );
    xhr.onload = xhr.onerror = function() {
        console.log( xhr.responseText );
    };
    xhr.setRequestHeader( "Content-Type", "multipart/form-data; boundary=" + boundary );
    xhr.sendAsBinary( formData );
};

//외부함수
function postCanvasToFacebook() {
	var data = canvas.toDataURL("image/png");
	var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
	var decodedPng = Base64Binary.decode(encodedPng);
	FB.getLoginStatus(function(response) {
	  if (response.status === "connected") {
		postImageToFacebook(response.authResponse.accessToken, "heroesgenerator", "image/png", decodedPng, "www.heroesgenerator.com");
	  } else if (response.status === "not_authorized") {
		 FB.login(function(response) {
			postImageToFacebook(response.authResponse.accessToken, "heroesgenerator", "image/png", decodedPng, "www.heroesgenerator.com");
		 }, {scope: "publish_actions"});
	  } else {
		 FB.login(function(response)  {
			postImageToFacebook(response.authResponse.accessToken, "heroesgenerator", "image/png", decodedPng, "www.heroesgenerator.com");
		 }, {scope: "publish_actions"});
	  }
	 });
};
$("#result-box").ready(function(){
  canvasControl();
})
$("#shareFB").click(function(){
  postCanvasToFacebook();
  // var openNewWindow = window.open("about:blank");
  // openNewWindow.location.href = "https://www.facebook.com/sharer/sharer.php?u="
  //                 + $(location).attr('href');
});
