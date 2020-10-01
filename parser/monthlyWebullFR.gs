function monthlyWebullFRDataGroup1(){
  getWebullFRData(groupNo=0)
}

function monthlyWebullFRDataGroup2(){
  getWebullFRData(groupNo=1)
}

function getWebullFRData(groupNo) {
  var dataPackage = {"quarterly":{}, "yearly":{}} // dataPackage > quarterly > nasdaq-omab > date > cf/bs/is 
  for (var catName in STOCK_SYMBOLS){
    for(var i in STOCK_SYMBOLS[catName]){
      if(i%2==groupNo){
        var symbol = STOCK_SYMBOLS[catName][i]
        Logger.log(symbol)
        dataPackage.quarterly[symbol] = {}
        dataPackage.yearly[symbol] = {}
        dataPackage = webullFRDataDetailProcessing(dataPackage, symbol, type='cash-flow')
        dataPackage = webullFRDataDetailProcessing(dataPackage, symbol, type='balance-sheet')
        dataPackage = webullFRDataDetailProcessing(dataPackage, symbol, type='income-statement')
      }else{
        continue
      }
    }
  }
  weBullFRDataRecorder(dataPackage)
}

function webullFRDataDetailProcessing(dataPackage, symbol, type){
  var url = 'https://www.webull.com/' + type + '/' + symbol
  Logger.log(url)
  let sleepDurationSec = 0.5
  let retry = 0
  while(retry < 3){
    try{
      var xml = UrlFetchApp.fetch(url).getContentText();
      var xmlRaw = xml.replace(/[\s\S]*?datas:\[([\s\S]*?})\][\s\S]*/g, '$1')
      var dataLst = xmlRaw.match(/({currencyName[\s\S]*?}}})/g).map(item => JSON.parse(item.replace(/{[\s\S]*?rows:{}},/g, '').replace(/:-*\./g, ':0.').replace(/{([\s\S]*?):/g, '{"$1":').replace(/,([a-zA-z0-9]*?):/g, ',"$1":')))
      for(var i in dataLst){
        if(dataLst[i].reportType == 2){ // Quarterly
          var dateInfo = dataLst[i].reportEndDate.split('-')[0]
          if(dataPackage.quarterly[symbol][dateInfo] == null) dataPackage.quarterly[symbol][dateInfo] = {}
          dataPackage.quarterly[symbol][dateInfo][type] = {currencyName: dataLst[i].currencyName, data: dataLst[i].rows}
        }else if(dataLst[i].reportType == 1){ // Yearly
          var dateInfo = dataLst[i].reportEndDate.split('-')[0]
          if(dataPackage.yearly[symbol][dateInfo] == null) dataPackage.yearly[symbol][dateInfo] = {}
          dataPackage.yearly[symbol][dateInfo][type] = {currencyName: dataLst[i].currencyName, data: dataLst[i].rows}
        }
      }
      break
    }catch(e){
      Logger.log(e)
      Logger.log("Parse Failed :" + url)
      Utilities.sleep(sleepDurationSec * 1000 * retry)
      retry += 1 
    }
  }
  return dataPackage
}
function weBullFRDataRecorder(dataPackage){
  var file = SpreadsheetApp.openById('1Vsz0aZ11kBd-c2OOa3S45_9jhmXfRf4vpQU47Ae7n_o')
  for(var recType in dataPackage){
    var recodeMetrix = []
    var sheet = recType=='yearly'? file.getSheetByName('Yearly') : file.getSheetByName('Quarterly')
    var index = sheet.getRange("A2:A").getValues().flat()
    for(var symbol in dataPackage[recType]){
      for(var date in dataPackage[recType][symbol]){
        var FRData = dataPackage[recType][symbol][date]
        var id = String(symbol.split('-')[0]+date).hash()
        var period = date.split(' ')[0]
        var recordYear = date.split(' ')[1]
        
        var currency = FRData['balance-sheet']? FRData['balance-sheet'].currencyName : 'XXXX'
        var bs = FRData['balance-sheet']? FRData['balance-sheet'].data : 'XXXX'
        var cf = FRData['cash-flow']? FRData['cash-flow'].data : 'XXXX'
        var is = FRData['income-statement']? FRData['income-statement'].data : 'XXXX'
        
        if(!(index.includes(id))){
          recodeMetrix.push([id, symbol.split('-')[1], period, recordYear, currency, JSON.stringify(bs), JSON.stringify(is), JSON.stringify(cf)])
        }
      }
    }
    var writeInNum = recodeMetrix.length
    Logger.log(writeInNum)
    if(writeInNum > 0){
      sheet.insertRowsBefore(2, writeInNum);
      writeInNum += 1
      sheet.getRange('A2:H' + writeInNum).setValues(recodeMetrix)
    }
  }
  return
}
