function MMModule() {
  var url = 'https://www.macromicro.me/macro';
  var xml = UrlFetchApp.fetch(url).getContentText();
  var MMDownPct = xml.match(/MM全球景氣衰退機率<\/a>[\S\s]*?<\/div>/)[0].match(/>[\S]*?</)[0].replace(/>|</g, '')
  var MMWuhanIndex = xml.match(/MM新冠肺炎信心指數<\/a>[\S\s]*?<\/div>/)[0].match(/>[\S]*?</)[0].replace(/>|</g, '')
  
  url = 'https://www.macromicro.me/charts/410/us-sp500-cyclically-adjusted-price-earnings-ratio';
  xml = UrlFetchApp.fetch(url).getContentText();
  var ShillerPE = xml.match(/US標普500席勒通膨調整後本益比[\s\S]*?<\/span>/)[0].match(/>[\S]*?[0-9]</g)[1].replace(/>|</g, '')
  
  url = 'https://www.macromicro.me/collections/34/us-stock-relative/406/us-buffet-index-gspc';
  xml = UrlFetchApp.fetch(url).getContentText();
  var BuffetIndex = xml.match(/US 美股總市值\/GDP[\S\s]*?<\/span>/)[0].match(/>[\S]*?[0-9]</g)[1].replace(/>|</g, '')
  
  url = 'https://www.macromicro.me/charts/20828/us-aaii-sentimentsurvey'
  xml = UrlFetchApp.fetch(url).getContentText();
  var AAIIBear = xml.match(/AAII 美股投資人調查-看空[\s\S]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var AAIINeutral = xml.match(/AAII 美股投資人調查-持平[\s\S]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var AAIIBull = xml.match(/AAII 美股投資人調查-看多[\s\S]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  
  url = 'https://www.macromicro.me/collections/34/us-stock-relative/398/us-10-2-yield-curve-gspc'
  xml = UrlFetchApp.fetch(url).getContentText();
  var yieldGap10_2 = xml.match(/美國-10年減2年期公債殖利率 \(L\)[\s\S]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var SNP500 = xml.match(/S&amp;P 500 \(R\)[\s\S]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  
  url = 'https://www.macromicro.me/collections/34/us-stock-relative/6999/probability-of-us-recession-10y-and-3m-spread'
  xml = UrlFetchApp.fetch(url).getContentText();
  var USRecession = xml.match(/美國-未來一年衰退機率\(10Y-3M模型, L\)[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  
  var MMObj = {
    downPct: MMDownPct,
    wuhan: MMWuhanIndex,
    ShillerPE: ShillerPE,
    BuffetIndex: BuffetIndex,
    AAIIBear: AAIIBear,
    AAIINeutral: AAIINeutral,
    AAIIBull: AAIIBull,
    yieldGap10_2: yieldGap10_2,
    SNP500: SNP500,
    USRecession: USRecession
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
    macroDoc.getRange('A' + targetRow + ':N' + targetRow).setValues([[
      todayStr, FGObj.now, FGObj.symbol, FGObj.change, MMObj.downPct, MMObj.wuhan, MMObj.ShillerPE, MMObj.BuffetIndex, MMObj.AAIIBear, MMObj.AAIINeutral, MMObj.AAIIBull, MMObj.yieldGap10_2, MMObj.SNP500, MMObj.USRecession
    ]]);
  }else{
    macroDoc.insertRowBefore(2);
    macroDoc.getRange('A2:N2').setValues([[
      todayStr, FGObj.now, FGObj.symbol, FGObj.change, MMObj.downPct, MMObj.wuhan, MMObj.ShillerPE, MMObj.BuffetIndex, MMObj.AAIIBear, MMObj.AAIINeutral, MMObj.AAIIBull, MMObj.yieldGap10_2, MMObj.SNP500, MMObj.USRecession
    ]]);
  }
}