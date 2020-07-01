function ValuationLine(){
  var lst = ['hlf', 'luv', 'lmt', 'baba', 'iipr', 'twtr', 'arjd', 'psx', 'mrk', 'nsc', 'unp', 'csx', 'keys', 'flir']
  for(i in lst){
    try{
      calculateFreeCashFlowValuation(lst[i])
    }catch(e){
      Logger.log("Valuation Failed: " + lst[i])
    }
  }
}

function calculateFreeCashFlowValuation(symbol='mu'){
  var financialReportSheet = SpreadsheetApp.openById(FINANCIALREPORTSSHEET_ID)
  var year = new Date().getFullYear()
  var month = String(new Date().getMonth() + 1).padStart(2, '0')
  var i = 0, profitMargin = [], FCFtoProfitMargin = [], factor = {}
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
      factor.perpetualGrowthRate = Math.min(0.025, forecastData[5])
      factor.thisYearRevenue = forecastData[6]
      factor.nextYearRevenue = forecastData[7]
  }else{
    Logger.log("Cannot find financial forecast data: " + uuid)
  }
  var futureRevenue = [factor.thisYearRevenue, factor.nextYearRevenue, factor.nextYearRevenue*(1+factor.growthRate), factor.nextYearRevenue*(1+factor.growthRate)**2]
  var futureProfit = futureRevenue.map(item=> item*factor.avgProfitMargin)
  var futureFCF = futureProfit.map(item=> item*factor.avgFCFtoProfitMargin)
  futureFCF.push(futureFCF[futureFCF.length-1]*(1+factor.perpetualGrowthRate)/(factor.wacc - factor.perpetualGrowthRate))
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
  var url = 'https://www.gurufocus.com/term/wacc/' + symbol + '/WACC-Percentage'
  var xml = UrlFetchApp.fetch(url).getContentText();
  var waccXml = xml.match(/is <strong>[\s\S]*?<\/strong>/g).slice(0,2)
  data.wacc = waccXml[0].replace(/is <strong>([\s\S]*?)<\/strong>/, '$1')
  data.roic = waccXml[1].replace(/is <strong>([\s\S]*?)<\/strong>/, '$1')
  recordValuation(symbol.replace('.', '-'), data)
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
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()).padStart(2, '0') + '日';
  var targetRow = onSearch(stockDoc, todayStr, searchTargetCol=0)
  if(targetRow){
    targetRow += 1
    stockDoc.getRange('Y' + targetRow + ':Z' + targetRow).setValues([[
      data.wacc, data.roic
    ]]);
    stockDoc.getRange('Y1:Z1').setValues([[
      'WACC', 'ROIC'
    ]]);
  }else{
    Logger.log('Cannot find original record of that day in ' + symbol)
  }
}

function dailyGuruFocus(){
  for(var cat in STOCK_SYMBOLS){
    for(var stockNo in STOCK_SYMBOLS[cat]){
      var symbol = STOCK_SYMBOLS[cat][stockNo].split(/-(.+)/)[1].replace('-', '.')
      let sleepDurationSec = 0.5
      let retry = 0
      while(retry < 3){
        try{
          Logger.log("Handling: " + symbol)
          getGuruFocusData(symbol)
          break
        }catch(e){
          Logger.log(e)
          Logger.log(symbol + " : CBS parse failed " + retry)
          Utilities.sleep(sleepDurationSec * 1000 * retry)
          retry  += 1
        }
      }
    }
  }
}