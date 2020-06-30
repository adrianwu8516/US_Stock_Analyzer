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