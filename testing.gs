function getWeBullDataTesting(urlSymbol="nasdaq-wix", category="testing"){
  Logger.log("Handling: " + urlSymbol)
  var url = 'https://www.webull.com/zh/quote/' + urlSymbol;
  var xml = UrlFetchApp.fetch(url).getContentText();
  var xmlRating = xml.match(/{rating:([\s\S]*?)}]}}/g)[0]
  var ratingJSON = JSON.parse(xmlRating.replace(/:-*\./g, ':0.').replace(/{([\s\S]*?):/g, '{"\$1\":').replace(/,([a-zA-z]*?):/g, ',"\$1\":'))
  var xmlTickerRT = '{' + xml.match(/tickerRT:([\s\S]*?)}/g)[0] + '}'
  var tickerRTJSON = JSON.parse(xmlTickerRT.replace(/:-*\./g, ':0.').replace(/{([\s\S]*?):/g, '{"\$1\":').replace(/,([a-zA-z0-9]*?):/g, ',"\$1\":'))
  var stockInfo = {};
  stockInfo['category'] = category
  stockInfo['symbol'] = tickerRTJSON.tickerRT.symbol
  stockInfo['companyName'] = (tickerRTJSON.tickerRT.name).replace(/ |0|,/g, '')
  stockInfo['exchange'] = tickerRTJSON.tickerRT.exchangeCode
  stockInfo['price'] = tickerRTJSON.tickerRT.close
  stockInfo['delta'] = tickerRTJSON.tickerRT.changeRatio * 100
  stockInfo['volumn'] = tickerRTJSON.tickerRT.volume
  stockInfo['52weekHigh'] = tickerRTJSON.tickerRT.fiftyTwoWkHigh
  stockInfo['52weekLow'] = tickerRTJSON.tickerRT.fiftyTwoWkLow
  stockInfo['value'] = tickerRTJSON.tickerRT.marketValue / (10 ** 8)
  stockInfo['TTM'] = tickerRTJSON.tickerRT.peTtm
  stockInfo['analystPopularity'] = ratingJSON.rating.ratingAnalysisTotals
  stockInfo['analystAttitiude'] = ratingJSON.rating.ratingAnalysis
  stockInfo['url'] = url
  stockInfo['priceLow'] = ratingJSON.targetPrice.low
  stockInfo['priceHigh'] = ratingJSON.targetPrice.high
  stockInfo['priceMid']  = ratingJSON.targetPrice.mean
  stockInfo['tickerRT'] = JSON.stringify(tickerRTJSON.tickerRT)
  stockInfo['rating'] = JSON.stringify(ratingJSON.rating)
  stockInfo['targetPrice'] = JSON.stringify(ratingJSON.targetPrice)
  stockInfo['forecastEps'] = JSON.stringify(ratingJSON.forecastEps)
  Logger.log(stockInfo['rating'])
  Logger.log(stockInfo['targetPrice'])
  Logger.log(stockInfo['forecastEps'])
  return
}

function removeCache(){
  CACHE.remove('index');
}