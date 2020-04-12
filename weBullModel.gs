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


  
  