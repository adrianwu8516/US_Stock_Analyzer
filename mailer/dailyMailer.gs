// Implementing
function getTrackingGIF(email='adrian@dcard.cc', subject='美股分析早報') {
  var imgURL = "https://ssl.google-analytics.com/collect?"
    + "v=1&t=event"
    + "&tid=" + GAACCOUNT
    + "&z="   + Math.round((new Date()).getTime()/1000).toString()
    + "&cid=" + Utilities.getUuid()
    + "&ec=" + encodeURIComponent("Email Open")
    + "&ea=" + encodeURIComponent(subject.replace(/'/g, ""))
    + "&el=" + encodeURIComponent(email);
  Logger.log("<img src='" + imgURL + "' width='1' height='1'/>")
  return "<img src='" + imgURL + "' width='1' height='1'/>";
}


function fetchEmailList(){
  var Sheet = SpreadsheetApp.open(MAILFILE)
  var emailList = Sheet.getSheetValues(2, 2, Sheet.getLastRow()-1, 1)
  emailList = emailList.toString().split(',')
  emailList = [...new Set(emailList)]; 
  return emailList
}

function personalContent(email, noteObj){
  
  var title = "美股分析早報";
  var htmlTemp = HtmlService.createTemplateFromFile('view/dailyReport')
  var targetLst = ['EC', 'Internet', 'Internet-China', 'Streaming', 'SNS', 'Airlines', 'Traveling', 'Energy', 'Hardware', 'IC']
  
  var personalOutput = {}
  for(i in targetLst){
    var catName = targetLst[i]
    personalOutput[catName] = noteObj[catName]
  }
  
  htmlTemp.noteObj = personalOutput
  htmlTemp.hash = email.hash()
  htmlTemp.email = email
  var htmlBody = htmlTemp.evaluate().getContent();
  
  Logger.log("Mail to: " + email)
  MailApp.sendEmail(email, title, '', {htmlBody:htmlBody})
}

function mailer(){
  // Check if market closed
  if(!checkifClosed()) return;  
  
  var noteObj = JSON.parse(readLog("LoggerMailer.txt"))
  CACHE.put('index', JSON.stringify(noteObj), CACHELIFETIME)
  
  //var emailList = fetchEmailList()
  var emailList = ['adrianwu8516@gmail.com']
  
  // Send Email Template
  for(i in emailList){
    var email = emailList[i]
    personalContent(email, noteObj)
  } 
}