/*
 * 퀴즈 카드를 자동으로 채우는 함수들이 들어있는 자바스크립트 파일
 *
 * 주의: J쿼리와 ./data/questions.js를 이 파일보다 먼저 불러와야 한다.
 *
 * questions.js -> var questions
 *    questions[ix].question: 질문 내용
 *    questions[ix].effect[:]: 가치 점수 변동량
 */

// 초기화
var values_number = questions[0].effect.length;
var values = new Array(values_number);
var values_max = new Array(values_number);
init_values();
var question_index = 0;
var previous_answer = null;
init_question();

// 내부 함수
function init_values(){
  // values 초기화
  for(var i=0;i<values_number;i++){
    values[i]=values_max[i]=0;
    for(var j=0; j < questions.length; j++){
      values_max[i] += Math.abs(questions[j].effect[i]);
    }
  }
}
function init_question(){
  // 질문 초기화 -> 문서에 표시
  $("#question-number").html("질문 "+(question_index+1)+" /  "+ (questions.length));
  $("#question-text").html(questions[question_index].question);
  if(previous_answer==null){
    $("#back_button").addClass("disabled");
  }else{
    $("#back_button").removeClass("disabled");
  }
}
function calc_score(score, max) {
  return (100*(max+score)/(2*max)).toFixed(1);
}
function results(){
  var href = `../result/?a=${calc_score(values[0], values_max[0])}`;
  for(var i=1; i < values_number; i++) {
    href += "&" + String.fromCharCode(97 + i)
            + `=${calc_score(values[i], values_max[i])}`;
  }
  location.href = href;
}

// 외부 함수
function next_question(ratio){
  for(var i=0; i < values_number; i++){
    values[i] += ratio*questions[question_index].effect[i];
  }
  question_index++;
  previous_answer = ratio;
  if(question_index < questions.length){
    init_question();
  } else {
    results();
  }
}
function prev_question(){
  if(previous_answer == null){
    return;
  }
  question_index--;
  for(var i=0; i < values_number; i++) {
    values[i] -= previous_answer * questions[question_index].effect[i];
  }
  revious_answer = null;
  init_question();
}
