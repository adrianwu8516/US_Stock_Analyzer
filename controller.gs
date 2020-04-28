function messageController(message){
  return render('viewMessage', {'message':message})
}

function indexController(){
  return render('viewIndex')
}

function loadStockList(){
  var html_page = HtmlService.createTemplateFromFile('viewStockList')
  html_page.noteObj = indexData()
  return html_page.evaluate().getContent();
}

function historyChartController(stockSymbol){
  var Data = weBullSingle(stockSymbol)
  return render('viewHistoryChart', {'stockSymbol': stockSymbol, 'date': Data[0], 'price': Data[1], 'priceHigh':Data[2], 'priceMid':Data[3], 'priceLow':Data[4]})
}

function unsubscribeController(email, hash){
  var Sheet = SpreadsheetApp.open(MAILFILE)
  var targetRow = onSearch(Sheet, searchString = email, searchTargetCol = 1)
  if(targetRow){
    targetRow += 1
    if (hash == (Sheet.getSheetValues(targetRow, 2, 1, 1)[0][0]).hash()){
      Sheet.deleteRow(targetRow);
      return render('viewMessage', {'message':(email + " has been removed from email list!!")})
    }else{
      return render('viewMessage', {'message':"You're not authorized to do this!"})
    }
  }else{
    return render('viewMessage', {'message':"Can't find the email: " + email})
  } 
}

// Not Finished
function historyCompareController(stockSymbols){
  return render('historyChart', {'data':weBullMultiple(stockSymbols)})
}