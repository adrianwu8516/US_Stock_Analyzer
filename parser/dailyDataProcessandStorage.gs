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
      if(stockInfo){
        stockInfo = JSON.parse(stockInfo)
        
        // Yahoo Data Included
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
        
        // GuruData Included
        var guruData = CACHE.get(STOCK_SYMBOLS[catName][i].split(/-(.+)/)[1].replace('-', '.')+'-Guru');
        if(guruData){
          guruData = JSON.parse(guruData)
          stockInfo.fscore = guruData.fscore
          stockInfo.mscore = guruData.mscore
          stockInfo.zscore = guruData.zscore
          stockInfo.ev2ebitdaNow = guruData.ev2ebitdaNow
          stockInfo.p2tangible_bookNow = guruData.p2tangible_bookNow
          stockInfo.buyback_yield = guruData.buyback_yield
          stockInfo.lynchvalue = guruData.lynchvalue
          stockInfo.grahamnumber = guruData.grahamnumber
          stockInfo.iv_dcf = guruData.iv_dcf
          stockInfo.iv_dcf_share = guruData.iv_dcf_share
          stockInfo.medpsvalue = guruData.medpsvalue
        }else{
          Logger.log("No GuruFOcus Info Data of" + stockSymbol)
        }
        
        try{
          // Technical Analysis Part
          let priceLst = getPriceLst(stockSymbol)
          let ma60Support = Sum(priceLst)/priceLst.length
          let priceLstShort = priceLst.slice(0, 20)
          let ma20Support = Sum(priceLstShort)/priceLstShort.length
          if(Math.abs(stockInfo.price - ma60Support)/ma60Support < 0.05){
            stockInfo.ma60support = ma20Support >= ma60Support? '↘️🛡' : '↗🛡'
            
          }
        }catch(e){
          Logger.log(e)
          Logger.log(stockSymbol + ' failed to generate 60 ma support data')
        }
        
        logObj[catName][stockSymbol] = stockInfo
      }else{
        Logger.log("No Stock Info Data of" + stockSymbol)
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

function dataRecord(stockInfo={'symbol':'KL'}){
  var fileName = stockInfo['symbol']
  var today = new Date();
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()).padStart(2, '0') + '日';
  
  if(DriveApp.getFilesByName(fileName).hasNext()){
    var documentId = DriveApp.getFilesByName(fileName).next().getId()
    var stockDoc = SpreadsheetApp.openById(documentId);
    // If 2nd row is null (means the previous writing process fiailed)
    if(stockDoc.getSheetValues(2,1,1,1)[0][0]==''){
      Logger.log(fileName + ": 2nd row null")
      stockDoc.getRange('A2:AU2').setValues([[
        todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], 
        stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow'], 
        stockInfo['52weekHigh'], stockInfo['52weekLow'], stockInfo['cbsRanking'], 
        stockInfo['tickerRT'], stockInfo['rating'], stockInfo['targetPrice'], stockInfo['forecastEps'], 
        stockInfo['high'], stockInfo['low'], stockInfo['open'], stockInfo['volume'],
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', // Make room for gurufocus data
        stockInfo['holdingRatio'], stockInfo['holdingChangeRatio'], stockInfo['holding']]]);
      return
    }
    var targetRow = onSearch(stockDoc, todayStr, searchTargetCol=0)
    if(targetRow){
      Logger.log("Passover: " + fileName)
    }else{
      // If data of today does not been recorded yet
      Logger.log("Recording: " + fileName)
      stockDoc.insertRowBefore(2);
      stockDoc.getRange('A2:AU2').setValues([[
        todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], 
        stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow'], 
        stockInfo['52weekHigh'], stockInfo['52weekLow'], stockInfo['cbsRanking'], 
        stockInfo['tickerRT'], stockInfo['rating'], stockInfo['targetPrice'], stockInfo['forecastEps'], 
        stockInfo['high'], stockInfo['low'], stockInfo['open'], stockInfo['volume'],
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', // Make room for gurufocus data
        stockInfo['holdingRatio'], stockInfo['holdingChangeRatio'], stockInfo['holding']]]);
    }
  }else{
    // If document do not even exist
    var documentId = DriveApp.getFileById(STOCK_TEMPLATE_ID).makeCopy(STOCKFILE).getId();
    DriveApp.getFileById(documentId).setName(fileName)
    Logger.log("New File: " + fileName)
    var stockDoc = SpreadsheetApp.openById(documentId);
    stockDoc.getRange('A2:AU2').setValues([[
      todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], 
      stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow'], 
      stockInfo['52weekHigh'], stockInfo['52weekLow'], stockInfo['cbsRanking'], 
      stockInfo['tickerRT'], stockInfo['rating'], stockInfo['targetPrice'], stockInfo['forecastEps'], 
      stockInfo['high'], stockInfo['low'], stockInfo['open'], stockInfo['volume'],
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', // Make room for gurufocus data
      stockInfo['holdingRatio'], stockInfo['holdingChangeRatio'], stockInfo['holding']]]);
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

function getPriceLst(stockSymbol='KC', span=60){
  var file = DriveApp.getFilesByName(stockSymbol).next();
  var Sheet = SpreadsheetApp.open(file);
  let close = Sheet.getSheetValues(2, 5, span, 1).map(element => parseFloat(element[0])||null) // List order [T, T-1, T-2 ......]
  return close
}