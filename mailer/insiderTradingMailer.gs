function insiderTradingMailer(){
  // Check if market closed
  if(!checkifClosed()) return;
  
  let today = new Date();
  let todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()-2).padStart(2, '0') + '日';
  
  const insiderSheet = SpreadsheetApp.openById('1zraRLEJ-dfmBra21ZEizoXZIS6slKEHmj5uj9Xw-xhc')
  let df = insiderSheet.getRange('A2:J1000').getValues()
  let mailElement = {}
  
  for(let i in df){
    if(todayStr == df[i][1]){
      let symbol = df[i][2]
      if(!(Object.keys(mailElement).includes(symbol))){
         mailElement[symbol] = [df[i].slice(3,10)]
      }else{
        let lst = df[i].slice(3,10)
        mailElement[symbol].push(lst)
      }
    }
  }
  
  if(mailElement != {}){
    let title = todayStr + '：內部人交易追蹤'
    let email = 'adrianwu8516@gmail.com'
    let htmlTemp = HtmlService.createTemplateFromFile('view/mailer/dailyInsider')
    htmlTemp.noteObj = mailElement
    
    let htmlBody = htmlTemp.evaluate().getContent();
    Logger.log("Mail to: " + email)
    MailApp.sendEmail(email, title, '', {htmlBody:htmlBody})
  }
}