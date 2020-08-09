function monthlyMacroRecord(){
  // By Month
  let url = 'https://www.macromicro.me/collections/5/us-price-relative'
  let xml = UrlFetchApp.fetch(url).getContentText();
  var usCoreCPI = xml.match(/美國-核心消費者物價指數 \(SA, 年增率\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')

  url = 'https://www.macromicro.me/charts/410/us-sp500-cyclically-adjusted-price-earnings-ratio';
  xml = UrlFetchApp.fetch(url).getContentText();
  var ShillerPE = xml.match(/美國-標普500席勒通膨調整後本益比[\s\S]*?<\/span>/)[0].match(/>[\S]*?[0-9]</g)[1].replace(/>|</g, '')
  
  url = 'https://www.macromicro.me/collections/34/us-stock-relative/6999/probability-of-us-recession-10y-and-3m-spread'
  xml = UrlFetchApp.fetch(url).getContentText();
  var USRecession = xml.match(/美國-未來一年衰退機率 \(10Y-3M模型, L\)[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usGDPSAAR = xml.match(/美國-實質國內生產毛額\[GDP\] \(SAAR, 季增年率, R\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  
  url = 'https://www.macromicro.me/collections/2/us-gdp-relative/14/real-cigxm-contribution'
  xml = UrlFetchApp.fetch(url).getContentText();
  var usGDPContributionConsumption = xml.match(/美國-消費 \(SA, 年增率\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usGDPContributionInvest = xml.match(/美國-投資 \(SA, 年增率\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usGDPContributionInvestNonResidential = xml.match(/美國-投資-非住宅<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usGDPContributionInvestResidential = xml.match(/美國-投資-住宅<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usGDPContributionInvestInventory = xml.match(/美國-投資-庫存<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usGDPContributionGov = xml.match(/美國-政府支出 \(SA, 年增率\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usGDPContributionExport = xml.match(/美國-出口 \(SA, 年增率\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usGDPContributionInport = xml.match(/美國-進口 \(SA, 年增率\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usGDPSA = xml.match(/美國-實質GDP \(SA, 年增率\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  
  url = 'https://www.macromicro.me/collections/6/us-trade-relative/17/exports-imports'
  xml = UrlFetchApp.fetch(url).getContentText();
  var usExport = xml.match(/美國-出口-商品&amp;服務 \(SA, 年增率\)[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usImport = xml.match(/美國-進口-商品&amp;服務 \(SA, 年增率\)[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  
  url = 'https://www.macromicro.me/charts/20512/us-period-of-unemployment-time'
  xml = UrlFetchApp.fetch(url).getContentText();
  var usUnemployment5w = xml.match(/美國-家庭調查失業人口 \(時間小於5週\)[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usUnemployment6to14w = xml.match(/美國-家庭調查失業人口 \(時間介於5至14週\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usUnemployment15w = xml.match(/美國-家庭調查失業人口 \(時間大於15週\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
 
  url = 'https://www.macromicro.me/charts/6/employment-condition'
  xml = UrlFetchApp.fetch(url).getContentText();
  var usNonFarm = xml.match(/美國-非農就業人口數 \(SA, 月增, L\)[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usUnemploymentRate = xml.match(/美國-失業率 \(SA, R\)<\/div[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  
  url = 'https://www.macromicro.me/charts/22/consumer-'
  xml = UrlFetchApp.fetch(url).getContentText();
  var usCCI = xml.match(/美國-消費者信心指數<\/div>[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usCCIMich = xml.match(/美國-密大消費者信心指數[\S\s]*?<\/span>/)[0].replace(/[\S\s]*?>([\S]*?[0-9])<\/span>/, '$1')
  var usCCIDiff = parseFloat(usCCI) - parseFloat(usCCIMich)
  
  var MMObj = {
    ShillerPE: ShillerPE,
    USRecession: USRecession,
    usGDPSAAR: usGDPSAAR,
    usGDPSA: usGDPSA,
    usCoreCPI: usCoreCPI,
    usGDPContributionConsumption: usGDPContributionConsumption,
    usGDPContributionInvest: usGDPContributionInvest, 
    usGDPContributionInvestNonResidential: usGDPContributionInvestNonResidential,
    usGDPContributionInvestResidential: usGDPContributionInvestResidential,
    usGDPContributionInvestInventory: usGDPContributionInvestInventory,
    usGDPContributionGov: usGDPContributionGov,
    usGDPContributionExport: usGDPContributionExport,
    usGDPContributionImport: usGDPContributionInport,
    usExport: usExport,
    usImport: usImport,
    usUnemployment5w: usUnemployment5w,
    usUnemployment6to14w: usUnemployment6to14w,
    usUnemployment15w: usUnemployment15w,
    usNonFarm: usNonFarm,
    usUnemploymentRate: usUnemploymentRate,
    usCCI: usCCI,
    usCCIMich: usCCIMich,
    usCCIDiff: usCCIDiff,
    initialClaim: FedWebParser('https://fred.stlouisfed.org/series/ICSA', 1).data
  }
  
  var macroDoc = SpreadsheetApp.openById(MACROSHEET_ID).getSheetByName('每月數據');
  var today = new Date();
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()).padStart(2, '0') + '日';
  var targetRow = onSearch(macroDoc, todayStr, searchTargetCol=0)
  if(targetRow){
    targetRow += 1
    macroDoc.getRange('A' + targetRow + ':Y' + targetRow).setValues([[
      todayStr, MMObj.ShillerPE, MMObj.USRecession, MMObj.usGDPSAAR, MMObj.usGDPSA, MMObj.usCoreCPI, 
      MMObj.usGDPContributionConsumption, MMObj.usGDPContributionInvest, MMObj.usGDPContributionInvestNonResidential, MMObj.usGDPContributionInvestResidential, MMObj.usGDPContributionInvestInventory, MMObj.usGDPContributionGov, MMObj.usGDPContributionExport, MMObj.usGDPContributionImport, 
      MMObj.usExport,MMObj.usImport, MMObj.usUnemployment5w, MMObj.usUnemployment6to14w, MMObj.usUnemployment15w, MMObj.usNonFarm, MMObj.usUnemploymentRate,
      MMObj.usCCI, MMObj.usCCIMich, MMObj.usCCIDiff, MMObj.initialClaim
    ]]);
  }else{
    macroDoc.insertRowBefore(2);
    macroDoc.getRange('A2:Y2').setValues([[
      todayStr, MMObj.ShillerPE, MMObj.USRecession, MMObj.usGDPSAAR, MMObj.usGDPSA, MMObj.usCoreCPI, 
      MMObj.usGDPContributionConsumption, MMObj.usGDPContributionInvest, MMObj.usGDPContributionInvestNonResidential, MMObj.usGDPContributionInvestResidential, MMObj.usGDPContributionInvestInventory, MMObj.usGDPContributionGov, MMObj.usGDPContributionExport, MMObj.usGDPContributionImport, 
      MMObj.usExport,MMObj.usImport, MMObj.usUnemployment5w, MMObj.usUnemployment6to14w, MMObj.usUnemployment15w, MMObj.usNonFarm, MMObj.usUnemploymentRate,
      MMObj.usCCI, MMObj.usCCIMich, MMObj.usCCIDiff, MMObj.initialClaim
    ]]);
  }
}

