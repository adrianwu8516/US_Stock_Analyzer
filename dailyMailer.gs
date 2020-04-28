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

function mailer(){
  // Check if market closed
  if(!checkifClosed()) return;  
  
  var noteObj = JSON.parse(readLog("LoggerMailer.txt"))
  CACHE.put('index', JSON.stringify(noteObj), CACHELIFETIME)
  
  // Send Email Template
  var title = "美股分析早報";
  var htmlTemp = HtmlService.createTemplateFromFile('viewDailyReport')
  htmlTemp.noteObj = noteObj
  
  //var emailList = fetchEmailList()
  var emailList = ['adrianwu8516@gmail.com']
  
  Logger.log("Mail to: " + String(emailList))
  for(i in emailList){
    var email = emailList[i]
    htmlTemp.hash = email.hash()
    htmlTemp.email = email
    var htmlBody = htmlTemp.evaluate().getContent();
    MailApp.sendEmail(email, title, '', {htmlBody:htmlBody})
  } 
}