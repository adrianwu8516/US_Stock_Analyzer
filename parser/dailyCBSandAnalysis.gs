function getCBSRanking(stockName){
  // CBS does not support financial companise
  if(CBSMUSTFAIL.includes(stockName)) return ""
  var sleepDurationSec = 0.5
  var retry = 1
  while(retry < 3){
    try{
      var signalUrl = "https://caibaoshuo.com/companies/" + stockName
      var xml = UrlFetchApp.fetch(signalUrl).getContentText();
      var signal = xml.replace(/[\s\S]*?<p class="led-text"><span style=[\s\S]*?>([\S]*?)<\/span><\/p>[\s\S]*/m, '$1')
      return signal.length > 3? '':signal
    }catch(e){
      Logger.log(e)
      Logger.log(stockName + " : CBS parse failed " + retry)
      Utilities.sleep(sleepDurationSec * 1000 * retry)
      retry  += 1
    }
  }
  return ""
}

function cbsDataCollectUnit(stockSymbol){
  Logger.log(stockSymbol + ' Handling')
  var stockInfoStr = CACHE.get(stockSymbol)
  if (stockInfoStr != null){
    var stockInfo = JSON.parse(stockInfoStr)
    stockInfo.cbsRanking = getCBSRanking(stockSymbol.replace('-', '.'))
    Logger.log(stockInfo.cbsRanking)
    stockSymbol = stockSymbol.split('-')[0] // In case some stock symbol might looks like RDS-A
    CACHE.put(stockSymbol, JSON.stringify(stockInfo), CACHELIFETIME)
  }else{
    Logger.log(stockSymbol + " data not found, Cannot start the CBS parsing!")
  }
}

function collectDataFromCBS(){
  // Check if market closed
  if(!checkifClosed()) return;
  
  var poolCache = CACHE.get("pool");
  Logger.log(poolCache)
  if (poolCache != null) {
    var poolLst = poolCache.split(',')
    while(poolLst[0] != ""){
      var stockSymbol = poolLst.pop()
      CACHE.put("pool", poolLst, CACHELIFETIME)
      cbsDataCollectUnit(stockSymbol)
      collectDataFromCBS()
      poolLst = [""]
    }
  }
}