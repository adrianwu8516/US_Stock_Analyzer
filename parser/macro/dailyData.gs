function MMModule() {
  // By Day
  var url = 'https://www.macromicro.me/macro';
  var xml = UrlFetchApp.fetch(url).getContentText();
  var MMDownPct = xml.match(/MM全球景氣衰退機率<\/a>[\S\s]*?<\/div>/)[0].match(/>[\S]*?</)[0].replace(/>|</g, '')
  var MMWuhanIndex = xml.match(/MM新冠肺炎信心指數<\/a>[\S\s]*?<\/div>/)[0].match(/>[\S]*?</)[0].replace(/>|</g, '')
  
  url = 'https://www.macromicro.me/collections/34/us-stock-relative/406/us-buffet-index-gspc';
  xml = UrlFetchApp.fetch(url).getContentText();
  var BuffetIndex = xml.match(/美國-美股總市值\/GDP[\S\s]*?<\/span>/)[0].match(/>[\S]*?[0-9]</g)[1].replace(/>|</g, '')
  
  url = 'https://www.macromicro.me/charts/20828/us-aaii-sentimentsurvey'
  xml = UrlFetchApp.fetch(url).getContentText();
  var AAIIBear = xml.match(/AAII 美股投資人調查-看空[\s\S]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var AAIINeutral = xml.match(/AAII 美股投資人調查-持平[\s\S]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var AAIIBull = xml.match(/AAII 美股投資人調查-看多[\s\S]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  
  url = 'https://www.macromicro.me/collections/34/us-stock-relative/398/us-10-2-yield-curve-gspc'
  xml = UrlFetchApp.fetch(url).getContentText();
  var yieldGap10_2 = xml.match(/美國-10年減2年期公債殖利率 \(L\)[\s\S]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var SNP500 = xml.match(/S&amp;P 500 \(R\)[\s\S]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  
  url = 'https://www.macromicro.me/charts/47/vix'
  xml = UrlFetchApp.fetch(url).getContentText();
  var vix = xml.match(/VIX波動率指數<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  
  url = 'https://www.macromicro.me/collections/19/mm-oil-price/1024/brent-wti-price-spread'
  xml = UrlFetchApp.fetch(url).getContentText();
  var brent = xml.match(/美國-布蘭特原油期貨 \(L\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var wti = xml.match(/美國-WTI西德州原油期貨 \(R\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usdIndex = xml.match(/美元指數 \(L\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var oilConsumption = xml.match(/美國-每日原油產品消費量 \(L\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usOilProduction = xml.match(/美國-每日原油生產量 \(R\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  
  url = 'https://www.macromicro.me/collections/45/mm-gold-price/749/mm-gold'
  xml = UrlFetchApp.fetch(url).getContentText();
  var gold = xml.match(/黃金期貨 \(R\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var goldHold = xml.match(/SPDR Gold Trust ETF \(GLD\) 持倉量 \(L\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var silver = xml.match(/白銀期貨 \(R\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var fedRaise = xml.match(/FedWatch升息機率 \(L\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var fedReduce = xml.match(/FedWatch降息機率 \(L\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')


  var MMObj = {
    downPct: MMDownPct,
    wuhan: MMWuhanIndex,
    BuffetIndex: BuffetIndex,
    AAIIBear: AAIIBear,
    AAIINeutral: AAIINeutral,
    AAIIBull: AAIIBull,
    yieldGap10_2: yieldGap10_2,
    SNP500: SNP500,
    vix: vix,
    brent: brent,
    wti: wti,
    usdIndex: usdIndex,
    oilConsumption: oilConsumption,
    usOilProduction: usOilProduction,
    gold: gold,
    goldHold: goldHold,
    silver: silver,
    fedRaise: fedRaise,
    fedReduce: fedReduce
  }
  Logger.log(MMObj)
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
  var macroDoc = SpreadsheetApp.openById(MACROSHEET_ID).getSheetByName('每日數據');
  var today = new Date();
  var todayStr = String(today.getFullYear()) + "-" + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
  var FGObj = FGModule()
  var MMObj = MMModule()
  var targetRow = onSearch(macroDoc, todayStr, searchTargetCol=0)
  if(targetRow){
    targetRow += 1
    macroDoc.getRange('A' + targetRow + ':X' + targetRow).setValues([[
      todayStr, FGObj.now, FGObj.symbol, FGObj.change, MMObj.downPct, MMObj.wuhan, MMObj.BuffetIndex, MMObj.AAIIBear, MMObj.AAIINeutral, MMObj.AAIIBull, 
      MMObj.yieldGap10_2, MMObj.SNP500, MMObj.vix, ((MMObj.vix)/100)**2, MMObj.brent, MMObj.wti, MMObj.usdIndex, MMObj.oilConsumption, MMObj.usOilProduction, 
      MMObj.gold, MMObj.goldHold, MMObj.silver, MMObj.fedRaise, MMObj.fedReduce
    ]]);
  }else{
    macroDoc.insertRowBefore(2);
    macroDoc.getRange('A2:X2').setValues([[
      todayStr, FGObj.now, FGObj.symbol, FGObj.change, MMObj.downPct, MMObj.wuhan, MMObj.BuffetIndex, MMObj.AAIIBear, MMObj.AAIINeutral, MMObj.AAIIBull, 
      MMObj.yieldGap10_2, MMObj.SNP500, MMObj.vix, ((MMObj.vix)/100)**2, MMObj.brent, MMObj.wti, MMObj.usdIndex, MMObj.oilConsumption, MMObj.usOilProduction, 
      MMObj.gold, MMObj.goldHold, MMObj.silver, MMObj.fedRaise, MMObj.fedReduce
    ]]);
  }
}