/*
 * 페이스북 공유기능 함수
 * 페이스북의 개발자센터에서 새로운 앱을 만들어야 사용할 수 있습니다.
 * -> https://developers.facebook.com/
 *
 */

function init_facebook(){
  window.fbAsyncInit = function() {
    FB.init({
      appId            : '161236511051720', // 앱 ID
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v2.11'            // SDK 버전
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
}

$("#shareFB").click(function(){
  msg = '';
  for(var i=0; i<values_number;i++){
    msg += values_label[i]+"의 영향을"+ (100-values_ratio[i]).toFixed(1) +"%";
    if(i < values_number-1){msg += ", ";}
  }
  msg += "받고 있습니다."
  FB.ui({
  method: 'share',
  display: 'popup',
  href: $(location).attr('href'),
  hashtag: '#Freethink_N-Values',
  quote: msg,
}, function(response){});
});
