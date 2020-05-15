function messageController(message){
  return render('view/message', {'message':message})
}

function indexController(){
  return render('view/index')
}

function loadStockList(){
  var html_page = HtmlService.createTemplateFromFile('view/stockList')
  html_page.noteObj = indexData()
  return html_page.evaluate().getContent();
}

function historyChartController(stockSymbol){
  var data = weBullSingle(stockSymbol)
  data.stockSymbol = stockSymbol
  Logger.log(data)
  return render('view/historyChart', data)
}

function unsubscribeController(email, hash){
  var Sheet = SpreadsheetApp.open(MAILFILE)
  var targetRow = onSearch(Sheet, searchString = hash, searchTargetCol = 2)
  if(targetRow){
    targetRow += 1
    Sheet.deleteRow(targetRow);
    return render('view/message', {'message':(email + " has been removed from email list!!")})
  }else{
    return render('view/message', {'message':"Can't find the email: " + email + " or your id is wrong!"})
  } 
}

// Not Finished
function historyCompareController(stockSymbols){
  var data = weBullMultiple(stockSymbols.split(','))
  //data.stockSymbols = stockSymbols
  Logger.log(data)
  return render('view/compareChart', {'data':data})
}