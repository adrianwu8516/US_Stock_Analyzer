function genCrossDateLog(){
  // Check if market closed
  if(!checkifClosed()) return;
  var logObj = {}
  
  // Loading Yahoo Data
  var YahooSheet = SpreadsheetApp.openById('17enM_BO-EHxOr2sGl61umgNdXlfFZjdKsKlf2vA0hgE')
  
  // Record
  for (var catName in STOCK_SYMBOLS){
    logObj[catName] = {}
    for(var i in STOCK_SYMBOLS[catName]){
      var stockId = STOCK_SYMBOLS[catName][i]
      var stockSymbol = stockId.split(/-(.+)/)[1].toUpperCase()
      var stockJSON = collectLogDataFromSheet(stockId)
      stockJSON.category = catName
      // Yahoo Data Included
      var forecast = checkYahooForecast(YahooSheet, stockSymbol)
      stockJSON.thisRevenue = forecast.thisRevenue
      stockJSON.nextRevenue = forecast.nextRevenue
      stockJSON.thisEPS = forecast.thisEPS
      stockJSON.nextEPS = forecast.nextEPS
      stockJSON.next5Year = forecast.next5Year
      logObj[catName][stockSymbol] = stockJSON
    }
  }
  saveLog(JSON.stringify(logObj), "LoggerStockInfoYesterday.txt") 
  
  // Process - compare the data with yesterday
  var logObjOld = JSON.parse(readLog("LoggerStockInfo.txt"))
  
  // Log Compare
  logObj = dailyComparison(logObj, logObjOld)
  saveLog(JSON.stringify(logObj), "LoggerStockInfo.txt") 
  return
}

function collectLogDataFromSheet(stockId='nyse-de'){
  var stockSymbol = stockId.split(/-(.+)/)[1].toUpperCase()
  
  // Spreadsheet Data Prep
  var file = DriveApp.getFilesByName(stockSymbol).next();
  var Sheet = SpreadsheetApp.open(file);
  var dataToday = Sheet.getSheetValues(2, 1, 1, 51)[0]
  var tickerJSON = JSON.parse(dataToday[16])

  var stockJSON = {
    "symbol": stockSymbol,
    "companyName": tickerJSON.name,
    "exchange": tickerJSON.disExchangeCode,
    "price": tickerJSON.close,
    "delta": tickerJSON.changeRatio,
    "52weekHigh": tickerJSON.fiftyTwoWkHigh,
    "52weekLow": tickerJSON.fiftyTwoWkLow,
    "value": tickerJSON.marketValue,
    "TTM": tickerJSON.peTtm,
    "pb":tickerJSON.pb,
    "ps":tickerJSON.ps,
    "analystPopularity":dataToday[9],
    "analystAttitiude":dataToday[8],
    "url":("https://www.webull.com/zh/quote/" + stockId),
    "priceLow":dataToday[12],
    "priceHigh":dataToday[10],
    "priceMid":dataToday[11],
    "latestEarningsDate":tickerJSON.latestEarningsDate,
    "high":tickerJSON.high,
    "low":tickerJSON.low,
    "open":tickerJSON.open,
    "volume":tickerJSON.volume,
    "volume10D":tickerJSON.avgVol10D,
    "volumeRatio":Math.round((tickerJSON.volume/tickerJSON.avgVol10D) * 100),
    "forwardPe":tickerJSON.forwardPe,
    "yield":tickerJSON.yield,
    "holdingRatio":dataToday[44],
    "holdingChangeRatio":dataToday[45],
    "holding":dataToday[46],
    "cbsRanking":dataToday[15],
    "fscore":dataToday[28],
    "mscore":dataToday[27],
    "zscore":dataToday[26],
    "ev2ebitdaNow":dataToday[32],
    "p2tangible_bookNow":dataToday[42],
    "roeNow":dataToday[50],
    "roic":dataToday[25],
    "buyback_yield":dataToday[33],
    "lynchvalue":dataToday[37],
    "grahamnumber":dataToday[36],
    "iv_dcf":dataToday[35],
    "iv_dcf_share":dataToday[34],
    "medpsvalue":dataToday[38],
    "wacc":dataToday[24],
  } 
  try{
    // Technical Analysis Part
    let priceLst = getPriceLst(stockSymbol)
    stockJSON.ma60 = Sum(priceLst)/priceLst.length
    let priceLstShort = priceLst.slice(0, 20)
    stockJSON.ma20 = Sum(priceLstShort)/priceLstShort.length
    if(Math.abs(stockJSON.price - stockJSON.ma60)/stockJSON.ma60 < 0.05){
      stockJSON.ma60support = stockJSON.ma20 >= stockJSON.ma60? '↘️🛡' : '↗🛡'
    }
  }catch(e){
    Logger.log(e)
    Logger.log(stockSymbol + ' failed to generate 60 ma support data')
  }
  stockJSON = weBullAnalystMark(stockJSON)
  return stockJSON
}

function dailyComparison(noteObj, noteObjOld){
  for(var catName in noteObj){
    for(var stockName in noteObj[catName]){
      var stockInfo = noteObj[catName][stockName]
      if(!noteObjOld[catName]) {Logger.log( catName + " is a new category"); continue;}
      if(!noteObjOld[catName][stockName]) {Logger.log( stockName + " is a new company"); continue;}
      var newPopularity = stockInfo['analystPopularity']
      var oldPopularity = noteObjOld[catName][stockName]['analystPopularity']
      if(oldPopularity){
        if(newPopularity > oldPopularity){
          noteObj[catName][stockName]['analystPopularity'] = String(oldPopularity) + " ↗ " + String(newPopularity)
        }else if(newPopularity < oldPopularity){
          noteObj[catName][stockName]['analystPopularity'] = String(oldPopularity) + " ↘ " + String(newPopularity)
        }
      }
      var newPriceMid = stockInfo['priceMid']
      var oldPriceMid = noteObjOld[catName][stockName]['priceMid']
      if(oldPriceMid){
        if(newPriceMid > oldPriceMid){
          noteObj[catName][stockName]['analysis'] = stockInfo['analysis'] + "，調高目標均價從 " + String(oldPriceMid) + " ↗ " + String(newPriceMid)
        }else if(newPriceMid < oldPriceMid){
          noteObj[catName][stockName]['analysis'] = stockInfo['analysis'] + "，降低目標均價從 " + String(oldPriceMid) + " ↘ " + String(newPriceMid)
        }
      }
    }
  }
  return noteObj
}

function checkYahooForecast(sheet, symbol){
  var targetRow = onSearch(sheet, symbol.toLowerCase(), searchTargetCol=1)
  var forecast = {}
  if(targetRow){
    targetRow += 1
    var value = sheet.getSheetValues(targetRow, 4, 1, 6)[0]
    forecast.thisEPS = Math.round(value[0] * 100)
    forecast.thisRevenue = Math.round(value[1] * 100)
    forecast.nextEPS = Math.round(value[2] * 100)
    forecast.nextRevenue = Math.round(value[3] * 100)
    forecast.psat5Year = Math.round(value[4] * 100)
    forecast.next5Year = Math.round(value[5] * 100)
  }
  return forecast
}

function getPriceLst(stockSymbol='KC', span=60){
  var file = DriveApp.getFilesByName(stockSymbol).next();
  var Sheet = SpreadsheetApp.open(file);
  let close = Sheet.getSheetValues(2, 5, span, 1).map(element => parseFloat(element[0])||null) // List order [T, T-1, T-2 ......]
  return close
}

function weBullAnalystMark(stockInfo){
  // Analyst Marks
  if(stockInfo['price'] < stockInfo['priceLow']){
    stockInfo['sign'] = "🏆";
    stockInfo['analysis'] = Math.round(((stockInfo['priceLow'] - stockInfo['price'])/stockInfo['priceLow'])*100) + "% 低於低標 " + stockInfo['priceLow']
  }else if(stockInfo['price'] < stockInfo['priceMid']){
    stockInfo['sign'] = "🔥";
    stockInfo['analysis'] = Math.round(((stockInfo['priceMid'] - stockInfo['price'])/stockInfo['priceMid'])*100) + "% 低於均價 " + stockInfo['priceMid']
  }else if((stockInfo['price'] > stockInfo['priceMid']) && (stockInfo['price'] < stockInfo['priceHigh'])){
    stockInfo['sign'] = "❗";
    stockInfo['analysis'] = Math.round(((stockInfo['price'] - stockInfo['priceMid'])/stockInfo['priceMid'])*100) + "% 高於均價 " + stockInfo['priceMid']
  }else{
    stockInfo['sign'] = "🆘";
    stockInfo['analysis'] = Math.round(((stockInfo['price'] - stockInfo['priceHigh'])/stockInfo['priceHigh'])*100) + "% 高於高標 " + stockInfo['priceHigh']
  }
  
  // Volumn Marks - check if the volumn goes up
  if(stockInfo['volume'] > stockInfo['volume10D']*2){
    stockInfo['volumeMark'] = "⚔"
  }
  
  // Post-Earning Announcement Effect, Get Fast / Positive News
  var today = new Date()
  if((today - stockInfo.latestEarningsDate < 86400000 * 10)&&(today > stockInfo.latestEarningsDate)){ // within 10 days
    stockInfo['news'] = "🗞"
    let forecastEPSLst = JSON.parse(stockInfo.forecastEps)['points']
    let forecastLast = forecastEPSLst.pop()
    let forecast2ndLast = forecastEPSLst.pop()
    if(forecastLast.valueActual != null){
      stockInfo['beatAnalyst'] = (forecastLast.valueActual >= forecastLast.valueForecast)? "😎" : "😨"
    }else if(forecast2ndLast.valueActual != null){
      stockInfo['beatAnalyst'] = (forecast2ndLast.valueActual >= forecast2ndLast.valueForecast)? "😎" : "😨"
    }
  }
  return stockInfo
}