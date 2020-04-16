function weBullSingle(symbol, span=20) {
  //var symbol = 'Zoom视频通讯(ZM)'
  var file = DriveApp.getFilesByName(symbol).next();
  var Sheet = SpreadsheetApp.open(file);
  var dateLst = [], priceLst = [], priceHighLst  = [], priceMidLst = [], priceLowLst = []
  Sheet.getSheetValues(2, 1, span, 1).forEach(element => dateLst.push(element[0]))
  Sheet.getSheetValues(2, 5, span, 1).forEach(element => priceLst.push(parseFloat(element[0])||0))
  Sheet.getSheetValues(2, 11, span, 1).forEach(element => priceHighLst.push(parseFloat(element[0])||0))
  Sheet.getSheetValues(2, 12, span, 1).forEach(element => priceMidLst.push(parseFloat(element[0])||0))
  Sheet.getSheetValues(2, 13, span, 1).forEach(element => priceLowLst.push(parseFloat(element[0])||0))
  return [dateLst.reverse(), priceLst.reverse(), priceHighLst.reverse(), priceMidLst.reverse(), priceLowLst.reverse()]
}

function weBullMultiple(symbolLst) {
  return;
}

function cbsRecord(symbol){
  // Unfinished
  var symbol = 'zm'
  var file = DriveApp.getFileById('1B8Xv88I9eWcFc21dE4tRpV3m-Y8n4rsWJ78JDIJc63g')
  var Sheet = SpreadsheetApp.open(file);
  var today = new Date()
  var index = (today.getFullYear() - 1) + '-' + symbol
  var targetRow = onSearch(Sheet, searchString = index, searchTargetCol = 1)
  if (!targetRow) {
    index = (today.getFullYear() - 2) + '-' + symbol
    targetRow = onSearch(Sheet, searchString = index, searchTargetCol = 1)
  }
  if(targetRow){
    targetRow += 1
    var finList = Sheet.getSheetValues(targetRow, 1, 1, 34)[0]
  }else{
    
  }
}
