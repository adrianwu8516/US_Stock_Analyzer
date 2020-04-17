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


function dailyCBSRanking(stockName){
  var signalUrl = "https://caibaoshuo.com/companies/" + stockName + "/cbs_signal"
  var xml = UrlFetchApp.fetch(signalUrl).getContentText();
  xml = xml.match(/<table class="table table-hover"([\s\S]*?)<\/table>/gm)
  var document = XmlService.parse(xml);
  signal = document.getRootElement().getChildren('tbody')[0].getChildren('tr')[0].getChildren('td')[1].getText().replace(/\n +/g, '')
  return signal
}

function collectDataFromCBS(){
  // Check if market closed
  var todayString = checkifClosed()
  if(!todayString) return;
  
  var noteObj = JSON.parse(readLog("LoggerTemp.txt"))
  
  var catLst = Object.keys(noteObj)
  for(var catNo in catLst){
    var catName = catLst[catNo]
    var catObj = noteObj[catName]
    var stockLst = Object.keys(catObj)
    for(var stockNo in stockLst){
      var stockName = stockLst[stockNo]
      try{
        noteObj[catName][stockName]["cbsRanking"] = dailyCBSRanking(stockName)
      }catch(e){
        Logger.log(e)
        Logger.log(stockName + " : Failed")
        noteObj[catName][stockName]["cbsRanking"] = ""
      }
      var stockInfo = catObj[stockName]
      dataRecord(stockInfo)
    }
  }
  // Log Maintain
  var noteObjOld = JSON.parse(readLog("LoggerYesterday.txt"))
  saveLog(JSON.stringify(noteObj), "LoggerYesterday.txt")
  
  // Log Compare
  noteObj = dailyComparison(noteObj, noteObjOld)
  saveLog(JSON.stringify(noteObj), "LoggerMailer.txt")
}