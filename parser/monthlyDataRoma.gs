function monthlyDataRoma() {
  var investorDoc = SpreadsheetApp.openById(SUPERINVESTORSHEET_ID);
  var url = 'https://www.dataroma.com/m/allact.php';
  var xml = UrlFetchApp.fetch(url).getContentText();
  var xmlPatternLst = xml.replace(/<!DOCTYPE[\s\S]*?<tbody><tr>/, '').match(/<td class="firm">[\s\S]*?<\/tr>/g)
  var investorData = {}
  for(i in xmlPatternLst){
    investorData.fund = xmlPatternLst[i].match(/<td class="firm">[\s\S]*?<\/td>/)[0].match(/<a[\s\S]+?</, '')[0].replace(/<a [\s\S]+?>([\s\S]+?)</, '$1')
    investorData.period = xmlPatternLst[i].match(/<td class="period">[\s\S]+?<\/td>/)[0].replace(/<td class="period">([\s\S]+?)<\/td>/, '$1')
    var portfolioLst = xmlPatternLst[i].match(/<td class="sym">[\s\S]+?</g)
    for(j in portfolioLst){
      var title = portfolioLst[j].replace(/[\s\S]+?title="([\s\S]+?)"[\s\S]+?</, '$1').split(/\n/)
      investorData.fullName = title[0]
      investorData.action = title[1].split(' ')[0]
      investorData.ratio = title[1].split(' ')[1]
      investorData.portfolioRatio = title[2].split(': ')[1]
      investorData.name = portfolioLst[j].replace(/<[\s\S]+?><[\s\S]+?>([\s\S]+?)</, '$1')
      investorData.uuid = String(investorData.fund + investorData.period + investorData.name).hash()
      DataRomaFillIn(investorDoc, investorData)
    }
  }
}

function monthlyDataRomaSnP500Compare(){
  var investorDoc = SpreadsheetApp.openById(SUPERINVESTORSHEET_ID).getSheetByName('SNP500Compare');
  var snpCompare = {}
  var today = new Date();
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月';
  var lastTime = investorDoc.getRange(2, 1, 1, 1).getValue()
  if(lastTime == todayStr){return;}
  
  var urlPositive = 'https://www.dataroma.com/m/grid.php?s=q';
  var xmlPositive = UrlFetchApp.fetch(urlPositive).getContentText();
  var xmlPositiveLst = xmlPositive.match(/<a class="col[\s\S]+?<\/span>/g)
  for(i in xmlPositiveLst){
    var symbol = xmlPositiveLst[i].replace(/[\S\s]+?sym=([\S\s]+?)"[\S\s]+/, '$1')
    snpCompare[symbol] = {}
    snpCompare[symbol].buyer = parseInt(xmlPositiveLst[i].replace(/[\s\S]+?<b>([0-9]+?)<\/b>[\s\S]+/, '$1'))
    snpCompare[symbol].holdPrice = parseFloat(xmlPositiveLst[i].replace(/[\s\S]+?Hold Price: \$([0-9.]+?)<\/span>/, '$1'))
    if(isNaN(snpCompare[symbol].holdPrice)){snpCompare[symbol].holdPrice = ''}
  }
  var urlNegative = 'https://www.dataroma.com/m/grid.php?s=sq';
  var xmlNegative = UrlFetchApp.fetch(urlNegative).getContentText();
  var xmlNegativeLst = xmlNegative.match(/<a class="col[\s\S]+?<\/span>/g)
  for(i in xmlPositiveLst){
    var symbol = xmlNegativeLst[i].replace(/[\S\s]+?sym=([\S\s]+?)"[\S\s]+/, '$1')
    snpCompare[symbol].seller = parseInt(xmlNegativeLst[i].replace(/[\s\S]+?<b>([0-9]+?)<\/b>[\s\S]+/, '$1'))
  }
  Logger.log(snpCompare)
  DataRomaCompareFillIn(investorDoc, snpCompare, todayStr)
}



function DataRomaFillIn(investorDoc, investorData){
  var targetRow = onSearch(investorDoc, investorData.uuid, searchTargetCol=0)
  if(targetRow){
    targetRow += 1
    investorDoc.getRange('A' + targetRow + ':H' + targetRow).setValues([[
      investorData.uuid, investorData.period, investorData.name, investorData.action, investorData.ratio, investorData.fund, investorData.portfolioRatio, investorData.fullName
    ]]);
  }else{
    investorDoc.insertRowBefore(2);
    investorDoc.getRange('A2:H2').setValues([[
      investorData.uuid, investorData.period, investorData.name, investorData.action, investorData.ratio, investorData.fund, investorData.portfolioRatio, investorData.fullName
    ]]);
  }
}

function DataRomaCompareFillIn(investorDoc, snpCompare, todayStr){
  for(var sym in snpCompare){
    investorDoc.insertRowAfter(1);
    var diff = snpCompare[sym].buyer - snpCompare[sym].seller
    investorDoc.getRange('A2:F2').setValues([[
      todayStr, sym, diff, snpCompare[sym].buyer, snpCompare[sym].seller, snpCompare[sym].holdPrice
    ]]);
  }
}