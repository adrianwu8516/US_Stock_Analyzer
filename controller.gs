function errorMessageController(message){
  var html_page = HtmlService.createTemplateFromFile('errorMessage')
  html_page.message = message
  return html_page
        .evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setTitle("Error!!"); 
}

function historyChartController(symbol){
  var html_page = HtmlService.createTemplateFromFile('historyChart')
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
  
function historyCompareController(symbols){
  var html_page = HtmlService.createTemplateFromFile('historyChart')
  html_page.data = weBullMultiple(symbol)  
  return html_page
        .evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setTitle(symbols + "-Chart"); 
}