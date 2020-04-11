function doGet(e){
  Logger.log(e.queryString)
  if(e.queryString !==''){  
    switch(e.parameter.mode){
      case 'historyData': 
        return e.parameter.symbol? historyChartGenerator(e.parameter.symbol) : errorMessageGenerator("Chart Not Found!!")
      case 'historyCompare': 
        Logger.log(e.parameter.symbols)
        return e.parameter.symbols? historyCompareGenerator(e.parameter.symbols) : errorMessageGenerator("Chart Not Found!!")
      default:
        return errorMessageGenerator("404 Page Not Found!!")
    }
  }else{
    return errorMessageGenerator("404 Page Not Found!!")
  }
}

function errorMessageGenerator(message){
  var html_page = HtmlService.createTemplateFromFile('errorMessage')
  html_page.message = message
  Logger.log(message)
  return html_page
        .evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setTitle("Error!!"); 
}

function historyChartGenerator(symbol){
  var html_page = HtmlService
        .createTemplateFromFile('historyChart')
        .evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setTitle(symbol + "-Chart"); 
  return html_page
}
  
function historyCompareGenerator(symbol){
  var html_page = HtmlService
        .createTemplateFromFile('historyChart')
        .evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setTitle(symbol + "-Chart"); 
  return html_page
}