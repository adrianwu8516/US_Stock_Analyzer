function addGoogleDataToAllExistedFiles(){
  for(var catName in STOCK_SYMBOLS){
    for(var i in STOCK_SYMBOLS[catName]){
      var symbol = STOCK_SYMBOLS[catName][i]
      Logger.log(symbol)
      supplementForStock(symbol)
      //fixingDateData(symbol, dateStr = '2020年06月12日')
    }
  }
}

function supplementForStock(googleSymbol='NIU') {
  //var googleSymbol = symbol.replace('-', ':').toUpperCase()
  //var fileName = symbol.split('-')[1]
  var fileName = googleSymbol
  if(DriveApp.getFilesByName(fileName).hasNext()){
    var file = DriveApp.getFilesByName(fileName).next()
    var stockDoc = SpreadsheetApp.openById(file.getId());
    
    // Search and Destroy Problematic Rows
    //removeProblematicDateInfo(stockDoc, '2020年04月06日')
    //removeProblematicDateInfo(stockDoc, '2020年04月05日')
    
    // Insert
    insertGoogleHisData(stockDoc, googleSymbol)
    
    // Insert New Column Name
    //stockDoc.getRange("A1:X1").setValues([["日期", "代號", "公司名稱", "交易所", "目前價格", "今天漲跌（％）", "市值", "市淨率", "分析師評價", "分析師關注度", "分析師高價", "分析師均價", "分析師低價", "52週最高價", "52週最低價", "CBS評等", "tickerRT", "rating", "targetPrice", "forecastEps", "當日最高", "當日最低", "開盤", "成交量"]])
  }
}

function insertGoogleHisData(stockDoc, googleSymbol){
  var sheet = SpreadsheetApp.openById("1CXyvcYPu9xGg7KlWwaIJskXMQd5pZArm6dS5h5TmhiI").getSheetByName("Operation") // Should be able to open a new temp sheet
  sheet.getRange(1,1).setFormula('=GoogleFinance("' + googleSymbol + '","all",DATE(1995,1,1),today(),1)')
  
  var length = sheet.getRange("A1:A").getValues().filter(String).length
  try{
    var hisDate = [], hisOpen = [], hisHigh = [], hisLow = [], hisPrice = [], hisVolume = []
    sheet.getRange("A2:A"+length).getValues().forEach(date => hisDate.unshift([date[0].getFullYear() + "年" + String(date[0].getMonth() + 1).padStart(2, '0') + "月" + String(date[0].getDate()).padStart(2, '0') + "日"]))
    sheet.getRange("B2:B"+length).getValues().forEach(e => hisOpen.unshift([e]))
    sheet.getRange("C2:C"+length).getValues().forEach(e => hisHigh.unshift([e]))
    sheet.getRange("D2:D"+length).getValues().forEach(e => hisLow.unshift([e]))
    sheet.getRange("E2:E"+length).getValues().forEach(e => hisPrice.unshift([e]))
    sheet.getRange("F2:F"+length).getValues().forEach(e => hisVolume.unshift([e]))
    // Search and Destroy Problematic Rows
    //var removeIndex = hisDate.findIndex(element => element == '2020年05月15日')
    //hisDate.splice(removeIndex, 1)
    //hisOpen.splice(removeIndex, 1)
    //hisHigh.splice(removeIndex, 1)
    //hisLow.splice(removeIndex, 1)
    //hisPrice.splice(removeIndex, 1)
    //hisVolume.splice(removeIndex, 1)
    
    // Insert and Replace Original Data with Google Version
    Logger.log(hisDate)
    Logger.log(hisPrice)
    stockDoc.getRange("A3:A" + (hisDate.length+2)).setValues(hisDate)
    stockDoc.getRange("E3:E" + (hisPrice.length+2)).setValues(hisPrice)
    stockDoc.getRange("U3:U" + (hisHigh.length+2)).setValues(hisHigh)
    stockDoc.getRange("V3:V" + (hisLow.length+2)).setValues(hisLow)
    stockDoc.getRange("W3:W" + (hisOpen.length+2)).setValues(hisOpen)
    stockDoc.getRange("X3:X" + (hisVolume.length+2)).setValues(hisVolume)
  }catch(e){
    Logger.log(e)
  }
  return
}


function addGoogleDataToAllExistedETFFiles(){
  for(var catName in ETF_LIST){
    for(var i in ETF_LIST[catName]){
      var symbol = ETF_LIST[catName][i]
      var fileName = symbol.split('-')[1]
      var file = DriveApp.getFilesByName(fileName).next()
      var etfDoc = SpreadsheetApp.openById(file.getId());
      var googleSymbol = symbol.replace('-', ':').toUpperCase()
      Logger.log(googleSymbol)
      insertGoogleHisETFData(etfDoc, googleSymbol)
    }
  }
}


function insertGoogleHisETFData(etfDoc, googleSymbol){
  var sheet = SpreadsheetApp.openById("1CXyvcYPu9xGg7KlWwaIJskXMQd5pZArm6dS5h5TmhiI").getSheetByName("Operation") // Should be able to open a new temp sheet
  sheet.getRange(1,1).setFormula('=GoogleFinance("' + googleSymbol + '","close",DATE(1995,1,1),today(),1)')
  
  var length = sheet.getRange("A1:A").getValues().filter(String).length
  try{
    var hisDate = [], hisPrice = []
    sheet.getRange("A2:A"+length).getValues().forEach(date => hisDate.unshift([date[0].getFullYear() + "年" + String(date[0].getMonth() + 1).padStart(2, '0') + "月" + String(date[0].getDate()).padStart(2, '0') + "日"]))
    sheet.getRange("B2:B"+length).getValues().forEach(e => hisPrice.unshift([e]))

    etfDoc.getRange("A3:A" + (hisDate.length+2)).setValues(hisDate)
    etfDoc.getRange("I3:I" + (hisPrice.length+2)).setValues(hisPrice)
    
    etfDoc.getRange("A1:I1").setValues([["日期", "代號", "tickerRTJSON", "briefJSON", "bonusBrief", "assetsStructure", "ratioDistrs", "frontDistrs", "Price"]])
  }catch(e){
    Logger.log(e)
  }

}

function removeProblematicDateInfo(stockDoc, dateStr){
  var OriginalDateList = stockDoc.getRange("A:A").getValues()
  var prob = OriginalDateList.findIndex(e => e[0] == dateStr) + 1
  if(prob) {Logger.log(stockDoc.getRange(prob+":"+prob).getValues()); stockDoc.deleteRow(prob)}
  return
}


function fixingDateData(symbol='nyse-ups', dateStr = '2020年06月12日'){
  var fileName = symbol.split('-')[1]
  if(DriveApp.getFilesByName(fileName).hasNext()){
    var file = DriveApp.getFilesByName(fileName).next()
    var stockDoc = SpreadsheetApp.openById(file.getId());
    var targetRow = onSearch(stockDoc, dateStr, searchTargetCol=0)
    if(targetRow){
      var yest = stockDoc.getRange('A' + (targetRow+2) + ':T' + (targetRow+2)).getValues()
      var today = stockDoc.getRange('A' + (targetRow+1) + ':T' + (targetRow+1)).getValues()
      var todayPrice = today[0][4]
      var yestPrice = yest[0][4]
      var yestValue = yest[0][6]
      var yestPb = yest[0][7]
      yest[0][0] = dateStr
      yest[0][2] = LanguageApp.translate(yest[0][2], 'zh-CN', 'zh-TW')
      yest[0][4] = today[0][4]
      yest[0][5] = Math.round((todayPrice - yestPrice)/yestPrice * 10000)/100 + '%'
      yest[0][6] = yestValue/yestPrice*todayPrice
      yest[0][7] = Math.round(yestPb/yestPrice*todayPrice * 100)/100
      stockDoc.getRange('A' + (targetRow+1) + ':T' + (targetRow+1)).setValues(yest)
    }
  }
}