function getForecasting(data, symbol) {
  data[symbol] = {}
  var url = 'https://finance.yahoo.com/quote/' + symbol + '/analysis?p=' + symbol 
  var xml = UrlFetchApp.fetch(url).getContentText();
  var revenueEstimateXml = xml.match(/<table class="W\(100%\) M\(0\) BdB Bdc\(\$seperatorColor\) Mb\(25px\)" data-reactid="86">[\s\S]*?<\/table>/)[0]
  data[symbol].currentYearSales = billiontoMillion(revenueEstimateXml.replace(/[\s\S]*?data-reactid="131">([\s\S]*?)<[\s\S]*/, '$1'))
  data[symbol].nextYearSales = billiontoMillion(revenueEstimateXml.replace(/[\s\S]*?data-reactid="133">([\s\S]*?)<[\s\S]*/, '$1'))
  data[symbol].currentYearSalesGrowth = revenueEstimateXml.replace(/[\s\S]*?data-reactid="175">([\s\S]*?)<[\s\S]*/, '$1')
  data[symbol].nextYearSalesGrowth = revenueEstimateXml.replace(/[\s\S]*?data-reactid="177">([\s\S]*?)<[\s\S]*/, '$1')
  var growthEstimateXml = xml.match(/data-reactid="391">[\s\S]*?<\/table>/)[0]
  data[symbol].currentYearEpsGrowth = growthEstimateXml.replace(/[\s\S]*?data-reactid="417">([\s\S]*?)<[\s\S]*/, '$1')
  data[symbol].nextYearEpsGrowth = growthEstimateXml.replace(/[\s\S]*?data-reactid="424">([\s\S]*?)<[\s\S]*/, '$1')
  data[symbol].next5Year = growthEstimateXml.replace(/[\s\S]*?data-reactid="431">([\s\S]*?)<[\s\S]*/, '$1')
  data[symbol].past5Year = growthEstimateXml.replace(/[\s\S]*?data-reactid="438">([\s\S]*?)<[\s\S]*/, '$1')
  Logger.log(data)
  return data
}

function recordForecasting(data){
  var today = new Date()
  var monthStr = String(today.getFullYear()) + "-" + String(today.getMonth() + 1).padStart(2, '0')
  var sheet = SpreadsheetApp.openById('17enM_BO-EHxOr2sGl61umgNdXlfFZjdKsKlf2vA0hgE')
  for(var symbol in data){
    var uuid = monthStr + '-' + symbol
    var targetRow = onSearch(sheet, uuid, searchTargetCol=0)
    if(targetRow){
      targetRow += 1
      sheet.getRange('A' + targetRow + ':K' + targetRow).setValues([[
        uuid, symbol, monthStr, data[symbol].currentYearEpsGrowth, data[symbol].currentYearSalesGrowth, data[symbol].nextYearEpsGrowth, data[symbol].nextYearSalesGrowth, 
        data[symbol].past5Year, data[symbol].next5Year, data[symbol].currentYearSales, data[symbol].nextYearSales
      ]]) 
    }else{
      sheet.insertRowBefore(2);
      sheet.getRange('A2:K2').setValues([[
        uuid, symbol, monthStr, data[symbol].currentYearEpsGrowth, data[symbol].currentYearSalesGrowth, data[symbol].nextYearEpsGrowth, data[symbol].nextYearSalesGrowth, 
        data[symbol].past5Year, data[symbol].next5Year, data[symbol].currentYearSales, data[symbol].nextYearSales
      ]]) 
    }
  }
}

function billiontoMillion(str){
  if(str.includes('M')){
    return parseFloat(str)
  }else if(str.includes('B')){
    return parseFloat(str) * 1000
  }
}

function monthlyYahooForecasting(){
  let data = {}
  for(var cat in STOCK_SYMBOLS){
    for(var stockNo in STOCK_SYMBOLS[cat]){
      var symbol = STOCK_SYMBOLS[cat][stockNo].split(/-(.+)/)[1]
      let sleepDurationSec = 0.5
      let retry = 0
      while(retry < 3){
        try{
          Logger.log("Handling: " + symbol)
          data = getForecasting(data, symbol)
          break
        }catch(e){
          Logger.log(e)
          Logger.log(symbol + " : CBS parse failed " + retry)
          Utilities.sleep(sleepDurationSec * 1000 * retry)
          retry  += 1
        }
      }
    }
  }
  recordForecasting(data)
}