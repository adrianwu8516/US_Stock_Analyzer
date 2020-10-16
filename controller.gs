function messageController(message){
  return render('view/message', {'message':message})
}

function indexController(type){
  return render('view/index/index', {'type':type})
}

function loadStockList(read=true){
  var html_file = readLog("static_stock_list.txt")
  if(html_file){
    if(read) return html_file
    var html_page = HtmlService.createTemplateFromFile('view/index/stockList')
    html_page.noteObj = JSON.parse(readLog("LoggerStockInfo.txt"))
    html_page.updated_at = logUpdatedAt("LoggerStockInfo.txt")
    html_file = html_page.evaluate().getContent();
    saveLog(html_file, "static_stock_list.txt")
    return html_file
  }else{
    Logger.log("Test Stock Log File Missed!")
  }
}

function loadStockListLegacy(read=true){
  var html_file = readLog("static_stockOld_list.txt")
  if(html_file){
    if(read) return html_file
    var html_page = HtmlService.createTemplateFromFile('view/index/stockList')
    html_page.noteObj = indexData()
    html_file = html_page.evaluate().getContent();
    saveLog(html_file, "static_stockOld_list.txt")
    return html_file
  }else{
    Logger.log("Stock Log File Missed!")
  }
}

function loadETFList(read=true){
  var html_file = readLog("static_etf_list.txt")
  if(html_file){
    if(read) return html_file
    var html_page = HtmlService.createTemplateFromFile('view/index/etfList')
    html_page.noteObj = etfIndexData()
    html_file = html_page.evaluate().getContent();
    saveLog(html_file, "static_etf_list.txt")
    return html_file
  }else{
    Logger.log("ETF Log File Missed!")
  }
}

function loadCompareList(read=true){
  var html_file = readLog("static_compare_list.txt")
  if(html_file){
    if(read) return html_file
    var html_page = HtmlService.createTemplateFromFile('view/index/compareList')
    html_file = html_page.evaluate().getContent();
    saveLog(html_file, "static_compare_list.txt")
    return html_file
  }else{
    Logger.log("Compare Log File Missed!")
  }
}

function loadSelectorList(read=true){
  var html_file = readLog("static_selector_list.txt")
  if(html_file){
    if(read) return html_file
    var html_page = HtmlService.createTemplateFromFile('view/index/stockList')
    html_page.noteObj = selectedIndexData()
    html_page.updated_at = logUpdatedAt("LoggerStockInfo.txt")
    html_file = html_page.evaluate().getContent();
    saveLog(html_file, "static_selector_list.txt")
    return html_file
  }else{
    Logger.log("Selector Log File Missed!")
  }
}

function loadMacroList(read=true, span=120){
  var html_file = readLog("static_macro_list.txt")
  if(html_file){
    if(read) return html_file
    var html_page = HtmlService.createTemplateFromFile('view/index/macroList')
    html_page.macroJSON = macroData(span)
    html_page.macroFED = macroFEDQuarterlyData(span=240)
    html_page.macroFEDMonthly = macroFEDMonthlyData(span=240)
    html_page.updated_at = logUpdatedAt("MacroData")
    html_page.span = 240
    html_file = html_page.evaluate().getContent();
    saveLog(html_file, "static_macro_list.txt")
    return html_file
  }else{
    Logger.log("Macro Log File Missed!")
  }
}

function loadSuperInvestorList(read=true){
  var html_file = readLog("static_superinvestor_list.txt")
  if(html_file){
    if(read) return html_file
    var html_page = HtmlService.createTemplateFromFile('view/index/superInvestorList')
    html_page.superInvestorLst = superInvestorData()
    html_page.updated_at = logUpdatedAt("superInvestorData")
    html_file = html_page.evaluate().getContent();
    saveLog(html_file, "static_superinvestor_list.txt")
    return html_file
  }else{
    Logger.log("Super Investor Log File Missed!")
  }
}

function historyChartController(stockSymbol){
  var span = 180
  var data = weBullSingle(stockSymbol, span)
  data.stockSymbol = stockSymbol
  data.span = span
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

function historyCompareController(stockSymbols){
  var targetLst = stockSymbols.split(',')
  var span = 180
  var data = {}
  data.multiStockData = weBullMultiple(targetLst, span)
  data.stockSymbols = stockSymbols
  data.no = targetLst.length
  data.span = span
  return render('view/compareChart', data)
}

function corrLabController(stockSymbols){
  var targetLst = stockSymbols.split(',')
  var span = 180
  var data = {}
  data.multiStockData = weBullMultiple(targetLst, span)
  data.stockSymbols = stockSymbols
  data.no = targetLst.length
  data.span = span
  return render('view/corrLab', data)
}