function weBullSingle(stockSymbol, span=20) {
  var cacheName = stockSymbol + '-history'
  var stockHistoryData = CACHE.get(cacheName);
  if(!stockHistoryData){
    var file = DriveApp.getFilesByName(stockSymbol).next();
    var Sheet = SpreadsheetApp.open(file);
    var dateLst = [], priceLst = [], pettmLst = [], priceHighLst  = [], priceMidLst = [], priceLowLst = []
    Sheet.getSheetValues(2, 1, span, 1).forEach(element => dateLst.unshift(element[0]))
    Sheet.getSheetValues(2, 5, span, 1).forEach(element => priceLst.unshift(parseFloat(element[0])||0))
    Sheet.getSheetValues(2, 11, span, 1).forEach(element => priceHighLst.unshift(parseFloat(element[0])||0))
    Sheet.getSheetValues(2, 12, span, 1).forEach(element => priceMidLst.unshift(parseFloat(element[0])||0))
    Sheet.getSheetValues(2, 13, span, 1).forEach(element => priceLowLst.unshift(parseFloat(element[0])||0))
    Sheet.getSheetValues(2, 8, span, 1).forEach(element => pettmLst.unshift(parseFloat(element[0])||0))
    var tickerObj = {
      "open":[], "high":[], "close":[], "low":[], "changeRatio":[],
      "volume":[], "avgVol10D":[], "avgVol3M":[],
      "fiftyTwoWkHigh":[], "fiftyTwoWkLow":[],
      "turnoverRate":[], "vibrateRatio":[],
      "pe":[], "forwardPe":[], "indicatedPe":[], "peTtm":[],
      "eps":[], "epsTtm":[],
      "bps":[], "pb":[], "ps":[],
      "yield":[]
    }
    
    var ratingObj = {
      "ratingAnalysisTotals":[], "sell":[], "underPerform":[], "hold":[], "buy":[], "strongBuy":[]
    }
    
    var targetPriceObj = {
      "current" :[], "high" :[], "low":[], "mean":[]
    } 
    
    Sheet.getSheetValues(2, 17, span, 1).forEach(element => tickerObj = handleMultipleObj(element[0], tickerObj))
    Sheet.getSheetValues(2, 18, span, 1).forEach(element => ratingObj = handleMultipleObj(element[0], ratingObj))
    Sheet.getSheetValues(2, 19, span, 1).forEach(element => targetPriceObj = handleMultipleObj(element[0], targetPriceObj))

    var stockHistoryData = {
      'date': dateLst, 
      'price': priceLst, 'priceHigh': priceHighLst, 'priceMid': priceMidLst, 'priceLow': priceLowLst,'pettm': pettmLst, 
      'tickerRT': Sheet.getSheetValues(2, 17, 1, 1)[0], 
      'rating': Sheet.getSheetValues(2, 18, 1, 1)[0], 
      'targetPrice': Sheet.getSheetValues(2, 19, 1, 1)[0], 
      'forecastEps': Sheet.getSheetValues(2, 20, 1, 1)[0]
    }
    stockHistoryData = Object.assign(stockHistoryData, tickerObj, ratingObj, targetPriceObj);
    CACHE.put(cacheName, JSON.stringify(stockHistoryData), CACHELIFETIME)
  }else{
    stockHistoryData = JSON.parse(stockHistoryData)
    
  }
  Logger.log(stockHistoryData)
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

function etfIndexData(){
  var cacheName = 'etfIndex'
  var etfIndexData = CACHE.get(cacheName);
  if(!etfIndexData){
    var etfIndexData = JSON.parse(readLog("ETFIndex.txt"))
    CACHE.put(cacheName, JSON.stringify(etfIndexData), CACHELIFETIME)
  }else{
    etfIndexData = JSON.parse(etfIndexData)
  }  
  Logger.log(etfIndexData)
  return etfIndexData
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

function handleMultipleObj(element, targetObj){
    var targetKeys = Object.keys(targetObj)
    if(!element){
      for(no in targetKeys){
        (targetObj[targetKeys[no]]).unshift(0)
      }
    }else{
      var elementObj = JSON.parse(element)
      var elementKeys = Object.keys(elementObj)
      for(no in elementKeys){
        if(targetKeys.includes(elementKeys[no])){
          targetObj[elementKeys[no]].unshift(elementObj[elementKeys[no]])
        }else if(elementKeys[no] == 'ratingSpread'){
          var spreadObj = elementObj.ratingSpread
          var spreadKeys = Object.keys(spreadObj)
          for(spreadNo in spreadKeys){
            (targetObj[spreadKeys[spreadNo]]).unshift(spreadObj[spreadKeys[spreadNo]])
          }
        }
      }
    }
    return targetObj
  }

// Testing fetch with new data structure
function modelTest(stockSymbol='MA', span=20){
  var file = DriveApp.getFilesByName(stockSymbol).next();
  var Sheet = SpreadsheetApp.open(file);

  var tickerObj = {
    "open":[], "high":[], "close":[], "low":[], "changeRatio":[],
    "volume":[], "avgVol10D":[], "avgVol3M":[],
    "fiftyTwoWkHigh":[], "fiftyTwoWkLow":[],
    "turnoverRate":[], "vibrateRatio":[],
    "pe":[], "forwardPe":[], "indicatedPe":[], "peTtm":[],
    "eps":[], "epsTtm":[],
    "bps":[], "pb":[], "ps":[],
    "yield":[]
  }
  
  var ratingObj = {
    "ratingAnalysisTotals":[], "sell":[], "underPerform":[], "hold":[], "buy":[], "strongBuy":[]
  }
  
  var targetPriceObj = {
    "current" :[], "high" :[], "low":[], "mean":[]
  } 
  
  Sheet.getSheetValues(2, 17, span, 1).forEach(element => tickerObj = handleMultipleObj(element[0], tickerObj))
  Sheet.getSheetValues(2, 18, span, 1).forEach(element => ratingObj = handleMultipleObj(element[0], ratingObj))
  Sheet.getSheetValues(2, 19, span, 1).forEach(element => targetPriceObj = handleMultipleObj(element[0], targetPriceObj))
  
  Logger.log(tickerObj)
  Logger.log(ratingObj)
  Logger.log(targetPriceObj)
}
