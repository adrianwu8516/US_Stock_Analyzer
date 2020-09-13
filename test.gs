function myFunction() {
  var folder = DriveApp.getFolderById("1iT-sGcenNSFc9INVIJqLvkabo4q0UyVz")
  var files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  while(files.hasNext()){
    var file = files.next()
    var ssFile = SpreadsheetApp.openById(file.getId())
    var targetRow = ssFile.getRange("3:3").getValues()
    if(targetRow[0][0]==''){
      Logger.log(file.getName())
      ssFile.deleteRow(3); 
    }
  }
}

function fixMissingValue(){ 
  // Record
  for(var catName in STOCK_SYMBOLS){
    for(var i in STOCK_SYMBOLS[catName]){
      var stockSymbol = STOCK_SYMBOLS[catName][i].split(/-(.+)/)[1].toUpperCase()
      var fileName = stockSymbol
      if(DriveApp.getFilesByName(fileName).hasNext()){
        var documentId = DriveApp.getFilesByName(fileName).next().getId()
        var stockDoc = SpreadsheetApp.openById(documentId);
        if(stockDoc.getSheetValues(16,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 16th row null")
          stockDoc.deleteRow(16)
        }
        if(stockDoc.getSheetValues(15,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 15th row null")
          stockDoc.deleteRow(15)
        }
        if(stockDoc.getSheetValues(14,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 14th row null")
          stockDoc.deleteRow(14)
        }
        if(stockDoc.getSheetValues(13,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 13th row null")
          stockDoc.deleteRow(13)
        }
        if(stockDoc.getSheetValues(12,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 12th row null")
          stockDoc.deleteRow(12)
        }
        if(stockDoc.getSheetValues(11,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 11th row null")
          stockDoc.deleteRow(11)
        }if(stockDoc.getSheetValues(10,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 10th row null")
          stockDoc.deleteRow(10)
        }
        if(stockDoc.getSheetValues(9,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 9th row null")
          stockDoc.deleteRow(9)
        }
        if(stockDoc.getSheetValues(8,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 8th row null")
          stockDoc.deleteRow(8)
        }if(stockDoc.getSheetValues(7,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 7th row null")
          stockDoc.deleteRow(7)
        }
        if(stockDoc.getSheetValues(6,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 6th row null")
          stockDoc.deleteRow(6)
        }
        if(stockDoc.getSheetValues(5,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 5th row null")
          stockDoc.deleteRow(5)
        }
        if(stockDoc.getSheetValues(4,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 4th row null")
          stockDoc.deleteRow(4)
        }
        if(stockDoc.getSheetValues(3,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 3rd row null")
          stockDoc.deleteRow(3)
        }
        if(stockDoc.getSheetValues(2,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 2nd row null")
          stockDoc.deleteRow(2)
        }
      }else{
        Logger.log(fileName + " File Missed!")
      }
    }
  }
}
