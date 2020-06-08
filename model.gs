function weBullSingle(stockSymbol, span) {
  var cacheName = stockSymbol + '-history'
  var stockHistoryData = CACHE.get(cacheName);
  if(!stockHistoryData){
    var file = DriveApp.getFilesByName(stockSymbol).next();
    var Sheet = SpreadsheetApp.open(file);
    var dateLst = [], open = [], high = [], low = [], close = [], pettmLst = [], analystHigh  = [], analystMid = [], analystLow = [], volume = []
    Sheet.getSheetValues(2, 1, span, 1).forEach(element => dateLst.unshift(element[0]))
    Sheet.getSheetValues(2, 23, span, 1).forEach(element => open.unshift(parseFloat(element[0])||null))
    Sheet.getSheetValues(2, 21, span, 1).forEach(element => high.unshift(parseFloat(element[0])||null))
    Sheet.getSheetValues(2, 22, span, 1).forEach(element => low.unshift(parseFloat(element[0])||null))
    Sheet.getSheetValues(2, 5, span, 1).forEach(element => close.unshift(parseFloat(element[0])||null))
    Sheet.getSheetValues(2, 11, span, 1).forEach(element => analystHigh.unshift(parseFloat(element[0])||null))
    Sheet.getSheetValues(2, 12, span, 1).forEach(element => analystMid.unshift(parseFloat(element[0])||null))
    Sheet.getSheetValues(2, 13, span, 1).forEach(element => analystLow.unshift(parseFloat(element[0])||null))
    Sheet.getSheetValues(2, 8, span, 1).forEach(element => pettmLst.unshift(parseFloat(element[0])||null))
    Sheet.getSheetValues(2, 24, span, 1).forEach(element => volume.unshift(parseFloat(element[0])||null))
    var tickerObj = {
      "changeRatio":[], "avgVol10D":[], "avgVol3M":[],
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
//    
//    var targetPriceObj = {
//      "current" :[], "high" :[], "low":[], "mean":[]
//    } 
    
    Sheet.getSheetValues(2, 17, span, 1).forEach(element => tickerObj = handleTimeSeriesObj(element[0], tickerObj))
    Sheet.getSheetValues(2, 18, span, 1).forEach(element => ratingObj = handleTimeSeriesObj(element[0], ratingObj))
//    Sheet.getSheetValues(2, 19, span, 1).forEach(element => targetPriceObj = handleMultipleObj(element[0], targetPriceObj))

    var stockHistoryData = {
      'date': dateLst, 
      'open': open, 'high': high, 'low': low, 'close': close,'pettm': pettmLst, 
      'analystHigh': analystHigh, 'analystMid': analystMid, 'analystLow': analystLow, 'volume': volume,
      'tickerRT': Sheet.getSheetValues(2, 17, 1, 1)[0], 
      'rating': Sheet.getSheetValues(2, 18, 1, 1)[0], 
      'targetPrice': Sheet.getSheetValues(2, 19, 1, 1)[0], 
      'forecastEps': Sheet.getSheetValues(2, 20, 1, 1)[0]
    }
    stockHistoryData = Object.assign(stockHistoryData, tickerObj, ratingObj); //, targetPriceObj
    CACHE.put(cacheName, JSON.stringify(stockHistoryData), CACHELIFETIME)
  }else{
    stockHistoryData = JSON.parse(stockHistoryData)
    
  }
  return stockHistoryData
}

function weBullMultiple(symbolLst, span){
  var dataPack = {}
  for(var i in symbolLst){
    var stockSymbol = symbolLst[i]
    dataPack[i] = weBullSingleEasy(stockSymbol, span)
  }
  Logger.log(dataPack)
  return dataPack;
}

function weBullSingleEasy(stockSymbol, span){
  var file = DriveApp.getFilesByName(stockSymbol).next();
  var Sheet = SpreadsheetApp.open(file);
  var finalJSON = {}
  var dateLst = [], close = [], pettmLst = []
  Sheet.getSheetValues(2, 1, span, 1).forEach(element => dateLst.unshift(element[0]))
  Sheet.getSheetValues(2, 5, span, 1).forEach(element => close.unshift(parseFloat(element[0])||null))
  Sheet.getSheetValues(2, 8, span, 1).forEach(element => pettmLst.unshift(parseFloat(element[0])||null))
  finalJSON['date'] = dateLst
  finalJSON['close'] = close
  finalJSON['pe'] = pettmLst
  return finalJSON
}


function weBullETFSingle(etfSymbol, span=20) {
  var cacheName = etfSymbol + '-history'
  var etfHistoryData = CACHE.get(cacheName);
  if(!etfHistoryData){
    var file = DriveApp.getFilesByName(etfSymbol).next();
    var Sheet = SpreadsheetApp.open(file);
    var dateLst = [], tickerObj = {"close":[], "volume":[], "avgVol3M":[], "vibrateRatio":[], "yield1Y":[], "beta3Y":[]}
    Sheet.getSheetValues(2, 1, span, 1).forEach(element => dateLst.unshift(element[0]))
    Sheet.getSheetValues(2, 3, span, 1).forEach(element => tickerObj = handleMultipleObj(element[0], tickerObj))
    var etfHistoryData = {
      'date': dateLst, 
      'price': tickerObj.close,
      'volume': tickerObj.volume,
      'avgVol3M': tickerObj.avgVol3M,
      'vibrateRatio': tickerObj.vibrateRatio,
      'yield1Y': tickerObj.yield1Y,
      'beta3Y': tickerObj.beta3Y,
      'tickerRTJSON':Sheet.getSheetValues(2, 3, 1, 1)[0], 
      'briefJSON': Sheet.getSheetValues(2, 4, 1, 1)[0], 
      'bonusBrief': Sheet.getSheetValues(2, 5, 1, 1)[0], 
      'assetsStructure': Sheet.getSheetValues(2, 6, 1, 1)[0], 
      'ratioDistrs': Sheet.getSheetValues(2, 7, 1, 1)[0], 
      'frontDistrs': Sheet.getSheetValues(2, 8, 1, 1)[0]
    }
    CACHE.put(cacheName, JSON.stringify(etfHistoryData), CACHELIFETIME)
  }else{
    etfHistoryData = JSON.parse(etfHistoryData)
  }
  Logger.log(etfHistoryData)
  return etfHistoryData
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
    var etfIndexData = JSON.parse(readLog("ETFIndex.txt", ETFFILE))
    CACHE.put(cacheName, JSON.stringify(etfIndexData), CACHELIFETIME)
  }else{
    etfIndexData = JSON.parse(etfIndexData)
  }
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

function handleTimeSeriesObj(element, targetObj){
    var targetKeys = Object.keys(targetObj)
    if(!element){
      for(no in targetKeys){
        (targetObj[targetKeys[no]]).unshift(null)
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

