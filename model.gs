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
      "avgVol10D":[], "avgVol3M":[], "fiftyTwoWkHigh":[], "fiftyTwoWkLow":[], "turnoverRate":[], "vibrateRatio":[], "changeRatio":[], 
      "pe":[], "forwardPe":[], "indicatedPe":[], "peTtm":[], "eps":[], "epsTtm":[],"bps":[], "pb":[], "ps":[],"yield":[]
    }
    var ratingObj = {"ratingAnalysisTotals":[], "sell":[], "underPerform":[], "hold":[], "buy":[], "strongBuy":[]}
    Sheet.getSheetValues(2, 17, span, 1).forEach(element => tickerObj = handleTimeSeriesObj(element[0], tickerObj))
    Sheet.getSheetValues(2, 18, span, 1).forEach(element => ratingObj = handleTimeSeriesObj(element[0], ratingObj))
    var BOLL = Boll(close)
    var stockHistoryData = {
      'date': dateLst, 'open': open, 'high': high, 'low': low, 'close': close,'pettm': pettmLst, 
      'analystHigh': analystHigh, 'analystMid': analystMid, 'analystLow': analystLow, 'volume': volume,
      'tickerRT': Sheet.getSheetValues(2, 17, 1, 1)[0], 'rating': Sheet.getSheetValues(2, 18, 1, 1)[0], 
      'targetPrice': Sheet.getSheetValues(2, 19, 1, 1)[0], 'forecastEps': Sheet.getSheetValues(2, 20, 1, 1)[0],
      'MACD': MACD(close), 'BollMean': BOLL.mean, 'BollUpper': BOLL.upper, 'BollLower': BOLL.lower,
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
    Sheet.getSheetValues(2, 3, span, 1).forEach(element => tickerObj = handleTimeSeriesObj(element[0], tickerObj))
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

function superInvestorData(){
  var cacheName = 'superInvestorData'
  var SIFinalData = CACHE.get(cacheName);
  if(!SIFinalData){
    var SIDoc = SpreadsheetApp.openById(SUPERINVESTORSHEET_ID).getSheetByName("SNP500Compare")
    var SIData = SIDoc.getRange("A2:F501").getValues()
    var bestSeller = {}, worstSeller = {}
    for(i in SIData){
      var no = SIData[i][2]
      if(no > 2){
        var currentPrice = askCurrentPriceFromGoogle(SIData[i][1])
        if(bestSeller[no]){
          bestSeller[no].push([SIData[i][1], SIData[i][3], SIData[i][4], SIData[i][5], currentPrice])
        }else{
          bestSeller[no] = [[SIData[i][1], SIData[i][3], SIData[i][4], SIData[i][5], currentPrice]]
        }
      }else if(no < -2){
        if(worstSeller[no]){
          worstSeller[no].push([SIData[i][1], SIData[i][3], SIData[i][4]])
        }else{
          worstSeller[no] = [[SIData[i][1], SIData[i][3], SIData[i][4]]]
        }
      }
    }
    var SIFinalData = {'bestSeller': bestSeller, 'worstSeller':worstSeller}
    CACHE.put(cacheName, JSON.stringify(SIFinalData), CACHELIFETIME)
  }else{
    SIFinalData = JSON.parse(SIFinalData)
  }
  return SIFinalData
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

function askCurrentPriceFromGoogle(symbol='fb'){
  var sheet = SpreadsheetApp.openById("1CXyvcYPu9xGg7KlWwaIJskXMQd5pZArm6dS5h5TmhiI").getSheetByName("Operation")
  var price = sheet.getRange(1,1).setFormula('=GoogleFinance("' + symbol + '","price")').getValue()
  return price
}

