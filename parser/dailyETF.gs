function getWeBullETFData(urlSymbol = 'nysearca-efa'){
  Logger.log("Handling: " + urlSymbol)
  var url = 'https://www.webull.com/zh/quote/' + urlSymbol;
  var retry = 1
  while(retry < 5){
    try{
      var xml = UrlFetchApp.fetch(url).getContentText();
      var etfInfo = {};
      
      etfInfo['tickerRTJSON'] = JSON.parse(xml.replace(/[\s\S]*?"tickerRT":({[\s\S]*?}),"newsData"[\s\S]*/, '$1'))
      etfInfo['symbol'] = etfInfo['tickerRTJSON'].symbol
      etfInfo['briefJSON'] = JSON.parse(xml.replace(/[\s\S]*?"fundBrief":([\s\S]*?),"structs"[\s\S]*/, '$1}'))
      
      var bonusBriefLst = xml.replace(/[\s\S]*?"bonusBrief":\[([\s\S]*?)\],"splitBrief"[\s\S]*/, '$1').replace(/},{/g, '},,{').split(',,')
      etfInfo['bonusBrief'] = etfJSONArrange(bonusBriefLst)
      
      if(xml.match(/"assetsAnalysis":\[([\s\S]*?)\]/)){
        var assetsStructureLst = xml.replace(/[\s\S]*?"assetsAnalysis":\[([\s\S]*?)\][\s\S]*/, '$1').replace(/},{/g, '},,{').split(',,')
        etfInfo['assetsStructure'] = etfJSONArrange(assetsStructureLst)
      }
      
      if(xml.match(/"ratioDistrs":\[[\s\S]*?\]/g)){
        var ratioDistrsLst = xml.replace(/[\s\S]*?"ratioDistrs":\[([\s\S]*?)\][\s\S]*/, '$1').replace(/},{/g, '},,{').split(',,')
        etfInfo['ratioDistrs'] = etfJSONArrange(ratioDistrsLst)
      }
      
      if(xml.match(/"frontDistrs":\[[\s\S]*?\]/g)){
        var frontDistrsLst = xml.replace(/[\s\S]*?"frontDistrs":\[([\s\S]*?)\][\s\S]*/, '$1').replace(/},{/g, '},,{').split(',,')
        etfInfo['frontDistrs'] = etfJSONArrange(frontDistrsLst)
      }
      Logger.log(etfInfo)
      ETFDataRecord(etfInfo)
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
  if(!checkifClosed()) return;
  Logger.log("Today Handling: " + JSON.stringify(ETF_LIST))
  var etfIndex = {}
  for (var catName in ETF_LIST){
    etfIndex[catName] = {}
    etfCatIndex = {}
    for(var i in ETF_LIST[catName]){
      var etfInfo = getWeBullETFData(urlSymbol = ETF_LIST[catName][i])
      try{
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
      }catch(e){
        Logger.log(e)
      }
    }
  }
  Logger.log(etfIndex)
  saveLog(JSON.stringify(etfIndex), "ETFIndex.txt", folder = LOGFILE)
  CACHE.put('etfIndex', JSON.stringify(etfIndex), CACHELIFETIME)
  return
}


function ETFDataRecord(etfInfo){
  Logger.log("Record Started")
  var fileName = etfInfo.symbol
  if(DriveApp.getFilesByName(fileName).hasNext()){
    var documentId = DriveApp.getFilesByName(fileName).next().getId()
    var etfDoc = SpreadsheetApp.openById(documentId);
  }else{
    var documentId = DriveApp.getFileById(ETF_TEMPLATE_ID).makeCopy(STOCKFILE).getId();
    DriveApp.getFileById(documentId).setName(fileName)
    var googleSymbol = (etfInfo.tickerRTJSON.disExchangeCode + ':' + etfInfo.symbol).toUpperCase()
    var etfDoc = SpreadsheetApp.openById(documentId);
    insertGoogleHisETFData(etfDoc, googleSymbol)
  }
  today = new Date();
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()).padStart(2, '0') + '日';
  var targetRow = onSearch(etfDoc, todayStr, searchTargetCol=0) 
  if(targetRow){
    targetRow += 1
    etfDoc.getRange('A' + targetRow + ':I' + targetRow).setValues([[todayStr, etfInfo['symbol'], JSON.stringify(etfInfo['tickerRTJSON']), JSON.stringify(etfInfo['briefJSON']), JSON.stringify(etfInfo['bonusBrief']), JSON.stringify(etfInfo['assetsStructure']), JSON.stringify(etfInfo['ratioDistrs']), JSON.stringify(etfInfo['frontDistrs']), etfInfo['tickerRTJSON'].close]]);
  }else{
    etfDoc.insertRowBefore(2);
    etfDoc.getRange('A2:I2').setValues([[todayStr, etfInfo['symbol'], JSON.stringify(etfInfo['tickerRTJSON']), JSON.stringify(etfInfo['briefJSON']), JSON.stringify(etfInfo['bonusBrief']), JSON.stringify(etfInfo['assetsStructure']), JSON.stringify(etfInfo['ratioDistrs']), JSON.stringify(etfInfo['frontDistrs']), etfInfo['tickerRTJSON'].close]]);
  }
}


function etfJSONArrange(lst){
  if(lst.length==1){return}
  var finalObj = {}
  var keys = Object.keys(JSON.parse(lst[0]))
  for(key_no in keys){
    finalObj[keys[key_no]] = new Array
  }
  for(i in lst){
    var jsonObj = JSON.parse(lst[i])
    for(key_no in keys){
      finalObj[keys[key_no]].push(jsonObj[keys[key_no]])
    }
  }
  return finalObj
}