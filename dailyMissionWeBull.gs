function weBullAnalystMark(stockInfo){
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
  return stockInfo
}

function getWeBullData(urlSymbol, category){
  Logger.log("Handling: " + urlSymbol)
  var url = 'https://www.webull.com/zh/quote/' + urlSymbol;
  var retry = 1
  while(retry < 3){
    try{
      var xml = UrlFetchApp.fetch(url).getContentText();
      xml = xml.replace(/<head>(.*?)<\/head>/, '')
      .replace(/<footer(.*?)<\/footer>/g, '')
      .replace(/<script(.*?)<\/script>/g, '')
      .replace(/style=\"(.*?)\"/g, '')
      .replace(/class=\"(.*?)\"/g, '')
      .replace(/src=\"(.*?)\"/g, '')
      .replace(/<input(.*?)>/g, '')
      .replace(/<img(.*?)>/g, '')
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
      
      return stockInfo
      
    }catch(e){
      Logger.log(e)
      Logger.log(stockName + " : WeBull parse failed " + retry)
      retry += 1
    }
  }
}

function collectDataFromWeBull(){
  // Check if market closed
  if(!checkifClosed()) return;
  Logger.log("Today Handling: " + JSON.stringify(STOCK_SYMBOLS))
  var pool = []
  for (var catNo in CATLIST){
    var catName = CATLIST[catNo]
    for(var i in STOCK_SYMBOLS[catName]){
      var stockInfo = getWeBullData(urlSymbol = STOCK_SYMBOLS[catName][i], category = catName)
      stockInfo = weBullAnalystMark(stockInfo)
      CACHE.put(stockInfo.symbol, JSON.stringify(stockInfo), CACHELIFETIME); // Cached for 3 hrs
      pool.push(stockInfo.symbol)
    }
  }
  CACHE.put("pool", pool, CACHELIFETIME)
  return
}