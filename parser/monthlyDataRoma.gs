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