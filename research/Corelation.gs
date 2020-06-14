POSITION = [
  ['rds-b', 250],
  ['baba', 10],
  ['vnet', 200],
  ['lmt',5],
  ['hlf',50]
]
function corrMetrix(span=100){
  var positionStatus = []
  for(var i in POSITION){
    var symbol = POSITION[i][0]
    var file = DriveApp.getFilesByName(symbol).next();
    var Sheet = SpreadsheetApp.open(file);
    var close = []
    Sheet.getSheetValues(2, 5, span, 1).forEach(element => close.unshift(parseFloat(element[0])||null))
    var currentPrice = close[close.length-1]
    positionStatus[i][0] = symbol
    positionStatus[i][1] = close
    positionStatus[i][2] = Math.round(POSITION[i][1] * currentPrice)
  }
}


function myFunction(stockSymbol=['lmt', 'vnet'], span=100) {
  var file = DriveApp.getFilesByName(stockSymbol[0]).next();
  var Sheet = SpreadsheetApp.open(file);
  var dateLstA = [], closeA = []
  Sheet.getSheetValues(2, 1, span, 1).forEach(element => dateLstA.unshift(element[0]))
  Sheet.getSheetValues(2, 5, span, 1).forEach(element => closeA.unshift(parseFloat(element[0])||null))
  
  var file = DriveApp.getFilesByName(stockSymbol[1]).next();
  var Sheet = SpreadsheetApp.open(file);
  var dateLstB = [], closeB = []
  Sheet.getSheetValues(2, 1, span, 1).forEach(element => dateLstB.unshift(element[0]))
  Sheet.getSheetValues(2, 5, span, 1).forEach(element => closeB.unshift(parseFloat(element[0])||null))
  var corr = pearsonCorrelation([closeA, closeB], 0, 1)
  Logger.log(corr)
}
