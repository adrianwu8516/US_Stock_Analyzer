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

function fixMissingValue(){ 
  // Record
  for(var catName in STOCK_SYMBOLS){
    for(var i in STOCK_SYMBOLS[catName]){
      var stockSymbol = STOCK_SYMBOLS[catName][i].split(/-(.+)/)[1].toUpperCase()
      var fileName = stockSymbol
      if(DriveApp.getFilesByName(fileName).hasNext()){
        var documentId = DriveApp.getFilesByName(fileName).next().getId()
        var stockDoc = SpreadsheetApp.openById(documentId);
        if(stockDoc.getSheetValues(16,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 16th row null")
          stockDoc.deleteRow(16)
        }
        if(stockDoc.getSheetValues(15,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 15th row null")
          stockDoc.deleteRow(15)
        }
        if(stockDoc.getSheetValues(14,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 14th row null")
          stockDoc.deleteRow(14)
        }
        if(stockDoc.getSheetValues(13,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 13th row null")
          stockDoc.deleteRow(13)
        }
        if(stockDoc.getSheetValues(12,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 12th row null")
          stockDoc.deleteRow(12)
        }
        if(stockDoc.getSheetValues(11,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 11th row null")
          stockDoc.deleteRow(11)
        }if(stockDoc.getSheetValues(10,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 10th row null")
          stockDoc.deleteRow(10)
        }
        if(stockDoc.getSheetValues(9,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 9th row null")
          stockDoc.deleteRow(9)
        }
        if(stockDoc.getSheetValues(8,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 8th row null")
          stockDoc.deleteRow(8)
        }if(stockDoc.getSheetValues(7,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 7th row null")
          stockDoc.deleteRow(7)
        }
        if(stockDoc.getSheetValues(6,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 6th row null")
          stockDoc.deleteRow(6)
        }
        if(stockDoc.getSheetValues(5,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 5th row null")
          stockDoc.deleteRow(5)
        }
        if(stockDoc.getSheetValues(4,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 4th row null")
          stockDoc.deleteRow(4)
        }
        if(stockDoc.getSheetValues(3,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 3rd row null")
          stockDoc.deleteRow(3)
        }
        if(stockDoc.getSheetValues(2,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 2nd row null")
          stockDoc.deleteRow(2)
        }
      }else{
        Logger.log(fileName + " File Missed!")
      }
    }
  }
  return
}

function logtest(){
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
  // Process - compare the data with yesterday
  var logObjOld = JSON.parse(readLog("LoggerTesting.txt"))
  
  // Log Compare
  logObj = dailyComparison(logObj, logObjOld)
  saveLog(JSON.stringify(logObj), "LoggerTesting.txt") 
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
    "delta": tickerJSON.changeRatio, //Changed style
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
    "yield":tickerJSON.yield, //Changed style
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