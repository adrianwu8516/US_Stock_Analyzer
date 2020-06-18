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