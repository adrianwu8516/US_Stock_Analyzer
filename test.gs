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
  // Check if market closed
  if(!checkifClosed()) return;
  
  // Record
  for(var catName in STOCK_SYMBOLS){
    for(var i in STOCK_SYMBOLS[catName]){
      var stockSymbol = STOCK_SYMBOLS[catName][i].split(/-(.+)/)[1].toUpperCase()
      var fileName = stockSymbol
      if(DriveApp.getFilesByName(fileName).hasNext()){
        var documentId = DriveApp.getFilesByName(fileName).next().getId()
        var stockDoc = SpreadsheetApp.openById(documentId);
        if(stockDoc.getSheetValues(4,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 4th row null")
          //stockDoc.deleteRow(4)
        }
        if(stockDoc.getSheetValues(3,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 3rd row null")
          //stockDoc.deleteRow(3)
        }
        if(stockDoc.getSheetValues(2,1,1,1)[0][0]==''){
          Logger.log(fileName + ": 3rd row null")
          //stockDoc.deleteRow(2)
        }
      }else{
        Logger.log(fileName + " File Missed!")
      }
    }
  }
}