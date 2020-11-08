function remoteMission(type) {
  var startTime = new Date();
  switch(type){
    case 'PARSER_PACKAGE':
      var result = PARSER_PACKAGE(); break;
    case 'RECORDER_PACKAGE':
      var result = RECORDER_PACKAGE(); break;
    case 'REGENERATELOG':
      var result = REGENERATELOG(); break;
    case 'dailyGuruFocus':
      var result = dailyGuruFocus(); break;
    case 'dailyGuruFocusRecord':
      var result = dailyGuruFocusRecord(); break;
    case 'genCrossDateLog':
      var result = genCrossDateLog(); break;
    case 'fixMissingValueInSheet':
      var result = fixMissingValueInSheet(); break;
    default:
      var result = "Order Not Found"
  }
  var timePassed = millisToMinutesAndSeconds(new Date() - startTime)
  Logger.log(result + ' (' + timePassed + ')')
  LinePusher(result + '(' + timePassed + ')')
}


function LinePusher(message) {
  var CHANNEL_ACCESS_TOKEN = BOT_TOKEN;
  
  var url = 'https://api.line.me/v2/bot/message/push';
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to':  LINE_USER_ID,
      'messages': [{
        type:'text',
        text:message
      }]
    }),
  });  
}