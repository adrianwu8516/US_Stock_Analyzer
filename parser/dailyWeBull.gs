function getWeBullData(urlSymbol='nasdaq-bigc', category=''){
  var url = 'https://www.webull.com/zh/quote/' + urlSymbol;
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
  if(xml.match(/institutionHolding:{[\s\S]*?}}/g)){
    var xmlHolding = '{' + xml.match(/institutionHolding:{[\s\S]*?}}/g)[0] + '}'
    var holdingJSON = JSON.parse(xmlHolding.replace(/:-*\./g, ':0.').replace(/{([\s\S]*?):/g, '{"$1":').replace(/,([a-zA-z0-9]*?):/g, ',"$1":')).institutionHolding
  }
  
  var stockInfo = {};
  stockInfo['category'] = category
  stockInfo['tickerId'] = tickerRTJSON.tickerRT.tickerId
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
  stockInfo['latestEarningsDate'] = Date.parse(tickerRTJSON.tickerRT.latestEarningsDate)
  stockInfo['high'] = parseFloat(tickerRTJSON.tickerRT.high)
  stockInfo['low'] = parseFloat(tickerRTJSON.tickerRT.low)
  stockInfo['open'] = parseFloat(tickerRTJSON.tickerRT.open)
  stockInfo['volume'] = parseInt(tickerRTJSON.tickerRT.volume)
  stockInfo['volume10D'] = parseInt(tickerRTJSON.tickerRT.avgVol10D)
  stockInfo['volumeRatio'] = Math.round((stockInfo['volume'] / stockInfo['volume10D']) * 100)
  stockInfo['forwardPe'] = parseFloat(tickerRTJSON.tickerRT.forwardPe)
  stockInfo['yield'] = Math.round(parseFloat(tickerRTJSON.tickerRT.yield)*1000)/10 + "%"
  
  // Institutional Holding
  if(holdingJSON){
    let outstandingShares = parseFloat(tickerRTJSON.tickerRT.outstandingShares)
    stockInfo['holdingRatio'] = Math.round((holdingJSON.stat.holdingCount / outstandingShares) * 100)
    stockInfo['holdingChangeRatio'] = (holdingJSON.newPosition.holdingCountChange + holdingJSON.increase.holdingCountChange - holdingJSON.soldOut.holdingCountChange - holdingJSON.decrease.holdingCountChange)/outstandingShares
    stockInfo['holding'] = JSON.stringify(holdingJSON)
  }
  
  // Test
  stockInfo = weBullAnalystMark(stockInfo)
  return stockInfo
}

function collectDataFromWeBull(){
  // Check if market closed
  //if(!checkifClosed()) return;
  Logger.log("Today Handling: " + JSON.stringify(STOCK_SYMBOLS))
  
  var pool = CACHE.get('pool')? (CACHE.get('pool')).split(',') : []
  var tickerPool = CACHE.get('tickerPool')? (CACHE.get('tickerPool')).split(',') : []
  
  for (var catName in STOCK_SYMBOLS){
    for(var i in STOCK_SYMBOLS[catName]){
      let urlSymbol = STOCK_SYMBOLS[catName][i]
      if(CACHE.get(urlSymbol.split('-')[1].toUpperCase())){Logger.log("Exist"); continue;}
      Logger.log("Handling: " + urlSymbol)
      var retry = 1
      while(retry < 3){
        try{
          var stockInfo = getWeBullData(urlSymbol, category = catName)
          stockInfo = weBullAnalystMark(stockInfo)
          CACHE.put(stockInfo.symbol, JSON.stringify(stockInfo), CACHELIFETIME); // Cached for 3 hrs
          pool.push(stockInfo.symbol)
          tickerPool.push(stockInfo.symbol + '-' + stockInfo.tickerId)
          break
        }catch(e){
          Logger.log(e)
          Logger.log(urlSymbol + " : WeBull parse failed " + retry)
          retry += 1
        }
      }
    }
  }
  Logger.log(pool)
  CACHE.put("pool", pool, CACHELIFETIME)
  CACHE.put("tickerPool", tickerPool, CACHELIFETIME)
  return
}