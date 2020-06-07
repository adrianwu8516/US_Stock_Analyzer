function addGoogleDataToAllExistedFiles(){
  for(var catName in STOCK_SYMBOLS){
    for(var i in STOCK_SYMBOLS[catName]){
      var symbol = STOCK_SYMBOLS[catName][i]
      Logger.log(symbol)
      supplementForStock(symbol)
    }
  }
}

function supplementForStock(symbol) {
  var googleSymbol = symbol.replace('-', ':').toUpperCase()
  var fileName = symbol.split('-')[1]
  if(DriveApp.getFilesByName(fileName).hasNext()){
    var file = DriveApp.getFilesByName(fileName).next()
    var stockDoc = SpreadsheetApp.openById(file.getId());
    
    // Search and Destroy Problematic Rows
    removeProblematicDateInfo(stockDoc, '2020年04月06日')
    removeProblematicDateInfo(stockDoc, '2020年04月05日')
    
    // Insert
    insertGoogleHisData(stockDoc, googleSymbol)
    
    // Insert New Column Name
    stockDoc.getRange("A1:Z1").setValues([["日期", "代號", "公司名稱", "交易所", "目前價格", "今天漲跌（％）", "市值", "市淨率", "分析師評價", "分析師關注度", "分析師高價", "分析師均價", "分析師低價", "52週最高價", "52週最低價", "CBS評等", "tickerRT", "rating", "targetPrice", "forecastEps", "當日最高", "當日最低", "開盤", "成交量", "EPS", "Beta"]])
  }
}

function insertGoogleHisData(stockDoc, googleSymbol){
  //    var endDate = file.getDateCreated()
  //    var endDateString = "DATE(" + endDate.getFullYear() + "," + (endDate.getMonth() + 1) + "," + endDate.getDate() + ")"
  var sheet = SpreadsheetApp.openById("1CXyvcYPu9xGg7KlWwaIJskXMQd5pZArm6dS5h5TmhiI").getSheetByName("Operation") // Should be able to open a new temp sheet
  //    sheet.getRange(1,1).setFormula('=GoogleFinance("' + googleSymbol + '","high",DATE(2000,1,1),' + endDateString + ',1)')
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
    var removeIndex = hisDate.findIndex(element => element == '2020年05月15日')
    hisDate.splice(removeIndex, 1)
    hisOpen.splice(removeIndex, 1)
    hisHigh.splice(removeIndex, 1)
    hisLow.splice(removeIndex, 1)
    hisPrice.splice(removeIndex, 1)
    hisVolume.splice(removeIndex, 1)
    
    // Insert and Replace Original Data with Google Version
    stockDoc.getRange("A2:A" + (hisDate.length+1)).setValues(hisDate)
    stockDoc.getRange("E2:E" + (hisPrice.length+1)).setValues(hisPrice)
    stockDoc.getRange("U2:U" + (hisHigh.length+1)).setValues(hisHigh)
    stockDoc.getRange("V2:V" + (hisLow.length+1)).setValues(hisLow)
    stockDoc.getRange("W2:W" + (hisOpen.length+1)).setValues(hisOpen)
    stockDoc.getRange("X2:X" + (hisVolume.length+1)).setValues(hisVolume)
  }catch(e){
    Logger.log(e)
  }
  return
}

function removeProblematicDateInfo(stockDoc, dateStr){
  var OriginalDateList = stockDoc.getRange("A:A").getValues()
  var prob = OriginalDateList.findIndex(e => e[0] == dateStr) + 1
  if(prob) {Logger.log(stockDoc.getRange(prob+":"+prob).getValues()); stockDoc.deleteRow(prob)}
  return
}