function financialDataRecord(finInfo){
  var fileName = '財報記錄表'//'1B8Xv88I9eWcFc21dE4tRpV3m-Y8n4rsWJ78JDIJc63g'
  var documentId = DriveApp.getFilesByName(fileName).next().getId()
  var finDoc = SpreadsheetApp.openById(documentId);
  
  today = new Date();
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()).padStart(2, '0') + '日';
  var finReportId = finInfo['cbsYaer'] + '-' + finInfo['symbol'] 
  
  var targetRow = onSearch(finDoc, finReportId, searchTargetCol=0)
  if(targetRow){
    targetRow += 1
    finDoc.getRange('A' + targetRow + ':AH' + targetRow).setValues([[
      todayStr, finReportId, finDoc['cashRatio'], finDoc['cashRatioDetail'], finDoc['cashFlow'], finDoc['cashFlowDetail'], finDoc['ARTurnover'], finDoc['ARTurnoverDetail'], 
      finDoc['growthMargin'], finDoc['growthMarginDetail'], finDoc['opearionExpenseRatio'], finDoc['opearionExpenseRatioDetail'], finDoc['profitMargin'], finDoc['profitMarginStatus'], finDoc['ROE'], finDoc['ROEDetail'], finDoc['EPSFlow'], finDoc['EPSFlowStatus'], 
      finDoc['assetTurnover'], finDoc['assetTurnoverDetail'], finDoc['cashRatio2'], finDoc['cashRatio2Detail'], finDoc['ARTurnover2'], finDoc['ARTurnover2Status'], finDoc['inventoryTurnover'], finDoc['inventoryTurnoverDetail'], finDoc['bizCycle'], finDoc['bizCycleStatus'], 
      finDoc['debtRatio'], finDoc['debtRatioDetail'], finDoc['longtermCashRatio'], finDoc['longtermCashDetail'], finDoc['currentRatio'], finDoc['currentRatioStatus']]]);
  }else{
    finDoc.insertRowBefore(2);
    finDoc.getRange('A' + targetRow + ':AH' + targetRow).setValues([[
      todayStr, finReportId, finDoc['cashRatio'], finDoc['cashRatioDetail'], finDoc['cashFlow'], finDoc['cashFlowDetail'], finDoc['ARTurnover'], finDoc['ARTurnoverDetail'], 
      finDoc['growthMargin'], finDoc['growthMarginDetail'], finDoc['opearionExpenseRatio'], finDoc['opearionExpenseRatioDetail'], finDoc['profitMargin'], finDoc['profitMarginStatus'], finDoc['ROE'], finDoc['ROEDetail'], finDoc['EPSFlow'], finDoc['EPSFlowStatus'], 
      finDoc['assetTurnover'], finDoc['assetTurnoverDetail'], finDoc['cashRatio2'], finDoc['cashRatio2Detail'], finDoc['ARTurnover2'], finDoc['ARTurnover2Status'], finDoc['inventoryTurnover'], finDoc['inventoryTurnoverDetail'], finDoc['bizCycle'], finDoc['bizCycleStatus'], 
      finDoc['debtRatio'], finDoc['debtRatioDetail'], finDoc['longtermCashRatio'], finDoc['longtermCashDetail'], finDoc['currentRatio'], finDoc['currentRatioStatus']]]);
  }
}

function caibaoshuoDataCollection(urlSymbol='nasdaq-bynd', category='Hype'){
//  var signalUrl = "https://caibaoshuo.com/companies/" + urlSymbol.split('-')[1] + "/cbs_signal"
//  var xml = UrlFetchApp.fetch(signalUrl).getContentText();
//  xml = xml.match(/<table class="table table-hover"([\s\S]*?)<\/table>/gm)
//  var document = XmlService.parse(xml);
//  //Logger.log(xml)
//  for(var i=0; i<30; i++){
//    var date = document.getRootElement().getChildren('tbody')[0].getChildren('tr')[i].getChildren('td')[0].getText()
//    var signal = document.getRootElement().getChildren('tbody')[0].getChildren('tr')[i].getChildren('td')[1].getText().replace(/\n +/g, '')
//  }
  var finInfo = {}
  var financialStatusUrl = "https://caibaoshuo.com/companies/" + urlSymbol.split('-')[1]
  var xml = UrlFetchApp.fetch(financialStatusUrl).getContentText();
  xml = xml.match(/<div class="tab-content([\s\S]*?)<div class="modal/gm)[0].replace(/<div class="modal/, '').replace(/<br>/g, '')
  var cbsYearLst = xml.match(/cbs_radar_yearly([\s\S]*?)"/gm)
  var cbsScoreLst = xml.match(/#annualCbsChartModal">([\s\S]*?)<\/a>|<span class="blurred span_l">([\s\S]*?)<\/span>/gm)
  var xmlTable = xml.match(/<table class="table table-sm">([\s\S]*?)<\/table>/gm)
  for(var i=0; i<cbsScoreLst.length; i++){
    finInfo['symbol'] = urlSymbol.split('-')[1] 
    finInfo['cbsYaer'] = cbsYearLst[i].replace(/cbs_radar_yearly_/, '').replace(/"/, '')
    finInfo['cbsScore'] = cbsScoreLst[i].replace(/#annualCbsChartModal">/, '').replace(/<\/a>/, '').replace(/<span class="blurred span_l">/, '').replace(/<\/span>/, '')
    var document = XmlService.parse(xmlTable[i]);
    // Cash Analysis
    finInfo['cashRatio'] = getDataFromXpath('tr/td/div/span' ,document).replace(/\n +/g, '')
    finInfo['cashRatioDetail'] = getDataFromXpath('tr/td/div/span' ,document, 'title')
    finInfo['cashFlow'] = getDataFromXpath('tr/td/div/span[2]' ,document).replace(/\n +/g, '')
    finInfo['cashFlowDetail'] = getDataFromXpath('tr/td/div/span[2]' ,document, 'title')
    finInfo['ARTurnover'] = getDataFromXpath('tr/td/div/span[3]' ,document).replace(/\n +/g, '')
    finInfo['ARTurnoverDetail'] = getDataFromXpath('tr/td/div/span[3]' ,document, 'title')
    
    // Profitability
    finInfo['growthMargin'] = getDataFromXpath('tr[2]/td/div/span' ,document).replace(/\n +/g, '')
    finInfo['growthMarginDetail'] = getDataFromXpath('tr[2]/td/div/span' ,document, 'title')
    finInfo['opearionExpenseRatio'] = getDataFromXpath('tr[2]/td/div/span[2]' ,document).replace(/\n +/g, '')
    finInfo['opearionExpenseRatioDetail'] = getDataFromXpath('tr[2]/td/div/span[2]' ,document, 'title')
    finInfo['profitMargin'] = getDataFromXpath('tr[2]/td/div/span[3]' ,document).replace(/\n +/g, '')
    finInfo['profitMarginStatus'] = getDataFromXpath('tr[2]/td/div/span[3]' ,document, 'title')
    finInfo['ROE'] = getDataFromXpath('tr[2]/td/div/span[4]' ,document).replace(/\n +/g, '')
    finInfo['ROEDetail'] = getDataFromXpath('tr[2]/td/div/span[4]' ,document, 'title')
    finInfo['EPSFlow'] = getDataFromXpath('tr[2]/td/div/span[5]' ,document).replace(/\n +/g, '')
    finInfo['EPSFlowStatus'] = getDataFromXpath('tr[2]/td/div/span[5]' ,document, 'title')
    
    // Operation 
    finInfo['assetTurnover'] = getDataFromXpath('tr[3]/td/div/span' ,document).replace(/\n +/g, '')
    finInfo['assetTurnoverDetail'] = getDataFromXpath('tr[3]/td/div/span' ,document, 'title')
    finInfo['cashRatio2'] = getDataFromXpath('tr[3]/td/div/span[2]' ,document).replace(/\n +/g, '')
    finInfo['cashRatio2Detail'] = getDataFromXpath('tr[3]/td/div/span[2]' ,document, 'title')
    finInfo['ARTurnover2'] = getDataFromXpath('tr[3]/td/div/span[3]' ,document).replace(/\n +/g, '')
    finInfo['ARTurnover2Status'] = getDataFromXpath('tr[3]/td/div/span[3]' ,document, 'title')
    finInfo['inventoryTurnover'] = getDataFromXpath('tr[3]/td/div/span[4]' ,document).replace(/\n +/g, '')
    finInfo['inventoryTurnoverDetail'] = getDataFromXpath('tr[3]/td/div/span[4]' ,document, 'title')
    finInfo['bizCycle'] = getDataFromXpath('tr[3]/td/div/span[5]' ,document).replace(/\n +/g, '')
    finInfo['bizCycleStatus'] = getDataFromXpath('tr[3]/td/div/span[5]' ,document, 'title')
    
    // Financial Structure 
    finInfo['debtRatio'] = getDataFromXpath('tr[4]/td/div/span' ,document).replace(/\n +/g, '')
    finInfo['debtRatioDetail'] = getDataFromXpath('tr[4]/td/div/span' ,document, 'title')
    finInfo['longtermCashRatio'] = getDataFromXpath('tr[4]/td/div/span[2]' ,document).replace(/\n +/g, '')
    finInfo['longtermCashDetail'] = getDataFromXpath('tr[4]/td/div/span[2]' ,document, 'title')
    
    // Debt
    finInfo['currentRatio'] = getDataFromXpath('tr[5]/td/span[1]' ,document).replace(/\n +/g, '')
    finInfo['currentRatioStatus'] = getDataFromXpath('tr[5]/td/span[1]' ,document, 'title')
    Logger.log(finInfo)
    financialDataRecord(finInfo)
  }
}