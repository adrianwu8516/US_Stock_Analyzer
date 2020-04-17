function messageController(message){
  var html_page = HtmlService.createTemplateFromFile('viewMessage')
  html_page.message = message
  return html_page
        .evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setTitle("Error!!"); 
}

function historyChartController(symbol){
  var html_page = HtmlService.createTemplateFromFile('viewHistoryChart')
  html_page.symbol = symbol
  var Data = weBullSingle(symbol)
  html_page.date = Data[0]
  html_page.price = Data[1]
  html_page.priceHigh = Data[2]
  html_page.priceMid = Data[3]
  html_page.priceLow = Data[4]
  return html_page
        .evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setTitle(symbol + "-Chart"); 
}

function unsubscribeController(email){
  var Sheet = SpreadsheetApp.open(MAILFILE)
  var targetRow = onSearch(Sheet, searchString = email, searchTargetCol = 1)
  var html_page = HtmlService.createTemplateFromFile('viewMessage')
  if(targetRow){
    targetRow += 1
    Sheet.deleteRow(targetRow);
    html_page.message = (email + " has been removed from email list!!")
    return html_page
           .evaluate()
           .addMetaTag('viewport', 'width=device-width, initial-scale=1')
           .setTitle("You have successfully unsubscribed!"); 
  }else{
    html_page.message = ("Can't find the email: " + email)
    return html_page
           .evaluate()
           .addMetaTag('viewport', 'width=device-width, initial-scale=1')
           .setTitle("Oh no, we found problem here!"); 
  } 
}
  
function historyCompareController(symbols){
  var html_page = HtmlService.createTemplateFromFile('historyChart')
  html_page.data = weBullMultiple(symbol)  
  return html_page
        .evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setTitle(symbols + "-Chart"); 
}