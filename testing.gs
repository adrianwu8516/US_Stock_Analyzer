function getWeBullDataTesting(urlSymbol="nasdaq-jd", category="testing"){
  Logger.log("Handling: " + urlSymbol)
  var url = 'https://www.webull.com/zh/quote/' + urlSymbol;
  var xml = UrlFetchApp.fetch(url).getContentText();
  var xmlRating = xml.match(/{rating:([\s\S]*?)}]}}/g)[0]
  Logger.log(xmlRating)
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
  Logger.log(stockInfo)
  return
      
}