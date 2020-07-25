function dataRecordandProcess(){
  // Check if market closed
  if(!checkifClosed()) return;
  
  // Record
  for (var catName in STOCK_SYMBOLS){
    for(var i in STOCK_SYMBOLS[catName]){
      var stockSymbol = STOCK_SYMBOLS[catName][i].split(/-(.+)/)[1].toUpperCase()
      var stockInfo = CACHE.get(stockSymbol);
      if(stockInfo != null){
        stockInfo = JSON.parse(stockInfo)
        Logger.log("Examining: " + stockSymbol)
        dataRecord(stockInfo)
      }
    }
  }
}

function logGenerateAndCrossDayCompare(){
  // Check if market closed
  if(!checkifClosed()) return;
  // Financial Forecast Data Prepare 
  var YahooSheet = SpreadsheetApp.openById('17enM_BO-EHxOr2sGl61umgNdXlfFZjdKsKlf2vA0hgE')
  var logObj = {}
  
  for (var catName in STOCK_SYMBOLS){
    if (typeof logObj[catName] == "undefined") logObj[catName] = {}
    for(var i in STOCK_SYMBOLS[catName]){
      var stockSymbol = STOCK_SYMBOLS[catName][i].split(/-(.+)/)[1].toUpperCase()
      var stockInfo = CACHE.get(stockSymbol);
      if(stockInfo != null){
        stockInfo = JSON.parse(stockInfo)
        var forecast = checkYahooForecast(YahooSheet, stockSymbol)
        stockInfo.thisRevenue = forecast.thisRevenue
        stockInfo.nextRevenue = forecast.nextRevenue
        stockInfo.thisEPS = forecast.thisEPS
        stockInfo.nextEPS = forecast.nextEPS
        stockInfo.next5Year = forecast.next5Year
        delete stockInfo.tickerRT; // In case the cache might be too large to load
        delete stockInfo.rating;
        delete stockInfo.targetPrice;
        delete stockInfo.forecastEps;
        logObj[catName][stockSymbol] = stockInfo
      }
    }
  }
  // Process - compare the data with yesterday
  var logObjOld = JSON.parse(readLog("LoggerYesterday.txt"))
  saveLog(JSON.stringify(logObj), "LoggerYesterday.txt")
  
  // Log Compare
  logObj = dailyComparison(logObj, logObjOld)
  saveLog(JSON.stringify(logObj), "LoggerMailer.txt") 
  // Use txt file instead of cache, so we can change to another mail server if we want to change the mailer
}

function dataRecord(stockInfo){
  var fileName = stockInfo['symbol']
  var today = new Date();
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()).padStart(2, '0') + '日';
  
  if(DriveApp.getFilesByName(fileName).hasNext()){
    var documentId = DriveApp.getFilesByName(fileName).next().getId()
    var stockDoc = SpreadsheetApp.openById(documentId);
    if(stockDoc.getSheetValues(2,1,1,1)[0][0]==''){
      Logger.log(fileName + ": 2nd row null")
      stockDoc.deleteRow(2)
    }
    var targetRow = onSearch(stockDoc, todayStr, searchTargetCol=0)
    if(targetRow){
      Logger.log("Passover: " + fileName)
//      targetRow += 1
//      stockDoc.getRange('A'+ targetRow + ':X' + targetRow).setValues([[
//        todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], 
//        stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow'], 
//        stockInfo['52weekHigh'], stockInfo['52weekLow'], stockInfo['cbsRanking'], 
//        stockInfo['tickerRT'], stockInfo['rating'], stockInfo['targetPrice'], stockInfo['forecastEps'], 
//        stockInfo['high'], stockInfo['low'], stockInfo['open'], stockInfo['volume']]]);
    }else{
      Logger.log("Recording: " + fileName)
      stockDoc.insertRowBefore(2);
      stockDoc.getRange('A2:X2').setValues([[
        todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], 
        stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow'], 
        stockInfo['52weekHigh'], stockInfo['52weekLow'], stockInfo['cbsRanking'], 
        stockInfo['tickerRT'], stockInfo['rating'], stockInfo['targetPrice'], stockInfo['forecastEps'], 
        stockInfo['high'], stockInfo['low'], stockInfo['open'], stockInfo['volume']]]);
    }
  }else{
    var documentId = DriveApp.getFileById(STOCK_TEMPLATE_ID).makeCopy(STOCKFILE).getId();
    DriveApp.getFileById(documentId).setName(fileName)
    Logger.log("New File: " + fileName)
    var stockDoc = SpreadsheetApp.openById(documentId);
    stockDoc.getRange('A2:X2').setValues([[
      todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], 
      stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow'], 
      stockInfo['52weekHigh'], stockInfo['52weekLow'], stockInfo['cbsRanking'], 
      stockInfo['tickerRT'], stockInfo['rating'], stockInfo['targetPrice'], stockInfo['forecastEps'], 
      stockInfo['high'], stockInfo['low'], stockInfo['open'], stockInfo['volume']]]);
    if(stockInfo['exchange'] == 'NSQ'){
      var googleSymbol = 'NASDAQ:' + fileName.toUpperCase()
      insertGoogleHisData(stockDoc, googleSymbol)
    }else if(stockInfo['exchange'] == 'NYSE'){
      var googleSymbol = 'NYSE:' + fileName.toUpperCase()
      insertGoogleHisData(stockDoc, googleSymbol)
    }else if(stockInfo['exchange'] == 'PK'){
      var googleSymbol = 'OTCMKTS:' + fileName.toUpperCase()
      insertGoogleHisData(stockDoc, googleSymbol)
    }else{
      Logger.log("Can not find " + fileName + " in Google Finance Database")
    }
  }
  
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