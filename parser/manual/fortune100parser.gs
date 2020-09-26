function fortune100Parser(year=2014) {
  var sheet = SpreadsheetApp.openById('1qnBQGYCWMkyvsfs1A53tGhB_SDiW63GfCzfPLuMgJj8').getSheetByName(String(year))
  var url = 'https://content.fortune.com/wp-json/irving/v1/data/franchise-search-results?list_id=763303&token=Zm9ydHVuZTpCcHNyZmtNZCN5SndjWkkhNHFqMndEOTM='
  var recodeMetrix = []
  var xml = UrlFetchApp.fetch(url).getContentText();
  var itemLst = JSON.parse(xml)[1].items
  for(var i in itemLst){
    var tempLst = [itemLst[i].permalink]
    for (var j in itemLst[i].fields){
      tempLst.push(itemLst[i].fields[j].key)
    }
    recodeMetrix.push(tempLst)
    Logger.log(tempLst)
  }
  var writeInNum = recodeMetrix.length
  sheet.insertRowsBefore(2, writeInNum);
  writeInNum += 1
  sheet.getRange('A2:I' + writeInNum).setValues(recodeMetrix)
}
