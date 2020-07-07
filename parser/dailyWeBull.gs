function weBullAnalystMark(stockInfo){
  // Analyst Marks
  if(stockInfo['price'] < stockInfo['priceLow']){
    stockInfo['sign'] = "🏆";
    stockInfo['analysis'] = Math.round(((stockInfo['priceLow'] - stockInfo['price'])/stockInfo['priceLow'])*100) + "% 低於低標 " + stockInfo['priceLow']
  }else if(stockInfo['price'] < stockInfo['priceMid']){
    stockInfo['sign'] = "🔥";
    stockInfo['analysis'] = Math.round(((stockInfo['priceMid'] - stockInfo['price'])/stockInfo['priceMid'])*100) + "% 低於均價 " + stockInfo['priceMid']
  }else if((stockInfo['price'] > stockInfo['priceMid']) && (stockInfo['price'] < stockInfo['priceHigh'])){
    stockInfo['sign'] = "❗";
    stockInfo['analysis'] = Math.round(((stockInfo['price'] - stockInfo['priceMid'])/stockInfo['priceMid'])*100) + "% 高於均價 " + stockInfo['priceMid']
  }else{
    stockInfo['sign'] = "🆘";
    stockInfo['analysis'] = Math.round(((stockInfo['price'] - stockInfo['priceHigh'])/stockInfo['priceHigh'])*100) + "% 高於高標 " + stockInfo['priceHigh']
  }
  // Volumn Marks - check if the volumn goes up
  if(stockInfo['volume'] > stockInfo['volume10D']*2){
    stockInfo['volumeMark'] = "⚔"
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
      // If there's no rating for that stock
      if(xml.match(/{rating:([\s\S]*?)}]}}/g)){
        var xmlRating = xml.match(/{rating:([\s\S]*?)}]}}/g)[0]
        var ratingJSON = JSON.parse(xmlRating.replace(/:-*\./g, ':0.').replace(/{([\s\S]*?):/g, '{"$1":').replace(/,([a-zA-z]*?):/g, ',"$1":'))
      }else{
        var ratingJSON = {'targetPrice':{}, 'rating':{}, 'forecastEps':{}}
      }
      var xmlTickerRT = '{' + xml.match(/tickerRT:([\s\S]*?)}/g)[0] + '}'
      var tickerRTJSON = JSON.parse(xmlTickerRT.replace(/:-*\./g, ':0.').replace(/{([\s\S]*?):/g, '{"$1":').replace(/,([a-zA-z0-9]*?):/g, ',"$1":'))
      var stockInfo = {};
      stockInfo['category'] = category
      stockInfo['symbol'] = tickerRTJSON.tickerRT.symbol.replace(/ /g, '-')
      stockInfo['companyName'] = LanguageApp.translate((tickerRTJSON.tickerRT.name).replace(/ |0|,/g, ''), 'zh-CN', 'zh-TW')
      stockInfo['exchange'] = tickerRTJSON.tickerRT.exchangeCode
      stockInfo['price'] = parseFloat(tickerRTJSON.tickerRT.close)
      stockInfo['delta'] = parseFloat(tickerRTJSON.tickerRT.changeRatio)
      stockInfo['52weekHigh'] = parseFloat(tickerRTJSON.tickerRT.fiftyTwoWkHigh)
      stockInfo['52weekLow'] = parseFloat(tickerRTJSON.tickerRT.fiftyTwoWkLow)
      stockInfo['value'] = parseFloat(tickerRTJSON.tickerRT.marketValue / (10 ** 8))
      stockInfo['TTM'] = parseFloat(tickerRTJSON.tickerRT.peTtm)
      stockInfo['pb'] = parseFloat(tickerRTJSON.tickerRT.pb)
      stockInfo['ps'] = parseFloat(tickerRTJSON.tickerRT.ps)
      stockInfo['analystPopularity'] = ratingJSON.rating.ratingAnalysisTotals
      stockInfo['analystAttitiude'] = ratingJSON.rating.ratingAnalysis
      stockInfo['url'] = url
      stockInfo['priceLow'] = ratingJSON.targetPrice.low
      stockInfo['priceHigh'] = ratingJSON.targetPrice.high
      stockInfo['priceMid']  = ratingJSON.targetPrice.mean
      tickerRTJSON.tickerRT.name = stockInfo['companyName'] // From zh-CN to zh-TW
      stockInfo['tickerRT'] = JSON.stringify(tickerRTJSON.tickerRT)
      stockInfo['rating'] = JSON.stringify(ratingJSON.rating)
      stockInfo['targetPrice'] = JSON.stringify(ratingJSON.targetPrice)
      stockInfo['forecastEps'] = JSON.stringify(ratingJSON.forecastEps)
      
      stockInfo['high'] = parseFloat(tickerRTJSON.tickerRT.high)
      stockInfo['low'] = parseFloat(tickerRTJSON.tickerRT.low)
      stockInfo['open'] = parseFloat(tickerRTJSON.tickerRT.open)
      stockInfo['volume'] = parseInt(tickerRTJSON.tickerRT.volume)
      stockInfo['volume10D'] = parseInt(tickerRTJSON.tickerRT.avgVol10D)
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
  for (var catName in STOCK_SYMBOLS){
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