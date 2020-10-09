function weBullSingle(stockSymbol='tsla', span=2) {
  var cacheName = stockSymbol + '-history'
  //var stockHistoryData = CACHE.get(cacheName);
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
    
    var guruData = Sheet.getSheetValues(2, 27, 1, 17)[0]
    var guruObj = {
      "ZScore": guruData[0], "MScore": guruData[1], "FScore": guruData[2], 
      "ev2ebitdaLow": guruData[3], "ev2ebitdaMid": guruData[4], "ev2ebitdaHigh": guruData[5], "ev2ebitdaNow": guruData[6], "buyback_yield": guruData[7], 
      "iv_dcf_share": guruData[8], "iv_dcf": guruData[9], "GrahamNumber": guruData[10], "LynchValue": guruData[11], "MedPSValue": guruData[12], 
      "p2tangible_bookLow": guruData[13], "p2tangible_bookMid": guruData[14], "p2tangible_bookHigh": guruData[15], "p2tangible_bookNow": guruData[16]
    }
    
    var tickerObj = {
      "avgVol10D":[], "avgVol3M":[], "fiftyTwoWkHigh":[], "fiftyTwoWkLow":[], "turnoverRate":[], "vibrateRatio":[], "changeRatio":[], 
      "pe":[], "forwardPe":[], "indicatedPe":[], "peTtm":[], "eps":[], "epsTtm":[],"bps":[], "pb":[], "ps":[],"yield":[]
    }
    Sheet.getSheetValues(2, 17, span, 1).forEach(element => tickerObj = handleTimeSeriesObj(element[0], tickerObj))
    var ratingObj = {"ratingAnalysisTotals":[], "sell":[], "underPerform":[], "hold":[], "buy":[], "strongBuy":[]}
    Sheet.getSheetValues(2, 18, span, 1).forEach(element => ratingObj = handleTimeSeriesObj(element[0], ratingObj))
    var BOLL = Boll(close)
    var stockHistoryData = {
      'date': dateLst, 'open': open, 'high': high, 'low': low, 'close': close,'pettm': pettmLst, 
      'analystHigh': analystHigh, 'analystMid': analystMid, 'analystLow': analystLow, 'volume': volume,
      'tickerRT': Sheet.getSheetValues(2, 17, 1, 1)[0], 'rating': Sheet.getSheetValues(2, 18, 1, 1)[0], 
      'targetPrice': Sheet.getSheetValues(2, 19, 1, 1)[0], 'forecastEps': Sheet.getSheetValues(2, 20, 1, 1)[0],
      'MACD': MACD(close), 'BollMean': BOLL.mean, 'BollUpper': BOLL.upper, 'BollLower': BOLL.lower, 'MA60': SMA(close, 60)
    }
    var forecastObj = {}
    var yahooSheet = SpreadsheetApp.openById('17enM_BO-EHxOr2sGl61umgNdXlfFZjdKsKlf2vA0hgE')
    var targetRow = onSearch(yahooSheet, stockSymbol, searchTargetCol=1)
    if(targetRow){
      targetRow += 1
      var forecastData = yahooSheet.getSheetValues(targetRow,3,1,7)[0]
      forecastObj.thisEPSGrowth = Math.round(forecastData[1] * 1000)/10 + "%"
      forecastObj.thisRevenueGrowth = Math.round(forecastData[2] * 1000)/10 + "%"
      forecastObj.nextEPSGrowth = Math.round(forecastData[3] * 1000)/10 + "%"
      forecastObj.nextRevenueGrowth = Math.round(forecastData[4] * 1000)/10 + "%"
      forecastObj.last5Y = Math.round(forecastData[5] * 1000)/10 + "%"
      forecastObj.next5Y = Math.round(forecastData[6] * 1000)/10 + "%"
    }
    
    var fRObj = getFRData(stockSymbol.replace('-', '.'))
    var fRObjWebull = getFRDataFromWebull(stockSymbol.split('-')[0])
    stockHistoryData = Object.assign(stockHistoryData, tickerObj, ratingObj, guruObj, forecastObj, fRObj, fRObjWebull); //, targetPriceObj
    CACHE.put(cacheName, JSON.stringify(stockHistoryData), CACHELIFETIME)
  }else{
    stockHistoryData = JSON.parse(stockHistoryData)
  }
  return stockHistoryData
}

function getFRDataFromWebull(stockSymbol='dkng'){
  var fRSheet = SpreadsheetApp.openById('1Vsz0aZ11kBd-c2OOa3S45_9jhmXfRf4vpQU47Ae7n_o').getSheetByName("Quarterly")
  var listForSearch = fRSheet.getSheetValues(1, 2, fRSheet.getLastRow(), 1).flat()
  var searchTarget = stockSymbol.toLowerCase()
  var searchResult = []
  for (var i = listForSearch.length - 1; i >= 0; i--) {
    if (listForSearch[i] === searchTarget) {
      searchResult.unshift(i);
    }
  }
  let final = {
    'periodQ':[], 'revenueQ':[], 'profitQ':[], 'incomeMarginQ':[], 'profitMarginQ':[], 'totalAssetQ':[], 'totalDebtQ':[], 'cashFlowRatioQ':[]
  };
  for(let i=0; i<searchResult.length; i++){
    var parsedData = fRSheet.getSheetValues(searchResult[i]+1, 3, 1, 5)[0]
    let periodQ = parsedData[1] + '/' +  parsedData[0], bLTable = parsedData[3], iSTable = parsedData[4], cFTable = parsedData[5]
    final.periodQ.unshift(periodQ)
    if(bLTable!='XXXX'){
      bLTable = JSON.parse(bLTable)
      let totalAssetQ = bLTable.totalAsset? parseInt(bLTable.totalAsset.value) / 100000000 : 0       // 億美金
      final.totalAssetQ.unshift(totalAssetQ)
      let totalDebtQ = bLTable.totalLiability? parseInt(bLTable.totalLiability.value)/100000000 : 0
      final.totalDebtQ.unshift(totalDebtQ)
      if(bLTable.totalCurrentLiability && bLTable.cash){
        final.cashFlowRatioQ.unshift(parseInt(bLTable.cash.value) / parseInt(bLTable.totalCurrentLiability.value) || 0)
      }else{
        final.cashFlowRatioQ.unshift(0)
      }
    }else{
      final.totalAssetQ.unshift(0); final.totalDebtQ.unshift(0); final.cashFlowRatioQ.unshift(0)
    }
    if(iSTable!='XXXX'){
      iSTable = JSON.parse(iSTable)
      let revenueQ = iSTable.revenue? parseInt(iSTable.revenue.value) / 100000000 : 0         // 億美金
      final.revenueQ.unshift(revenueQ)
      let profitQ = iSTable.netIncomeAfterTax? parseInt(iSTable.netIncomeAfterTax.value) / 100000000 : 0
      final.profitQ.unshift(profitQ)
      if(iSTable.grossProfit && iSTable.revenue){
        final.incomeMarginQ.unshift(parseInt(iSTable.grossProfit.value) / parseInt(iSTable.revenue.value) || 0)
      }else{
        final.incomeMarginQ.unshift(0)
      }
      if(iSTable.netIncomeBeforeTax && iSTable.revenue){
        final.profitMarginQ.unshift(parseInt(iSTable.netIncomeBeforeTax.value) / parseInt(iSTable.revenue.value) || 0)
      }else{
        final.profitMarginQ.unshift(0)
      }
    }else{
      final.revenueQ.unshift(0); final.profitQ.unshift(0); final.incomeMarginQ.unshift(0); final.profitMarginQ.unshift(0)
    }
  }
  return final
}

function getFRData(stockSymbol='rds.b'){
  var fRSheet = SpreadsheetApp.openById('1YHPDD8404yU6za3al4x0TYQaqfb0s4IgxLDf9tu0QGE')
  var listForSearch = fRSheet.getSheetValues(1, 2, fRSheet.getLastRow(), 1).flat()
  var searchTarget = stockSymbol.toLowerCase()
  var searchResult = []
  for (var i = listForSearch.length - 1; i >= 0; i--) {
    if (listForSearch[i] === searchTarget) {
      searchResult.unshift(i);
    }
  }
  let final = {
    'period':[], 'incomeMargin':[], 'profitMargin':[], 'revenueGrowth':[], 'profitGrowth':[], 'assetGrowth':[], 'cashFlowRatio':[], 'cashAdaquacyRatio':[], 'reinvestment':[], 
    'totalAsset':[], 'totalDebt':[], 'revenue':[], 'profit':[], 'ebitda':[], 'freeCash':[]
  };
  for(let i=0; i<searchResult.length; i++){
    var parsedData = fRSheet.getSheetValues(searchResult[i]+1, 3, 1, 6)[0]
    let period = parsedData[0], financialRate = parsedData[1], bLTable = parsedData[3], iSTable = parsedData[4], cFTable = parsedData[5]
    final.period.unshift(period)
    if(financialRate){
      financialRate = JSON.parse(financialRate)
      final.incomeMargin.unshift(parseFloat(financialRate['毛利率(%)'])||0)
      final.profitMargin.unshift(parseFloat(financialRate['淨利率(%)'])||0)
      final.revenueGrowth.unshift(parseFloat(financialRate['營收增長率(%)'])||0)
      final.profitGrowth.unshift(parseFloat(financialRate['營業利潤增長率(%)'])||0)
      final.assetGrowth.unshift(parseFloat(financialRate['淨資本增長率(%)'])||0)
      final.cashFlowRatio.unshift(parseFloat(financialRate['現金流量比率(%)'])||0)
      final.cashAdaquacyRatio.unshift(parseFloat(financialRate['現金流量允當比率(%)'])||0)
      final.reinvestment.unshift(parseFloat(financialRate['現金再投資比率(%)'])||0)
    }else{
      final.incomeMargin.unshift(0); final.profitMargin.unshift(0); final.revenueGrowth.unshift(0); final.profitGrowth.unshift(0)
      final.assetGrowth.unshift(0); final.cashFlowRatio.unshift(0); final.cashAdaquacyRatio.unshift(0); final.reinvestment.unshift(0)
    }
    if(bLTable){
      bLTable = JSON.parse(bLTable)
      final.totalAsset.unshift(parseInt(bLTable['資產總計'])/100000000||0)
      final.totalDebt.unshift(parseInt(bLTable['負債合計'])/100000000||0)
    }else{
      final.totalAsset.unshift(0); final.totalDebt.unshift(0)
    }
    if(iSTable){
      iSTable = JSON.parse(iSTable)
      final.revenue.unshift(parseInt(iSTable['營業收入'])/100000000||0)
      final.profit.unshift(parseInt(iSTable['淨利潤'])/100000000||0)
      final.ebitda.unshift(parseInt(iSTable['EBITDA(税息折舊及攤銷前利潤)'])/100000000||0)
    }else{
      final.revenue.unshift(0); final.profit.unshift(0); final.ebitda.unshift(0)
    }
    if(cFTable){
      cFTable = JSON.parse(cFTable)
      final.freeCash.unshift(parseInt(cFTable['自由現金流'])/100000000||0)
    }else{
      final.freeCash.unshift(0)
    }
  }
  return final
}

function weBullMultiple(symbolLst, span){
  var cacheName = symbolLst + '-history'
  var dataPack = CACHE.get(cacheName);
  if(!dataPack){
    var dataPack = {}
    for(var i in symbolLst){
      var stockSymbol = symbolLst[i]
      if(stockSymbol.includes('etf')){
        var etfSymbol = stockSymbol.replace('etf', '') 
        dataPack[i] = etfSingleEasy(etfSymbol , span)
      }else{
        dataPack[i] = weBullSingleEasy(stockSymbol, span)
      }
    }
    CACHE.put(cacheName, JSON.stringify(dataPack), CACHELIFETIME)
  }else{
    dataPack = JSON.parse(dataPack)
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

function etfSingleEasy(etfSymbol, span){
  var file = DriveApp.getFilesByName(etfSymbol).next();
  var Sheet = SpreadsheetApp.open(file);
  var finalJSON = {}
  var dateLst = [], close = [], pettmLst = []
  Sheet.getSheetValues(2, 1, span, 1).forEach(element => dateLst.unshift(element[0]))
  Sheet.getSheetValues(2, 9, span, 1).forEach(element => close.unshift(parseFloat(element[0])||null))
  Sheet.getSheetValues(2, 1, span, 1).forEach(element => pettmLst.unshift(null))
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
//  var cacheName = 'index'
//  var indexData = CACHE.get(cacheName);
//  if(!indexData){
    var indexData = JSON.parse(readLog("LoggerMailer.txt"))
//    CACHE.put(cacheName, JSON.stringify(indexData), CACHELIFETIME)
//  }else{
//    indexData = JSON.parse(indexData)
//  }  
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
    CACHE.put(cacheName, JSON.stringify(SIFinalData), CACHELIFETIME*2)
  }else{
    SIFinalData = JSON.parse(SIFinalData)
  }
  return SIFinalData
}

function handleTimeSeriesObj(element, targetObj){
  var targetKeys = Object.keys(targetObj)
  if(!element){
    for(let no in targetKeys){
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

