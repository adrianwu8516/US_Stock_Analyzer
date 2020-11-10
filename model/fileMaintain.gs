function fixMissingValueInSheet(){ 
  // Stock Part
  for(var catName in STOCK_SYMBOLS){
    for(var i in STOCK_SYMBOLS[catName]){
      var stockSymbol = STOCK_SYMBOLS[catName][i].split(/-(.+)/)[1].toUpperCase()
      var fileName = stockSymbol
      if(DriveApp.getFilesByName(fileName).hasNext()){
        var documentId = DriveApp.getFilesByName(fileName).next().getId()
        var doc = SpreadsheetApp.openById(documentId);
//        if(doc.getSheetValues(9,1,1,1)[0][0]==''){Logger.log(fileName + ": 9th row null"); doc.deleteRow(9)}
//        if(doc.getSheetValues(8,1,1,1)[0][0]==''){Logger.log(fileName + ": 8th row null"); doc.deleteRow(8)}
//        if(doc.getSheetValues(7,1,1,1)[0][0]==''){Logger.log(fileName + ": 7th row null"); doc.deleteRow(7)}
//        if(doc.getSheetValues(6,1,1,1)[0][0]==''){Logger.log(fileName + ": 6th row null"); doc.deleteRow(6)}
//        if(doc.getSheetValues(5,1,1,1)[0][0]==''){Logger.log(fileName + ": 5th row null"); doc.deleteRow(5)}
        if(doc.getSheetValues(4,1,1,1)[0][0]==''){Logger.log(fileName + ": 4th row null"); doc.deleteRow(4)}
        if(doc.getSheetValues(3,1,1,1)[0][0]==''){Logger.log(fileName + ": 3rd row null"); doc.deleteRow(3)}
        if(doc.getSheetValues(2,1,1,1)[0][0]==''){Logger.log(fileName + ": 2nd row null"); doc.deleteRow(2)}
      }else{
        Logger.log(fileName + " File Missed!")
      }
    }
  }
  // ETF part
  for(var catName in ETF_LIST){
    for(var i in ETF_LIST[catName]){
      var stockSymbol = ETF_LIST[catName][i].split(/-(.+)/)[1].toUpperCase()
      var fileName = stockSymbol
      if(DriveApp.getFilesByName(fileName).hasNext()){
        var documentId = DriveApp.getFilesByName(fileName).next().getId()
        var doc = SpreadsheetApp.openById(documentId);
        if(doc.getSheetValues(4,1,1,1)[0][0]==''){Logger.log(fileName + ": 4th row null"); doc.deleteRow(4)}
        if(doc.getSheetValues(3,1,1,1)[0][0]==''){Logger.log(fileName + ": 3rd row null"); doc.deleteRow(3)}
        if(doc.getSheetValues(2,1,1,1)[0][0]==''){Logger.log(fileName + ": 2nd row null"); doc.deleteRow(2)}
      }else{
        Logger.log(fileName + " File Missed!")
      }
    }
  }
  //REGENERATELOG()
  return 'fixMissingValue Done'
}