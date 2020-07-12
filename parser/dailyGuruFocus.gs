function ValuationLine(){
  var lst = ['hlf', 'luv', 'lmt', 'baba', 'iipr', 'twtr', 'arjd', 'psx', 'mrk', 'nsc', 'unp', 'csx', 'keys', 'flir', 'gwph', 'vnet', 'fb', 'fsly', 'noc', 'rds-a', 'ual', 'drrx']
  for(i in lst){
    try{
      calculateFreeCashFlowValuation(lst[i])
    }catch(e){
      Logger.log("Valuation Failed: " + lst[i])
    }
  }
}

function calculateFreeCashFlowValuation(symbol='hlf'){
  var financialReportSheet = SpreadsheetApp.openById(FINANCIALREPORTSSHEET_ID)
  var year = new Date().getFullYear()
  var month = String(new Date().getMonth() + 1).padStart(2, '0')
  var i = 1, profitMargin = [], FCFtoProfitMargin = [], factor = {}
  while(i < 5){
    var uuid = symbol + '-' + String(year-i)
    var targetRow = onSearch(financialReportSheet, uuid, searchTargetCol=0)
    if(targetRow){
      targetRow += 1
      var FS = financialReportSheet.getSheetValues(targetRow, 7, 1, 1)[0][0]
      var CF = financialReportSheet.getSheetValues(targetRow, 8, 1, 1)[0][0]
      if(!(FS=="") && !(CF=="")){
        
        profitMargin.push(JSON.parse(FS)['淨利潤率%'])
        FCFtoProfitMargin.push(JSON.parse(CF)['自由現金流'] / JSON.parse(FS)['淨利潤'])
      }
    }else{
      Logger.log("Cannot find financial report data: " + uuid)
    }
    i += 1
  }
  factor.avgProfitMargin = Sum(profitMargin)/profitMargin.length
  factor.avgFCFtoProfitMargin = Sum(FCFtoProfitMargin)/FCFtoProfitMargin.length

  if(DriveApp.getFilesByName(symbol).hasNext()){
    var documentId = DriveApp.getFilesByName(symbol).next().getId()
    var stockDoc = SpreadsheetApp.openById(documentId);
    factor.wacc = stockDoc.getSheetValues(2, 25, 1, 1)[0][0]
    factor.currentPrice = stockDoc.getSheetValues(2, 5, 1, 1)[0][0]
    factor.outstandingShares = JSON.parse(stockDoc.getSheetValues(2, 17, 1, 1)[0][0]).outstandingShares
  }else{
    Logger.log('Cannot find original record sheet of ' + symbol)
  }
  
  var forecastingSheet = SpreadsheetApp.openById('17enM_BO-EHxOr2sGl61umgNdXlfFZjdKsKlf2vA0hgE')
  var uuid = String(year) + '-' + month + '-' + symbol 
  var targetRow = onSearch(forecastingSheet, uuid, searchTargetCol=0)
  if(targetRow){
      targetRow += 1
      var forecastData = forecastingSheet.getSheetValues(targetRow, 4, 1, 8)[0]
      factor.growthRate = Math.min((forecastData[1] + forecastData[3])/2, forecastData[5])
      factor.perpetualGrowthRate = 0.025 //Math.min(0.025, forecastData[5])
      factor.thisYearRevenue = forecastData[6]
      factor.nextYearRevenue = forecastData[7]
  }else{
    Logger.log("Cannot find financial forecast data: " + uuid)
  }
  Logger.log(factor)
  var futureRevenue = [factor.thisYearRevenue, factor.nextYearRevenue, factor.nextYearRevenue*(1+factor.growthRate), factor.nextYearRevenue*(1+factor.growthRate)**2]
  var futureProfit = futureRevenue.map(item=> item*factor.avgProfitMargin)
  var futureFCF = futureProfit.map(item=> item*factor.avgFCFtoProfitMargin)
  futureFCF.push(futureFCF[futureFCF.length-1]*(1+factor.perpetualGrowthRate)/(factor.wacc - factor.perpetualGrowthRate))
  Logger.log(futureFCF)
  let PVfutureFCF = 0
  for(var i=0; i<futureFCF.length; i++){
    PVfutureFCF += futureFCF[i] / ((1+factor.wacc) ** (i+1))
  }
  var fareValueofEquity = PVfutureFCF / factor.outstandingShares * 1000000 // revenue in Million
  Logger.log('====== Stock: ' + symbol + '======')
  Logger.log('fareValueofEquity: ' + fareValueofEquity)
  Logger.log('currentPrice: ' + factor.currentPrice)
}

function getGuruFocusData(symbol) {
  var data = {}
  let url = 'https://www.gurufocus.com/term/wacc/' + symbol + '/WACC-Percentage'
  let xml = UrlFetchApp.fetch(url).getContentText();
  var waccXml = xml.match(/is <strong>[\s\S]*?<\/strong>/g).slice(0,2)
  data.wacc = parseFloat(waccXml[0].replace(/is <strong>([\s\S]*?)<\/strong>/, '$1'))/100
  data.roic = parseFloat(waccXml[1].replace(/is <strong>([\s\S]*?)<\/strong>/, '$1'))/100
  
  url = 'https://www.gurufocus.com/term/zscore/' + symbol + '/Altman-Z-Score'
  xml = UrlFetchApp.fetch(url).getContentText();
  data.zscore = parseFloat(xml.replace(/[\s\S]*Altman Z-Score of ([\s\S]*) as of today[\s\S]*/, '$1'))
  
  url = 'https://www.gurufocus.com/term/mscore/' + symbol + '/Beneish-M-Score'
  xml = UrlFetchApp.fetch(url).getContentText();
  data.mscore = parseFloat(xml.replace(/[\s\S]*Beneish M-Score of ([\s\S]*) as of today[\s\S]*/, '$1'))
  
  url = 'https://www.gurufocus.com/term/fscore/' + symbol + '/Piotroski-F-Score'
  xml = UrlFetchApp.fetch(url).getContentText();
  data.fscore = parseFloat(xml.replace(/[\s\S]*Piotroski F-Score of ([\s\S]*) as of today[\s\S]*/, '$1'))
  
  url = 'https://www.gurufocus.com/term/ev2ebitda/' + symbol + '/EV-to-EBITDA'
  xml = UrlFetchApp.fetch(url).getContentText();
  if(xml.replace(/[\s\S]*EV-to-EBITDA of ([\s\S]*) as of today[\s\S]*/, '$1')==''){
    data.ev2ebitdaLow = NaN
    data.ev2ebitdaMid = NaN
    data.ev2ebitdaHigh = NaN
    data.ev2ebitdaNow = NaN
  }else{
    var ev2ebitda = xml.replace(/[\s\S]*<strong>Min([\s\S]*?)<\/strong>[\s\S]*/, '$1').split(':').map(item => parseFloat(item))
    data.ev2ebitdaLow = ev2ebitda[1]
    data.ev2ebitdaMid = ev2ebitda[2]
    data.ev2ebitdaHigh = ev2ebitda[3]
    data.ev2ebitdaNow = ev2ebitda[4]
  }
    
  url = 'https://www.gurufocus.com/term/buyback_yield/' + symbol + '/Buyback-Yield-Percentage'
  xml = UrlFetchApp.fetch(url).getContentText();
  data.buyback_yield = parseFloat(xml.replace(/[\s\S]*Buyback Yield % of ([\s\S]*) as of today[\s\S]*/, '$1'))
  
  url = 'https://www.gurufocus.com/term/iv_dcf_share/' + symbol + '/Intrinsic-Value:-Projected-FCF'
  xml = UrlFetchApp.fetch(url).getContentText();
  data.iv_dcf_share = parseFloat(xml.replace(/[\s\S]*FCF of \$?([\s\S]*) as of today[\s\S]*/, '$1'))
  
  url = 'https://www.gurufocus.com/term/iv_dcf/' + symbol + '/Intrinsic-Value:-DCF-(FCF-Based)'
  xml = UrlFetchApp.fetch(url).getContentText();
  data.iv_dcf = parseFloat(xml.replace(/[\s\S]*DCF \(FCF Based\) of \$?([\s\S]*) as of today[\s\S]*/, '$1'))
  
  url = 'https://www.gurufocus.com/term/grahamnumber/' + symbol + '/Graham-Number'
  xml = UrlFetchApp.fetch(url).getContentText();
  data.grahamnumber = parseFloat(xml.replace(/[\s\S]*Graham Number of \$?([\s\S]*) as of today[\s\S]*/, '$1'))
  
  url = 'https://www.gurufocus.com/term/lynchvalue/' + symbol + '/Peter-Lynch-Fair-Value'
  xml = UrlFetchApp.fetch(url).getContentText();
  data.lynchvalue = parseFloat(xml.replace(/[\s\S]*Peter Lynch Fair Value of \$?([\s\S]*) as of today[\s\S]*/, '$1'))
  
  url = 'https://www.gurufocus.com/term/medpsvalue/' + symbol + '/Median-PS-Value'
  xml = UrlFetchApp.fetch(url).getContentText();
  data.medpsvalue = parseFloat(xml.replace(/[\s\S]*Median PS Value of \$?([\s\S]*) as of today[\s\S]*/, '$1'))
  
  url = 'https://www.gurufocus.com/term/p2tangible_book/' + symbol + '/Price-to-Tangible-Book'
  xml = UrlFetchApp.fetch(url).getContentText();
  if(xml.replace(/[\s\S]*Price-to-Tangible-Book of ([\s\S]*) as of today[\s\S]*/, '$1')==''){
    data.p2tangible_bookLow = NaN
    data.p2tangible_bookMid = NaN
    data.p2tangible_bookHigh = NaN
    data.p2tangible_bookNow = NaN
  }else{
    var p2tangible_book = xml.replace(/[\s\S]*<strong>Min([\s\S]*?)<\/strong>[\s\S]*/, '$1').split(':').map(item => parseFloat(item))
    data.p2tangible_bookLow = p2tangible_book[1]
    data.p2tangible_bookMid = p2tangible_book[2]
    data.p2tangible_bookHigh = p2tangible_book[3]
    data.p2tangible_bookNow = p2tangible_book[4]
  }
  Logger.log(data)
  CACHE.put(symbol+'-Guru', JSON.stringify(data), CACHELIFETIME)
}

function recordValuation(symbol, data){
  var fileName = symbol
  if(DriveApp.getFilesByName(fileName).hasNext()){
    var documentId = DriveApp.getFilesByName(fileName).next().getId()
    var stockDoc = SpreadsheetApp.openById(documentId);
  }else{
    Logger.log('Cannot find original record sheet of ' + symbol)
  }
  today = new Date();
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()-1).padStart(2, '0') + '日';
  var targetRow = onSearch(stockDoc, todayStr, searchTargetCol=0)
  if(targetRow){
    targetRow += 1
    stockDoc.getRange('Y' + targetRow + ':AQ' + targetRow).setValues([[
      data.wacc, data.roic, data.zscore, data.mscore, data.fscore, data.ev2ebitdaLow, data.ev2ebitdaMid, data.ev2ebitdaHigh, data.ev2ebitdaNow, 
      data.buyback_yield, data.iv_dcf_share, data.iv_dcf, data.grahamnumber, data.lynchvalue, data.medpsvalue,
      data.p2tangible_bookLow, data.p2tangible_bookMid, data.p2tangible_bookHigh, data.p2tangible_bookNow
    ]]);
    // For new stocks
    stockDoc.getRange('Y1:AQ1').setValues([['WACC', 'ROIC', "ZScore", "MScore", "FScore", "ev2ebitdaLow", "ev2ebitdaMid", "ev2ebitdaHigh", "ev2ebitdaNow", "buyback_yield", "iv_dcf_share", "iv_dcf", "GrahamNumber", "LynchValue", "MedPSValue", "p2tangible_bookLow", 'p2tangible_bookMid', 'p2tangible_bookHigh', 'p2tangible_bookNow']])
    stockDoc.getRange('Y2:AQ2').setNumberFormats([['0.00%', '0.00%', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00%', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00']])
  }else{
    Logger.log('Cannot find original record of that day in ' + symbol)
  }
}

function dailyGuruFocus(){
  // Check if market closed
  if(!checkifClosed()) return;
  for(var cat in STOCK_SYMBOLS){
    for(var stockNo in STOCK_SYMBOLS[cat]){
      var symbol = STOCK_SYMBOLS[cat][stockNo].split(/-(.+)/)[1].replace('-', '.')
      let sleepDurationSec = 0.5
      let retry = 0
      while(retry < 2){
        try{
          if(!(CACHE.get(symbol+'-Guru'))){
            Logger.log("Handling: " + symbol)
            getGuruFocusData(symbol)
          }
          break
        }catch(e){
          Logger.log(e)
          Logger.log(symbol + " : Gurufocus parse failed " + retry)
          Utilities.sleep(sleepDurationSec * 1000 * retry)
          retry  += 1
        }
      }
    }
  }
}

function dailyGuruFocusRecord(){
  // Check if market closed
  //if(!checkifClosed()) return;
  for(var cat in STOCK_SYMBOLS){
    for(var stockNo in STOCK_SYMBOLS[cat]){
      var symbol = STOCK_SYMBOLS[cat][stockNo].split(/-(.+)/)[1].replace('-', '.')
      let sleepDurationSec = 0.5
      let retry = 0
      while(retry < 2){
        try{
          Logger.log("Recording: " + symbol)
          var data = CACHE.get(symbol+'-Guru');
          if(data!=null){
            Logger.log(data)
            recordValuation(symbol.replace('.', '-'), JSON.parse(data))
          }else{
            Logger.log(symbol + " : Cannot find record target")
          }
          break
        }catch(e){
          Logger.log(e)
          Logger.log(symbol + " : Gurufocus record failed " + retry)
          Utilities.sleep(sleepDurationSec * 1000 * retry)
          retry  += 1
        }
      }
    }
  }
}