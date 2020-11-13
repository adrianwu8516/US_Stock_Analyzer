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

function dataRecord(stockInfo){
  //var stockInfo = JSON.parse(CACHE.get('MDXG'))
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
      targetRow += 1
      stockDoc.getRange('A' + targetRow + ':AU' + targetRow).setValues([[
        todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], 
        stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow'], 
        stockInfo['52weekHigh'], stockInfo['52weekLow'], stockInfo['cbsRanking'], 
        stockInfo['tickerRT'], stockInfo['rating'], stockInfo['targetPrice'], stockInfo['forecastEps'], 
        stockInfo['high'], stockInfo['low'], stockInfo['open'], stockInfo['volume'],
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', // Make room for gurufocus data
        stockInfo['holdingRatio'], stockInfo['holdingChangeRatio'], stockInfo['holding']]]);
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