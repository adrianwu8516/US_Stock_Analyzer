function getWeBullETFData(urlSymbol = 'nasdaq-tlt'){
  Logger.log("Handling: " + urlSymbol)
  var url = 'https://www.webull.com/zh/quote/' + urlSymbol;
  var retry = 1
  while(retry < 3){
    try{
      var xml = UrlFetchApp.fetch(url).getContentText();
      
      var xmlTickerRT = xml.match(/tickerRT:({[\s\S]*?}),newsData/)[0].replace(/tickerRT:({[\s\S]*?}),newsData/, '$1')                 
      var tickerRTJSON = JSON.parse(xmlTickerRT.replace(/:-*\./g, ':0.').replace(/{([\s\S]*?):/g, '{"\$1\":').replace(/,([a-zA-z0-9]*?):/g, ',"\$1\":'))
      
      var xmlBrief = xml.match(/fundBrief:[\s\S]*?,structs/g)[0]
      var briefJSON = JSON.parse(xmlBrief.replace(/fundBrief:([\s\S]*?),structs/g, '$1}').replace(/{([\s\S]*?):/g, '{"\$1\":').replace(/,([a-zA-z0-9]*?):/g, ',"\$1\":'))
      
      var bonusBrief = xml.match(/bonusBrief:\[[\s\S]*?\]/g)[0].replace(/bonusBrief:\[([\s\S]*?)\]/g, '$1').replace(/{([\s\S]*?):/g, '{"\$1\":').replace(/,([a-zA-z0-9]*?):/g, ',"\$1\":').replace('},{', '}||{').split('||')
      
      var assetsStructure = xml.match(/assetsAnalysis:\[[\s\S]*?\]/g)[0].replace(/assetsAnalysis:\[([\s\S]*?)\]/g, '$1').replace(/{([\s\S]*?):/g, '{"\$1\":').replace(/,([a-zA-z0-9]*?):/g, ',"\$1\":').replace('},{', '}||{').split('||')
      
      if(xml.match(/ratioDistrs:\[[\s\S]*?\]/g)){
        var ratioDistrs = xml.match(/ratioDistrs:\[[\s\S]*?\]/g)[0].replace(/ratioDistrs:\[([\s\S]*?)\]/g, '$1').replace(/{([\s\S]*?):/g, '{"\$1\":').replace(/,([a-zA-z0-9]*?):/g, ',"\$1\":').replace('},{', '}||{').split('||')
      }else{
        var ratioDistrs = ''
      }
      
      if(xml.match(/frontDistrs:\[[\s\S]*?\]/g)){
        var frontDistrs = xml.match(/frontDistrs:\[[\s\S]*?\]/g)[0].replace(/frontDistrs:\[([\s\S]*?)\]/g, '$1').replace(/{([\s\S]*?):/g, '{"\$1\":').replace(/,([a-zA-z0-9]*?):/g, ',"\$1\":').replace('},{', '}||{').split('||')
      }else{
        var frontDistrs = ''
      }

      var etfInfo = {};
      etfInfo['symbol'] = tickerRTJSON.symbol
      etfInfo['tickerRTJSON'] = tickerRTJSON
      etfInfo['briefJSON'] = briefJSON
      etfInfo['bonusBrief'] = bonusBrief
      etfInfo['assetsStructure'] = assetsStructure
      etfInfo['ratioDistrs'] = ratioDistrs
      etfInfo['frontDistrs'] = frontDistrs      
      return etfInfo
    }catch(e){
      Logger.log(e)
      Logger.log(urlSymbol + " : WeBull parse failed " + retry)
      retry += 1
    }
  }
}

function collectETFDataFromWeBull(){
  // Check if market closed
  //if(!checkifClosed()) return;
  Logger.log("Today Handling: " + JSON.stringify(ETF_LIST))
  var etfIndex = {}
  for (var catNo in ETFCATLIST){
    var catName = ETFCATLIST[catNo]
    etfIndex[catName] = {}
    etfCatIndex = {}
    for(var i in ETF_LIST[catName]){
      var etfInfo = getWeBullETFData(urlSymbol = ETF_LIST[catName][i])
      ETFDataRecord(etfInfo)
      etfIndex[catName][ETF_LIST[catName][i]] = {
        'name': etfInfo.tickerRTJSON.name,
        'changeRatio': etfInfo.tickerRTJSON.changeRatio,
        'rating': etfInfo.tickerRTJSON.rating,
        'symbol': etfInfo.tickerRTJSON.symbol,
        'close': etfInfo.tickerRTJSON.close,
        'beta3Y': etfInfo.tickerRTJSON.beta3Y,
        'dividend': etfInfo.tickerRTJSON.dividend,
        'returnThisYear': etfInfo.tickerRTJSON.returnThisYear,
        'yield1Y': etfInfo.tickerRTJSON.yield1Y,
      }
    }
  }
  Logger.log(etfIndex)
  saveLog(JSON.stringify(etfIndex), "ETFIndex.txt", folder = ETFFILE)
  CACHE.put('etfIndex', JSON.stringify(etfIndex), CACHELIFETIME)
  return
}


function ETFDataRecord(etfInfo){
  var fileName = etfInfo['symbol']
  if(DriveApp.getFilesByName(fileName).hasNext()){
    Logger.log("Found")
    var documentId = DriveApp.getFilesByName(fileName).next().getId()
  }else{
    Logger.log("New File")
    var documentId = DriveApp.getFileById(ETF_TEMPLATE_ID).makeCopy(ETFFILE).getId();
    DriveApp.getFileById(documentId).setName(fileName)
  }
  Logger.log(documentId)
  var etfDoc = SpreadsheetApp.openById(documentId);
  today = new Date();
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()).padStart(2, '0') + '日';
  var targetRow = onSearch(etfDoc, todayStr, searchTargetCol=0) 
  if(targetRow){
    targetRow += 1
    etfDoc.getRange('A' + targetRow + ':H' + targetRow).setValues([[todayStr, etfInfo['symbol'], etfInfo['tickerRTJSON'], etfInfo['briefJSON'], etfInfo['bonusBrief'], etfInfo['assetsStructure'], etfInfo['ratioDistrs'], etfInfo['frontDistrs']]]);
  }else{
    etfDoc.insertRowBefore(2);
    etfDoc.getRange('A2:H2').setValues([[todayStr, etfInfo['symbol'], etfInfo['tickerRTJSON'], etfInfo['briefJSON'], etfInfo['bonusBrief'], etfInfo['assetsStructure'], etfInfo['ratioDistrs'], etfInfo['frontDistrs']]]);
  }
}
