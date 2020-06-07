function messageController(message){
  return render('view/message', {'message':message})
}

function indexController(type){
  Logger.log("Type = " + type)
  return render('view/index', {'type':type})
}

function loadStockList(){
  var html_page = HtmlService.createTemplateFromFile('view/stockList')
  html_page.noteObj = indexData()
  return html_page.evaluate().getContent();
}

function loadETFList(){
  var html_page = HtmlService.createTemplateFromFile('view/etfList')
  html_page.noteObj = etfIndexData()
  return html_page.evaluate().getContent();
}


function historyChartController(stockSymbol){
  var span = 180
  var data = weBullSingle(stockSymbol, span)
  data.stockSymbol = stockSymbol
  data.span = span
  Logger.log(data)
  return render('view/historyChart', data)
}

function historyETFChartController(etfSymbol){
  var data = weBullETFSingle(etfSymbol)
  data.stockSymbol = etfSymbol
  Logger.log(data)
  return render('view/historyETFChart', data)
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
  var targetLst = stockSymbols.split(',')
  var span = 180
  var data = {}
  data.multiStockData = weBullMultiple(targetLst, span)
  data.stockSymbols = stockSymbols
  data.no = targetLst.length
  data.span = span
  Logger.log(data)
  return render('view/compareChart', data)
}