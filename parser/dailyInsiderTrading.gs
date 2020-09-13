function collectInsiderTradingData(){
  // Check if market closed
  if(!checkifClosed()) return;
  
  var poolCache = CACHE.get("tickerPool");
  Logger.log(poolCache)
  if (poolCache != null) {
    var poolLst = poolCache.split(',')
    while(poolLst[0] != ""){
      let ticker = poolLst.pop()
      CACHE.put("tickerPool", poolLst, CACHELIFETIME)
      let ticketId = ticker.split('-')[1]
      let ticketSymbol = ticker.split('-')[0]
      Logger.log(ticketId)
      Logger.log(ticketSymbol)
      collectInsiderTradingUnit(ticketSymbol, ticketId)
      collectInsiderTradingData()
      poolLst = [""]
    }
  }
}

function collectInsiderTradingUnit(ticketSymbol = 'DADA', tickerId = 950164518){
  let sleepDurationSec = 0.5
  let retry = 1
  while(retry < 2){
    try{
      let finalMetrix = []
      let today = new Date();
      let todayStr = String(today.getFullYear()) + "年" + String(today.getMonth() + 1).padStart(2, '0') + '月' + String(today.getDate()).padStart(2, '0') + '日';
      var insiderSheet = SpreadsheetApp.openById('1zraRLEJ-dfmBra21ZEizoXZIS6slKEHmj5uj9Xw-xhc')
      var listForSearch = insiderSheet.getSheetValues(2, 1, insiderSheet.getLastRow(), 1).flat()
      let url = 'https://securitiesapi.webullbroker.com/api/securities/stock/' + tickerId + '/holdersDetail?hasNum=0&pageSize=20&type=1'
      let xml = UrlFetchApp.fetch(url).getContentText();
      if(!xml.includes('},{')){Logger.log(ticketSymbol + ": No Data");return;}
      let insiderLst = xml.replace(/\[{|}\]/g,'').split('},{').map(item => JSON.parse("{" + item + "}"))
      for(let i in insiderLst){
        let insertId = (insiderLst[i].transactionDate + '-' + insiderLst[i].name + '-' + insiderLst[i].netAmount).hash()
        if(listForSearch.includes(insertId)){Logger.log(ticketSymbol + ": NData Existed");break;}
        insiderLst[i].netAmount = insiderLst[i].isAcquire == 1? insiderLst[i].netAmount : insiderLst[i].netAmount * -1
        finalMetrix.push([
          insertId, todayStr, ticketSymbol, insiderLst[i].transactionDate, 
          insiderLst[i].relationType, insiderLst[i].positionTitle, insiderLst[i].name, insiderLst[i].netAmount, insiderLst[i].price, insiderLst[i].postAmount])
      }
      if(finalMetrix.length!=0){
        insiderSheet.insertRowsAfter(1, finalMetrix.length)
        insiderSheet.getRange('A2:J' + (1+finalMetrix.length)).setValues(finalMetrix)
        return
      }else{
        return
      }
    }catch(e){
      Logger.log(e)
      Logger.log(stockName + " : Insider data parse failed " + retry)
      Utilities.sleep(sleepDurationSec * 1000 * retry)
      retry  += 1
    }
  }
}