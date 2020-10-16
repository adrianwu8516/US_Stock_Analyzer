function fixMissingValueInSheet(){ 
  // Record
  for(var catName in STOCK_SYMBOLS){
    for(var i in STOCK_SYMBOLS[catName]){
      var stockSymbol = STOCK_SYMBOLS[catName][i].split(/-(.+)/)[1].toUpperCase()
      var fileName = stockSymbol
      if(DriveApp.getFilesByName(fileName).hasNext()){
        var documentId = DriveApp.getFilesByName(fileName).next().getId()
        var doc = SpreadsheetApp.openById(documentId);
        if(doc.getSheetValues(16,1,1,1)[0][0]==''){Logger.log(fileName + ": 16th row null"); doc.deleteRow(16)}
        if(doc.getSheetValues(15,1,1,1)[0][0]==''){Logger.log(fileName + ": 15th row null"); doc.deleteRow(15)}
        if(doc.getSheetValues(14,1,1,1)[0][0]==''){Logger.log(fileName + ": 14th row null"); doc.deleteRow(14)}
        if(doc.getSheetValues(13,1,1,1)[0][0]==''){Logger.log(fileName + ": 13th row null"); doc.deleteRow(13)}
        if(doc.getSheetValues(12,1,1,1)[0][0]==''){Logger.log(fileName + ": 12th row null"); doc.deleteRow(12)}
        if(doc.getSheetValues(11,1,1,1)[0][0]==''){Logger.log(fileName + ": 11th row null"); doc.deleteRow(11)}
        if(doc.getSheetValues(10,1,1,1)[0][0]==''){Logger.log(fileName + ": 10th row null"); doc.deleteRow(10)}
        if(doc.getSheetValues(9,1,1,1)[0][0]==''){Logger.log(fileName + ": 9th row null"); doc.deleteRow(9)}
        if(doc.getSheetValues(8,1,1,1)[0][0]==''){Logger.log(fileName + ": 8th row null"); doc.deleteRow(8)}
        if(doc.getSheetValues(7,1,1,1)[0][0]==''){Logger.log(fileName + ": 7th row null"); doc.deleteRow(7)}
        if(doc.getSheetValues(6,1,1,1)[0][0]==''){Logger.log(fileName + ": 6th row null"); doc.deleteRow(6)}
        if(doc.getSheetValues(5,1,1,1)[0][0]==''){Logger.log(fileName + ": 5th row null"); doc.deleteRow(5)}
        if(doc.getSheetValues(4,1,1,1)[0][0]==''){Logger.log(fileName + ": 4th row null"); doc.deleteRow(4)}
        if(doc.getSheetValues(3,1,1,1)[0][0]==''){Logger.log(fileName + ": 3rd row null"); doc.deleteRow(3)}
        if(doc.getSheetValues(2,1,1,1)[0][0]==''){Logger.log(fileName + ": 2nd row null"); doc.deleteRow(2)}
      }else{
        Logger.log(fileName + " File Missed!")
      }
    }
  }
  return
}