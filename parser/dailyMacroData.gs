function MMModule() {
  var url = 'https://www.macromicro.me/macro';
  var xml = UrlFetchApp.fetch(url).getContentText();
  var MMDownPct = xml.match(/MM全球景氣衰退機率<\/a>[\S\s]*?<\/div>/)[0].match(/>[\S]*?</)[0].replace(/>|</g, '')
  var MMWuhanIndex = xml.match(/MM武漢肺炎信心指數<\/a>[\S\s]*?<\/div>/)[0].match(/>[\S]*?</)[0].replace(/>|</g, '')
  var MMObj = {
    downPct: MMDownPct,
    wuhan: MMWuhanIndex
  }
  return MMObj
}

function FGModule() {
  var url = 'https://money.cnn.com/data/fear-and-greed/';
  var xml = UrlFetchApp.fetch(url).getContentText();
  var xmlFGNow = xml.match(/Greed Now: [0-9]*? [\s\S]*?</)[0]
  var FGNow = parseInt(xmlFGNow.match(/ [0-9]*? /)[0])
  var FGNowSymbol = xmlFGNow.match(/\([\s\S]*?\)/)[0].replace(/\(|\)/g, '')
  var FGYest = parseInt(xml.match(/Close: [0-9]*? [\s\S]*?</)[0].match(/ [0-9]*? /)[0])
  var FGObj = {
    now: FGNow,
    symbol: FGNowSymbol,
    change: Math.round((FGNow - FGYest)/FGYest * 100) + "%"
  }
  return FGObj
}


function dailyMacroRecord(){
  var macroDoc = SpreadsheetApp.openById(MACROSHEET_ID);
  var today = new Date();
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()).padStart(2, '0') + '日';
  var FGObj = FGModule()
  var MMObj = MMModule()
  var targetRow = onSearch(macroDoc, todayStr, searchTargetCol=0)
  if(targetRow){
    targetRow += 1
    macroDoc.getRange('A' + targetRow + ':F' + targetRow).setValues([[
      todayStr, FGObj.now, FGObj.symbol, FGObj.change, MMObj.downPct, MMObj.wuhan
    ]]);
  }else{
    macroDoc.insertRowBefore(2);
    macroDoc.getRange('A2:F2').setValues([[
      todayStr, FGObj.now, FGObj.symbol, FGObj.change, MMObj.downPct, MMObj.wuhan
    ]]);
  }
}