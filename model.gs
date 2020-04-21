function weBullSingle(symbol, span=20) {
  var cacheName = symbol + '-history'
  var stockHistoryData = CACHE.get(cacheName);
  if(!stockHistoryData){
    var file = DriveApp.getFilesByName(symbol).next();
    var Sheet = SpreadsheetApp.open(file);
    var dateLst = [], priceLst = [], priceHighLst  = [], priceMidLst = [], priceLowLst = []
    Sheet.getSheetValues(2, 1, span, 1).forEach(element => dateLst.push(element[0]))
    Sheet.getSheetValues(2, 5, span, 1).forEach(element => priceLst.push(parseFloat(element[0])||0))
    Sheet.getSheetValues(2, 11, span, 1).forEach(element => priceHighLst.push(parseFloat(element[0])||0))
    Sheet.getSheetValues(2, 12, span, 1).forEach(element => priceMidLst.push(parseFloat(element[0])||0))
    Sheet.getSheetValues(2, 13, span, 1).forEach(element => priceLowLst.push(parseFloat(element[0])||0))
    var stockHistoryData = [dateLst.reverse(), priceLst.reverse(), priceHighLst.reverse(), priceMidLst.reverse(), priceLowLst.reverse()]
    CACHE.put(cacheName, JSON.stringify(stockHistoryData), CACHELIFETIME)
  }else{
    stockHistoryData = JSON.parse(stockHistoryData)
  }
  return stockHistoryData
}

function weBullMultiple(symbolLst) {
  return;
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

function cbsFinancialRecord(symbol){
  // Unfinished Don't know what to do with financial reports
  var symbol = 'zm'
  var file = DriveApp.getFileById('1B8Xv88I9eWcFc21dE4tRpV3m-Y8n4rsWJ78JDIJc63g')
  var Sheet = SpreadsheetApp.open(file);
  var today = new Date()
  var index = (today.getFullYear() - 1) + '-' + symbol
  var targetRow = onSearch(Sheet, searchString = index, searchTargetCol = 1)
  if (!targetRow) {
    index = (today.getFullYear() - 2) + '-' + symbol
    targetRow = onSearch(Sheet, searchString = index, searchTargetCol = 1)
  }
  if(targetRow){
    targetRow += 1
    var finList = Sheet.getSheetValues(targetRow, 1, 1, 34)[0]
  }else{
    
  }
}
