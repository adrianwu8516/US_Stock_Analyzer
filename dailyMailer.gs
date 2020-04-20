function fetchEmailList(){
  var Sheet = SpreadsheetApp.open(MAILFILE)
  var emailList = Sheet.getSheetValues(2, 2, Sheet.getLastRow()-1, 1)
  emailList = emailList.toString().split(',')
  return emailList
}

function mailer(){
  // Check if market closed
  //if(!checkifClosed()) return;  
  
  var noteObj = JSON.parse(readLog("LoggerMailer.txt"))
  
  // Send Email Template
  var title = "美股分析早報";
  var htmlTemp = HtmlService.createTemplateFromFile('viewDailyReport')
  htmlTemp.noteObj = noteObj
  
  //var emailList = fetchEmailList()
  var emailList = ['adrianwu8516@gmail.com']
  
  for(i in emailList){
    var email = emailList[i]
    htmlTemp.hash = email.hash()
    htmlTemp.email = email
    Logger.log(String(email.hash()))
    var htmlBody = htmlTemp.evaluate().getContent();
    //MailApp.sendEmail(email, title, '', {htmlBody:htmlBody})
  } 
}