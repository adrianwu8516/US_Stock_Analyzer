function weBullSingle(stockSymbol, span=20) {
  var cacheName = stockSymbol + '-history'
  var stockHistoryData = CACHE.get(cacheName);
  if(!stockHistoryData){
    var file = DriveApp.getFilesByName(stockSymbol).next();
    var Sheet = SpreadsheetApp.open(file);
    var dateLst = [], priceLst = [], pettmLst = [], priceHighLst  = [], priceMidLst = [], priceLowLst = []
    Sheet.getSheetValues(2, 1, span, 1).forEach(element => dateLst.push(element[0]))
    Sheet.getSheetValues(2, 5, span, 1).forEach(element => priceLst.push(parseFloat(element[0])||0))
    Sheet.getSheetValues(2, 11, span, 1).forEach(element => priceHighLst.push(parseFloat(element[0])||0))
    Sheet.getSheetValues(2, 12, span, 1).forEach(element => priceMidLst.push(parseFloat(element[0])||0))
    Sheet.getSheetValues(2, 13, span, 1).forEach(element => priceLowLst.push(parseFloat(element[0])||0))
    Sheet.getSheetValues(2, 8, span, 1).forEach(element => pettmLst.push(parseFloat(element[0])||0))
    var stockHistoryData = {
      'date': dateLst.reverse(), 'price': priceLst.reverse(), 'priceHigh': priceHighLst.reverse(), 
      'priceMid': priceMidLst.reverse(), 'priceLow': priceLowLst.reverse(),'pettm': pettmLst.reverse(), 
      'tickerRT': Sheet.getSheetValues(2, 17, 1, 1)[0], 
      'rating': Sheet.getSheetValues(2, 18, 1, 1)[0], 
      'targetPrice': Sheet.getSheetValues(2, 19, 1, 1)[0], 
      'forecastEps': Sheet.getSheetValues(2, 20, 1, 1)[0]
    }
    CACHE.put(cacheName, JSON.stringify(stockHistoryData), CACHELIFETIME)
  }else{
    stockHistoryData = JSON.parse(stockHistoryData)
  }
  return stockHistoryData
}

function weBullMultiple(symbolLst, span=20) {
  var dataPack = {}
  for(var i in symbolLst){
    var stockSymbol = symbolLst[i]
    dataPack[stockSymbol] = weBullSingle(stockSymbol, span)
  }
  return dataPack;
}

function indexData(){
  var cacheName = 'index'
  var indexData = CACHE.get(cacheName);
  if(!indexData){
    var indexData = JSON.parse(readLog("LoggerMailer.txt"))
    CACHE.put(cacheName, JSON.stringify(indexData), CACHELIFETIME)
  }else{
    indexData = JSON.parse(indexData)
  }  
  return indexData
}

function cbsFinancialRecord(stockSymbol){
  // Unfinished Don't know what to do with financial reports
  var stockSymbol = 'zm'
  var file = DriveApp.getFileById('1B8Xv88I9eWcFc21dE4tRpV3m-Y8n4rsWJ78JDIJc63g')
  var Sheet = SpreadsheetApp.open(file);
  var today = new Date()
  var index = (today.getFullYear() - 1) + '-' + stockSymbol
  var targetRow = onSearch(Sheet, searchString = index, searchTargetCol = 1)
  if (!targetRow) {
    index = (today.getFullYear() - 2) + '-' + stockSymbol
    targetRow = onSearch(Sheet, searchString = index, searchTargetCol = 1)
  }
  if(targetRow){
    targetRow += 1
    var finList = Sheet.getSheetValues(targetRow, 1, 1, 34)[0]
  }else{
    
  }
}
