STOCK_TEMPLATE_ID = '1QdGtbF0moLw9mpM1zx2CApLM8u7ZLMq0ScXgBSoPsHg';
STOCKFILE = DriveApp.getFolderById("1iT-sGcenNSFc9INVIJqLvkabo4q0UyVz")
SYMBOLS = {
  'E-commerce':['nasdaq-pdd', 'nasdaq-jd', 'nyse-shop', 'nasdaq-wix'],
  'Internet Service':['nasdaq-goog', 'nasdaq-amzn', 'nasdaq-adbe', 'nyse-ma', 'nyse-v', 'nasdaq-zm', 'nyse-work', 'nasdaq-msft', 'nasdaq-pypl'],
  'Internet Service (China)':['nyse-se', 'nyse-baba', 'nasdaq-ntes', 'nasdaq-bidu', 'nasdaq-vnet'],
  'Social Network Service':['nyse-twtr', 'nyse-snap', 'nasdaq-fb'],
  'Advertisement and Sales':['nyse-crm', 'nasdaq-ttd'],
  'Military Industry':['nyse-lmt', 'nyse-ba', 'nyse-rtx', 'nyse-gd', 'nyse-noc', 'nasdaq-grmn'],
  'Airlines':['nyse-dal', 'nyse-ual','nyse-alk', 'nasdaq-aal', 'nyse-luv'],
  'Travel':['nasdaq-bkng', 'nasdaq-expe'],
  'GPU':['nasdaq-amd', 'nasdaq-nvda'],
  'Cannabis':['nasdaq-gwph', 'nyse-acb'],
  'Space':['nyse-spce', 'nyse-ajrd', 'nyse-maxr'],
  'Hype':['nasdaq-bynd','nasdaq-tsla', 'nasdaq-lk', 'nasdaq-sbux', 'nyse-xom', 'nyse-psx', 'nyse-cvx'],
  'Hardware':['nasdaq-logi', 'nasdaq-roku', 'nasdaq-aapl']
}

function getDataFromXpath(path, xmlDoc, target='text', removeDot = false) {
  // Replacing tbody tag because app script doesnt understand.
  path = path.replace("/html/","").replace("/tbody","");
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
    var output = (target == 'text')?  root.getText().replace(/\n| +|,/g, '') : root.getAttribute(target).getValue()
    if(removeDot) output = root.getText().replace(/\./g, '')
  }catch (exception) {
    return;
  }
  return output
}

function onSearch(sheetName, searchString, searchTargetCol) {
  var values = sheetName.getDataRange().getValues();
  for(var i=values.length-1, basic=0; i>basic; i--) {
    if(values[i][searchTargetCol] == searchString) {return i;}
  }
}

function saveLog(contents) {
  var filename = "Logger.txt";
  var children = STOCKFILE.getFilesByName(filename);
  var file = null;
  if (children.hasNext()) {
    file = children.next();
    file.setContent(contents);
  } else {
    file = STOCKFILE.createFile(filename, contents);
  }
}

function readLog() {
  var filename = "Logger.txt";
  var children = STOCKFILE.getFilesByName(filename);
  var file = null;
  if (children.hasNext()) {
    file = children.next();
    return file.getBlob().getDataAsString();
  } else {
    Logger.log("No Logger File Found")
  }
}


function dataRecord(stockInfo){
  var fileName = stockInfo['companyName'] + "(" + stockInfo['symbol'] + ")"
  if(DriveApp.getFilesByName(fileName).hasNext()){
    var documentId = DriveApp.getFilesByName(fileName).next().getId()
  }else{
    var documentId = DriveApp.getFileById(STOCK_TEMPLATE_ID).makeCopy(STOCKFILE).getId();
    DriveApp.getFileById(documentId).setName(fileName)
  }
  var stockDoc = SpreadsheetApp.openById(documentId);
  today = new Date();
  var todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()).padStart(2, '0') + '日';
  var targetRow = onSearch(stockDoc, todayStr, searchTargetCol=0)
  if(targetRow){
    targetRow += 1
    stockDoc.getRange('A' + targetRow + ':P' + targetRow).setValues([[todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow'], stockInfo['52weekHigh'], stockInfo['52weekLow'], stockInfo['cbsRanking']]]);
  }else{
    stockDoc.insertRowBefore(2);
    stockDoc.getRange('A2:P2').setValues([[todayStr, stockInfo['symbol'], stockInfo['companyName'], stockInfo['exchange'],  stockInfo['price'],  stockInfo['delta'], stockInfo['value'], stockInfo['TTM'], stockInfo['analystAttitiude'], stockInfo['analystPopularity'], stockInfo['priceHigh'], stockInfo['priceMid'], stockInfo['priceLow'], stockInfo['52weekHigh'], stockInfo['52weekLow'], stockInfo['cbsRanking']]]);
  }
}

function dataAnalystPopularity(noteObj, noteObjOld){
  var catLst = Object.keys(noteObj)
  for(var catNo in catLst){
    var catName = catLst[catNo]
    var catObj = noteObj[catLst[catNo]]
    var stockLst = Object.keys(catObj)
    for(var stockNo in stockLst){
      var stockName = stockLst[stockNo]
      var stockInfo = catObj[stockName]
      try {
        var newPopularity = stockInfo['analystPopularity']
        var oldPopularity = noteObjOld[catName][stockName]['analystPopularity']
        if(oldPopularity){
          if(newPopularity > oldPopularity){
            noteObj[catName][stockName]['analystPopularity'] = String(oldPopularity) + " ↗ " + String(newPopularity)
          }else if(newPopularity < oldPopularity){
            noteObj[catName][stockName]['analystPopularity'] = String(oldPopularity) + " ↘ " + String(newPopularity)
          }
        }
        var newPriceMid = stockInfo['priceMid']
        var oldPriceMid = noteObjOld[catName][stockName]['priceMid']
        if(oldPriceMid){
          if(newPriceMid > oldPriceMid){
            noteObj[catName][stockName]['analysis'] = stockInfo['analysis'] + "，調高目標均價從 " + String(oldPriceMid) + " ↗ " + String(newPriceMid)
          }else if(newPriceMid < oldPriceMid){
            noteObj[catName][stockName]['analysis'] = stockInfo['analysis'] + "，降低目標均價從 " + String(oldPriceMid) + " ↘ " + String(newPriceMid)
          }
        }
      }catch (e) {
        Logger.log(noteObj[catName][stockName]['companyName'] + " is a new item")
      }
    }
  }
  return noteObj
}

function dataAnalystReport(noteObj, stockInfo){
  if(stockInfo['price'] < stockInfo['priceLow']){
    stockInfo['sign'] = "🏆";
    stockInfo['analysis'] = Math.round(((stockInfo['priceLow'] - stockInfo['price'])/stockInfo['priceLow'])*100) + "% 低於低標 " + stockInfo['priceLow'] + " 元"
  }else if(stockInfo['price'] < stockInfo['priceMid']){
    stockInfo['sign'] = "🔥";
    stockInfo['analysis'] = Math.round(((stockInfo['priceMid'] - stockInfo['price'])/stockInfo['priceMid'])*100) + "% 低於分析師均價 " + stockInfo['priceMid'] + " 元"
  }else if((stockInfo['price'] > stockInfo['priceMid']) && (stockInfo['price'] < stockInfo['priceHigh'])){
    stockInfo['sign'] = "❗";
    stockInfo['analysis'] = Math.round(((stockInfo['price'] - stockInfo['priceMid'])/stockInfo['priceMid'])*100) + "% 高於分析師均價 " + stockInfo['priceMid'] + " 元"
  }else{
    stockInfo['sign'] = "🆘";
    stockInfo['analysis'] = Math.round(((stockInfo['price'] - stockInfo['priceHigh'])/stockInfo['priceHigh'])*100) + "% 高於分析師最高價 " + stockInfo['priceHigh'] + " 元"
  }
  
  if (typeof noteObj[stockInfo['category']] == "undefined") noteObj[stockInfo['category']] = {};
  noteObj[stockInfo['category']][stockInfo['symbol']] = stockInfo
  return noteObj
}

function mailer(noteObj){
  // Send Email Template
  var title = "本日股票分析";
  var htmlTemp = HtmlService.createTemplateFromFile('dailyReport')
  htmlTemp.noteObj = noteObj
  var htmlBody = htmlTemp.evaluate().getContent();
  MailApp.sendEmail('adrianwu8516@gmail.com, drmanhattan1945@gmail.com, yengttt@gmail.com, h0100556910721@gmail.com', title, '', {htmlBody:htmlBody}) //
}

function weBullDataCollection(urlSymbol, category){
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
  stockInfo['category'] = category
  stockInfo['symbol'] = getDataFromXpath('body/div/section/div/div/div[2]/div/div/h1' ,document)
  stockInfo['companyName'] = getDataFromXpath('body/div/section/div/div/div[2]/div/div/div/div' ,document)
  stockInfo['exchange'] = getDataFromXpath('body/div/section/div/div/div[2]/div/div/div/div[2]' ,document)
  stockInfo['price'] = parseFloat(getDataFromXpath('body/div/section/div/div/div[2]/div/div[3]/div[2]/div/div' ,document).replace(',',''))
  stockInfo['delta'] = parseFloat(getDataFromXpath('body/div/section/div/div/div[2]/div/div[3]/div[2]/div/div[2]/div[2]' ,document))/100
  stockInfo['52weekHigh'] = parseFloat(getDataFromXpath('body/div/section/div/div/div[2]/div[2]/div/div[4]/div/div[2]' ,document).replace(',',''))
  stockInfo['52weekLow'] = parseFloat(getDataFromXpath('body/div/section/div/div/div[2]/div[2]/div/div[4]/div[2]/div[2]' ,document).replace(',',''))
  stockInfo['value'] = parseFloat(getDataFromXpath('body/div/section/div/div/div[2]/div[2]/div/div[5]/div/div[2]]' ,document).replace(',',''))
  stockInfo['TTM'] = parseFloat(getDataFromXpath('body/div/section/div/div/div[2]/div[2]/div/div[5]/div[2]/div[2]' ,document).replace(',',''))
  stockInfo['analystPopularity'] = parseInt(getDataFromXpath('body/div/section/div[2]/div/div/section/div[2]/div/p' ,document).split('位')[0])
  stockInfo['analystAttitiude'] = getDataFromXpath('body/div/section/div[2]/div/div/section/div[2]/div/div' ,document)
  stockInfo['url'] = url
  
  var analystPrice = getDataFromXpath('body/div/section/div[2]/div/div/section[2]/div[2]' ,document)
  var analystPrice_lst = analystPrice.split('，')
  stockInfo['priceLow'] = parseFloat(analystPrice_lst[analystPrice_lst.length-1].replace( /^\D+/g, '').replace( "。", ''))
  stockInfo['priceHigh'] = parseFloat(analystPrice_lst[analystPrice_lst.length-2].replace( /^\D+/g, ''))
  stockInfo['priceMid']  = parseFloat(analystPrice_lst[analystPrice_lst.length-3].replace( /^\D+/g, ''))
  
  try{
    stockInfo['cbsRanking']  = dailyCBSRanking(urlSymbol)
  }catch(e){
    stockInfo['cbsRanking']  = ""
  }
  
  return stockInfo
}

function main(symbols = SYMBOLS){
  //Stop if the market is closed!
  var today = new Date();
  if(today.getDay() < 2){Logger.log("Market Closed!");return;}
  var todayString = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate()
  if(['2020-1-2', '2020-1-21', '2020-2-18', '2020-4-11', '2020-5-26', '2020-7-4', '2020-9-8', '2020-11-27', '2020-12-26'].includes(todayString)){Logger.log("Holiday!");return;}
  
  var catList = Object.keys(symbols)
  var noteObj = {};
  for (var cat in catList){
    for(var i in symbols[catList[cat]]){
      var stockInfo = weBullDataCollection(urlSymbol = symbols[catList[cat]][i], category = catList[cat])
      dataRecord(stockInfo)
      noteObj = dataAnalystReport(noteObj, stockInfo)
    }
  }
  
  // Log Maintain
  var noteObjOld = JSON.parse(readLog())
  saveLog(JSON.stringify(noteObj))
  
  // More Function
  noteObj = dataAnalystPopularity(noteObj, noteObjOld)
  mailer(noteObj)
}