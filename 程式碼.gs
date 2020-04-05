function getDataFromXpath(path, xmlDoc) {
  // Replacing tbody tag because app script doesnt understand.
  path = path.replace("/html/","").replace("/tbody","","g");
  var tags = path.split("/");
  try {
    var root = xmlDoc.getRootElement();
    for(var i in tags) {
      var tag = tags[i];
      var index = tag.indexOf("[");
      if(index != -1) {
        var val = parseInt(tag[index+1]);
        tag = tag.substring(0,index);
        root = root.getChildren(tag)[val-1];
      }else{
        root = root.getChild(tag);
      }
    }
  }catch (exception) {
    return;
  }
  return root.getText();
}

function onSearch(sheetName, searchString, searchTargetCol) {
  var values = sheetName.getDataRange().getValues();
  for(var i=values.length-1, basic=0; i>basic; i--) {
    if(values[i][searchTargetCol] == searchString) {return i;}
  }
}

function dataRecord(stockInfo){
  var fileName = stockInfo['companyName'] + "(" + stockInfo['symbol'] + ")"
  if(DriveApp.getFilesByName(fileName).hasNext()){
    documentId = DriveApp.getFilesByName(fileName).next().getId()
  }else{
    var TEMPLATE_ID = '1QdGtbF0moLw9mpM1zx2CApLM8u7ZLMq0ScXgBSoPsHg';  
    var STOCKFILE = DriveApp.getFolderById("1iT-sGcenNSFc9INVIJqLvkabo4q0UyVz")
    var documentId = DriveApp.getFileById(TEMPLATE_ID).makeCopy(STOCKFILE).getId();
    DriveApp.getFileById(documentId).setName(fileName)
  }
  var stockDoc = SpreadsheetApp.openById(documentId);
  today = new Date();
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()).padStart(2, '0') + '日';
  var targetRow = onSearch(stockDoc, todayStr, searchTargetCol=0)
  if(targetRow){
    targetRow += 1
    stockDoc.getRange('A' + targetRow + ':M' + targetRow).setValues([[todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow']]]);
  }else{
    stockDoc.insertRowBefore(2);
    stockDoc.getRange('A2:M2').setValues([[todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow']]]);
  }
}

function dataAnalysis(){
  
}

function dataReport(noteLst, stockInfo){
  if(stockInfo['price'] < stockInfo['priceLow']){
    var str = "🏆 " + stockInfo['symbol'] + "股價目前 " + Math.round(((stockInfo['priceLow'] - stockInfo['price'])/stockInfo['priceLow'])*100) + "% 低於所有分析師的建議低標"
  }else if(stockInfo['price'] < stockInfo['priceMid']){
    var str = "🔥 " + stockInfo['symbol'] + "股價目前 " + Math.round(((stockInfo['priceMid'] - stockInfo['price'])/stockInfo['priceMid'])*100) + "% 低於分析師的建議均價"
  }else if((stockInfo['price'] > stockInfo['priceMid']) && (stockInfo['price'] < stockInfo['priceHigh'])){
    var str = "❗ " + stockInfo['symbol'] + "股價目前 " + Math.round(((stockInfo['price'] - stockInfo['priceMid'])/stockInfo['priceMid'])*100) + "% 高於分析師的建議均價"
  }else{
    var str = "🆘 " + stockInfo['symbol'] + "股價目前 " + Math.round(((stockInfo['price'] - stockInfo['priceHigh'])/stockInfo['priceHigh'])*100) + "% 高於分析師的最高價"
  }
  noteLst.push(str)
  return noteLst
}

function mailer(noteLst){
  // Send Email Template
  var title = "本日股票分析";
  var htmlTemp = HtmlService.createTemplateFromFile('dailyReport')
  htmlTemp.noteLst = noteLst
  var htmlBody = htmlTemp.evaluate().getContent();
  MailApp.sendEmail('adrianwu8516@gmail.com', title, '', {htmlBody:htmlBody})
}

function dataCollection(urlSymbol){
  var url = 'https://www.webull.com/zh/quote/' + urlSymbol;
  var xml = UrlFetchApp.fetch(url).getContentText();
  xml = xml.replace(/<head>(.*?)<\/head>/, '')
           .replace(/<footer(.*?)<\/footer>/g, '')
           .replace(/<script(.*?)<\/script>/g, '')
           .replace(/style=\"(.*?)\"/g, '')
           .replace(/class=\"(.*?)\"/g, '')
           .replace(/src=\"(.*?)\"/g, '')
           .replace(/<input(.*?)>/g, '')
  var document = XmlService.parse(xml);
  var stockInfo = {};
  stockInfo['symbol'] = getDataFromXpath('body/div/section/div/div/div[2]/div/div/h1' ,document)
  stockInfo['companyName'] = getDataFromXpath('body/div/section/div/div/div[2]/div/div/div/div' ,document)
  stockInfo['exchange'] = getDataFromXpath('body/div/section/div/div/div[2]/div/div/div/div[2]' ,document)
  stockInfo['price'] = parseFloat(getDataFromXpath('body/div/section/div/div/div[2]/div/div[3]/div[2]/div/div' ,document))
  stockInfo['delta'] = parseFloat(getDataFromXpath('body/div/section/div/div/div[2]/div/div[3]/div[2]/div/div[2]/div[2]' ,document))
  stockInfo['value'] = getDataFromXpath('body/div/section/div/div/div[2]/div[2]/div/div[5]/div/div[2]]' ,document)
  stockInfo['TTM'] = getDataFromXpath('body/div/section/div/div/div[2]/div[2]/div/div[5]/div[2]/div[2]]' ,document)
  stockInfo['analystPopularity'] = parseInt(getDataFromXpath('body/div/section/div[2]/div/div/section/div[2]/div/p' ,document).split('位')[0])
  stockInfo['analystAttitiude'] = getDataFromXpath('body/div/section/div[2]/div/div/section/div[2]/div/div' ,document)
  var analystPrice = getDataFromXpath('body/div/section/div[2]/div/div/section[2]/div[2]' ,document)
  var analystPrice_lst = analystPrice.split('，')
  stockInfo['priceLow'] = parseFloat(analystPrice_lst[analystPrice_lst.length-1].replace( /^\D+/g, '').replace( "。", ''))
  stockInfo['priceHigh'] = parseFloat(analystPrice_lst[analystPrice_lst.length-2].replace( /^\D+/g, ''))
  stockInfo['priceMid']  = parseFloat(analystPrice_lst[analystPrice_lst.length-3].replace( /^\D+/g, ''))
  //Logger.log(stockInfo)
  
  return stockInfo
}

function main(){
  var urlList = ['nasdaq-lk', 'nasdaq-logi', 'nyse-ma', 'nyse-lmt', 'nasdaq-zm', 'nasdaq-pdd', 'nyse-ba', 'nyse-work', 'nyse-dal', 'nyse-baba', 'nasdaq-gwph', 'nyse-se', 'nasdaq-vnet'];
  var noteLst = [];
  for(var i in urlList){
    var stockInfo = dataCollection(urlList[i])
    dataRecord(stockInfo)
    noteLst = dataReport(noteLst, stockInfo)
  }
  mailer(noteLst)
}