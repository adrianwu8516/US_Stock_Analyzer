// Under Construction

function SumDatareduce(arr){
    return arr.reduce((a,b)=>a+b);  
}

function SMACalculation(span, lst){
  var final = []
  for(var i=0; i<lst.length-span; i++){
    final.push(SumDatareduce(lst.slice(0+i,span+i))/span)
  }
  return final
}

function EMACalculation(span, lst){
  var final = []
  for(var i=0; i<lst.length-span; i++){
    final.push(SumDatareduce(lst.slice(0+i,span+i))/span)
  }
  return final
}

function macdTesting(span=100){
  var Sheet = SpreadsheetApp.openById("1NfqHrB03hT3nyGAodU7ywTYx8OoKfcjonCzLbtN-XsU");
  var date = [], price = []
  Sheet.getSheetValues(2, 1, span, 1).forEach(element => date.unshift(element[0]))
  Sheet.getSheetValues(2, 5, span, 1).forEach(element => price.unshift(parseFloat(element[0])||null))
  var ema12 = EMACalculation(span=12, price)
  var ema26 = EMACalculation(span=26, price)
  var diff = []
  for(var i=0; i<ema26.length; i++){
    diff.push(ema12[i] - ema26[i])
  }
  Logger.log(diff)
  var diff_ema9 = EMACalculation(span=9, diff)
  Logger.log(diff_ema9)
}

