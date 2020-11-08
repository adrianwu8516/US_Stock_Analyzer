function myFunction() {
  var folder = DriveApp.getFolderById("1iT-sGcenNSFc9INVIJqLvkabo4q0UyVz")
  var files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  while(files.hasNext()){
    var file = files.next()
    var ssFile = SpreadsheetApp.openById(file.getId())
    var targetRow = ssFile.getRange("3:3").getValues()
    if(targetRow[0][0]==''){
      Logger.log(file.getName())
      ssFile.deleteRow(3); 
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
          stockInfo.roeNow = guruData.roeNow
          stockInfo.roic = guruData.roic
          stockInfo.buyback_yield = guruData.buyback_yield
          stockInfo.lynchvalue = guruData.lynchvalue
          stockInfo.grahamnumber = guruData.grahamnumber
          stockInfo.iv_dcf = guruData.iv_dcf
          stockInfo.iv_dcf_share = guruData.iv_dcf_share
          stockInfo.medpsvalue = guruData.medpsvalue
          stockInfo.wacc = guruData.wacc
        }else{
          Logger.log("No GuruFOcus Info Data of" + stockSymbol)
        }
        
        try{
          // Technical Analysis Part
          let priceLst = getPriceLst(stockSymbol)
          stockInfo.ma60 = Sum(priceLst)/priceLst.length
          let priceLstShort = priceLst.slice(0, 20)
          stockInfo.ma20 = Sum(priceLstShort)/priceLstShort.length
          if(Math.abs(stockInfo.price - stockInfo.ma60)/stockInfo.ma60 < 0.05){
            stockInfo.ma60support = stockInfo.ma20 >= stockInfo.ma60? '↘️🛡' : '↗🛡'
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
  //REGENERATELOG()
}