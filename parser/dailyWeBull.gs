function getWeBullData(urlSymbol='otcmkts-mdxg', category=''){
  var url = 'https://www.webull.com/zh/quote/' + urlSymbol;
  var xml = UrlFetchApp.fetch(url).getContentText();
  // If there's no rating for that stock
  var ratingJSON = xml.match(/analisyInfo":({[\s\S]*?]}}),"institution/)? JSON.parse(xml.replace(/[\s\S]*?analisyInfo":({[\s\S]*?]}})[\s\S]*/, '$1')) : {'targetPrice':{}, 'rating':{}, 'forecastEps':{}}
  var tickerRTJSON = JSON.parse(xml.replace(/[\s\S]*?"tickerRT":({[\s\S]*?})[\s\S]*/, '$1'))
  if(xml.match(/"institutionalHoldingData":{"institutionHolding":({[\s\S]*?}})/)){
    var holdingJSON = JSON.parse(xml.replace(/[\s\S]*?"institutionalHoldingData":{"institutionHolding":({[\s\S]*?}})[\s\S]*/, '$1'))
  }
  var stockInfo = {};
  stockInfo['category'] = category
  stockInfo['tickerId'] = tickerRTJSON.tickerId
  stockInfo['symbol'] = tickerRTJSON.symbol.replace(/ /g, '-')
  stockInfo['companyName'] = LanguageApp.translate((tickerRTJSON.name).replace(/ |0|,/g, ''), 'zh-CN', 'zh-TW')
  stockInfo['exchange'] = tickerRTJSON.exchangeCode
  stockInfo['price'] = parseFloat(tickerRTJSON.close)
  stockInfo['delta'] = parseFloat(tickerRTJSON.changeRatio)
  stockInfo['52weekHigh'] = parseFloat(tickerRTJSON.fiftyTwoWkHigh)
  stockInfo['52weekLow'] = parseFloat(tickerRTJSON.fiftyTwoWkLow)
  stockInfo['value'] = parseFloat(tickerRTJSON.marketValue / (10 ** 8))
  stockInfo['TTM'] = parseFloat(tickerRTJSON.peTtm)
  stockInfo['pb'] = parseFloat(tickerRTJSON.pb)
  stockInfo['ps'] = parseFloat(tickerRTJSON.ps)
  stockInfo['analystPopularity'] = ratingJSON.rating.ratingAnalysisTotals
  stockInfo['analystAttitiude'] = ratingJSON.rating.ratingAnalysis
  stockInfo['url'] = url
  stockInfo['priceLow'] = ratingJSON.targetPrice.low
  stockInfo['priceHigh'] = ratingJSON.targetPrice.high
  stockInfo['priceMid']  = ratingJSON.targetPrice.mean
  tickerRTJSON.name = stockInfo['companyName'] // From zh-CN to zh-TW
  stockInfo['tickerRT'] = JSON.stringify(tickerRTJSON)
  stockInfo['rating'] = JSON.stringify(ratingJSON.rating)
  stockInfo['targetPrice'] = JSON.stringify(ratingJSON.targetPrice)
  stockInfo['forecastEps'] = JSON.stringify(ratingJSON.forecastEps)
  stockInfo['latestEarningsDate'] = Date.parse(tickerRTJSON.latestEarningsDate)
  stockInfo['high'] = parseFloat(tickerRTJSON.high)
  stockInfo['low'] = parseFloat(tickerRTJSON.low)
  stockInfo['open'] = parseFloat(tickerRTJSON.open)
  stockInfo['volume'] = parseInt(tickerRTJSON.volume)
  stockInfo['volume10D'] = parseInt(tickerRTJSON.avgVol10D)
  stockInfo['volumeRatio'] = Math.round((stockInfo['volume'] / stockInfo['volume10D']) * 100)
  stockInfo['forwardPe'] = parseFloat(tickerRTJSON.forwardPe)
  stockInfo['yield'] = Math.round(parseFloat(tickerRTJSON.yield)*1000)/10 + "%"
  
  // Institutional Holding
  if(holdingJSON){
    let outstandingShares = parseFloat(tickerRTJSON.outstandingShares)
    stockInfo['holdingRatio'] = Math.round((holdingJSON.stat.holdingCount / outstandingShares) * 100)
    stockInfo['holdingChangeRatio'] = (holdingJSON.newPosition.holdingCountChange + holdingJSON.increase.holdingCountChange - holdingJSON.soldOut.holdingCountChange - holdingJSON.decrease.holdingCountChange)/outstandingShares
    stockInfo['holding'] = JSON.stringify(holdingJSON)
  }
  CACHE.put(stockInfo.symbol, JSON.stringify(stockInfo), CACHELIFETIME); // Cached for 3 hrs
  //Logger.log(stockInfo)
  return stockInfo
}

function collectDataFromWeBull(){
  // Check if market closed
  if(!checkifClosed()) return;
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