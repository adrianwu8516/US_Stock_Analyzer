function getCBSRanking(stockName){
  // CBS does not support financial companise
  if(CBSMUSTFAIL.includes(stockName)) return ""
  
  var retry = 1
  while(retry < 6){
    try{
      var signalUrl = "https://caibaoshuo.com/companies/" + stockName + "/cbs_signal"
      var xml = UrlFetchApp.fetch(signalUrl).getContentText();
      xml = xml.match(/<table class="table table-hover"([\s\S]*?)<\/table>/gm)
      var document = XmlService.parse(xml);
      signal = document.getRootElement().getChildren('tbody')[0].getChildren('tr')[0].getChildren('td')[1].getText().replace(/\n +/g, '')
      return signal
    }catch(e){
      Logger.log(e)
      Logger.log(stockName + " : CBS parse failed " + retry)
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