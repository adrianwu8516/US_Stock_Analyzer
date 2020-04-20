function dataRecordandProcess(symbols = SYMBOLS){
  // Check if market closed
  if(!checkifClosed()) return;
  
  // Record
  var logObj = {}
  for (var catNo in CATLIST){
    var catName = CATLIST[catNo]
    if (typeof logObj[catName] == "undefined") logObj[catName] = {}
    for(var i in symbols[catName]){
      var symbol = symbols[catName][i].split('-')[1].toUpperCase()
      var stockInfo = CACHE.get(symbol);
      if(stockInfo != null){
        stockInfo = JSON.parse(stockInfo)
        dataRecord(stockInfo)
        logObj[catName][symbol] = stockInfo
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
  var fileName = stockInfo['companyName'] + "(" + stockInfo['symbol'] + ")"
  if(DriveApp.getFilesByName(fileName).hasNext()){
    var documentId = DriveApp.getFilesByName(fileName).next().getId()
  }else{
    var documentId = DriveApp.getFileById(STOCK_TEMPLATE_ID).makeCopy(STOCKFILE).getId();
    DriveApp.getFileById(documentId).setName(fileName)
  }
  var stockDoc = SpreadsheetApp.openById(documentId);
  today = new Date();
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()).padStart(2, '0') + '日';
  var targetRow = onSearch(stockDoc, todayStr, searchTargetCol=0)
  if(targetRow){
    targetRow += 1
    stockDoc.getRange('A' + targetRow + ':P' + targetRow).setValues([[todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow'], stockInfo['52weekHigh'], stockInfo['52weekLow'], stockInfo['cbsRanking']]]);
  }else{
    stockDoc.insertRowBefore(2);
    stockDoc.getRange('A2:P2').setValues([[todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow'], stockInfo['52weekHigh'], stockInfo['52weekLow'], stockInfo['cbsRanking']]]);
  }
}

function dailyComparison(noteObj, noteObjOld){
  var catLst = Object.keys(noteObj)
  for(var catNo in catLst){
    var catName = catLst[catNo]
    var catObj = noteObj[catName]
    var stockLst = Object.keys(catObj)
    for(var stockNo in stockLst){
      var stockName = stockLst[stockNo]
      var stockInfo = catObj[stockName]
      try {
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
      }catch (e) {
        Logger.log(noteObj[catName][stockName]['companyName'] + " is a new item")
      }
    }
  }
  return noteObj
}