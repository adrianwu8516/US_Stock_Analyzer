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
      var xmlRating = xml.match(/{rating:([\s\S]*?)}]}}/g)[0]
      var ratingJSON = JSON.parse(xmlRating.replace(/\./g, '0.').replace(/{([\s\S]*?):/g, '{"\$1\":').replace(/,([a-zA-z]*?):/g, ',"\$1\":'))
      var xmlTickerRT = '{' + xml.match(/tickerRT:([\s\S]*?)}/g)[0] + '}'
      var tickerRTJSON = JSON.parse(xmlTickerRT.replace(/\./g, '0.').replace(/{([\s\S]*?):/g, '{"\$1\":').replace(/,([a-zA-z0-9]*?):/g, ',"\$1\":'))
      var stockInfo = {};
      stockInfo['category'] = category
      stockInfo['symbol'] = tickerRTJSON.tickerRT.symbol
      stockInfo['companyName'] = tickerRTJSON.tickerRT.name
      stockInfo['exchange'] = tickerRTJSON.tickerRT.exchangeCode
      stockInfo['price'] = tickerRTJSON.tickerRT.close
      stockInfo['delta'] = parseFloat(tickerRTJSON.tickerRT.changeRatio * 100)
      stockInfo['volumn'] = parseFloat(tickerRTJSON.tickerRT.volume)
      stockInfo['52weekHigh'] = parseFloat(tickerRTJSON.tickerRT.fiftyTwoWkHigh)
      stockInfo['52weekLow'] = parseFloat(tickerRTJSON.tickerRT.fiftyTwoWkLow)
      stockInfo['value'] = parseFloat(tickerRTJSON.tickerRT.marketValue / (10 ** 8))
      stockInfo['TTM'] = parseFloat(tickerRTJSON.tickerRT.peTtm)
      stockInfo['analystPopularity'] = ratingJSON.rating.ratingAnalysisTotals
      stockInfo['analystAttitiude'] = ratingJSON.rating.ratingAnalysis
      stockInfo['url'] = url
      stockInfo['priceLow'] = ratingJSON.targetPrice.low
      stockInfo['priceHigh'] = ratingJSON.targetPrice.high
      stockInfo['priceMid']  = ratingJSON.targetPrice.mean
      stockInfo['tickerRT'] = tickerRTJSON.tickerRT
      stockInfo['rating'] = ratingJSON.rating
      stockInfo['targetPrice'] = ratingJSON.targetPrice
      stockInfo['forecastEps'] = ratingJSON.forecastEps
      return stockInfo
    }catch(e){
      Logger.log(e)
      Logger.log(urlSymbol + " : WeBull parse failed " + retry)
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