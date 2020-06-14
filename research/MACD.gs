function macdResearch(stockSymbol='shop', span=300) {
  var file = DriveApp.getFilesByName(stockSymbol).next();
  var Sheet = SpreadsheetApp.open(file);
  var dateLst = [], close = [], volume = []
  Sheet.getSheetValues(2, 1, span, 1).forEach(element => dateLst.unshift(element[0]))
  Sheet.getSheetValues(2, 5, span, 1).forEach(element => close.unshift(parseFloat(element[0])||null))
  Sheet.getSheetValues(2, 24, span, 1).forEach(element => volume.unshift(parseFloat(element[0])||null))
  var macd = MACD(close)
  var maVolume = SMA(volume, 10)
  let hold = "Wait", engagePrice = 0, init = 10000
  for(var i=27; i <=dateLst.length; i++){
    if(i == dateLst.length){
      Logger.log("剩下金額：" + init)
      continue
    }
    if(hold == "Bull"){
      if(changeRatio(macd[i], macd[i-1]) < 0){
        Logger.log(dateLst[i] + "：平倉賣出，賣出價格：" + close[i] + "交易賺賠：" + Math.round(changeRatio(close[i], engagePrice)*10000)/100 + '%')
        init *= (1 + changeRatio(close[i], engagePrice))
        hold = "Wait"
        engagePrice = 0
      }
      continue;
    }else if(hold == 'Bear'){
      if(changeRatio(macd[i], macd[i-1]) > 0){
        Logger.log(dateLst[i] + "：平倉買回，買回價格：" + close[i] + "交易賺賠：" + Math.round(changeRatio(close[i], engagePrice)*-10000)/100 + '%')
        init *= (1 - changeRatio(close[i], engagePrice))
        hold = "Wait"
        engagePrice = 0
      }
      continue;
    }else{
      if(macd[i] > macd[i-1] && macd[i] < 0){
        Logger.log(dateLst[i] + "：進場交易，買入價碼：" + close[i])
        hold = "Bull"
        engagePrice = close[i]
      }else if(macd[i] < macd[i-1] && macd[i] > 0){
        Logger.log(dateLst[i] + "：進場交易，賣空價碼：" + close[i])
        hold = "Bear"
        engagePrice = close[i]
      }
      continue;
    }
  }
//  Logger.log(macd)
//  Logger.log(close)
//  Logger.log(dateLst)
}