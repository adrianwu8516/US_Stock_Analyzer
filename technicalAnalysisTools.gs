// Sum of selected array range
function Sum(arr){
    return arr.reduce((a,b)=>a+b);
}

// Standard Deviation of selected array range
function Std(arr){
  var sd=0;
  for(var i in arr){
    var mean = Sum(arr)/arr.length
    sd += Math.pow((Math.abs(arr[i]-mean)),2);
  }
  return Math.sqrt(sd/arr.length);
}


// Formatting Numbers
function formartNumber(n){
      return Number(n.toFixed(2));
}

// Simple Moving Average
function SMA(lst, span){
  var final = []
  for(var i=0; i<lst.length-span; i++){
    var avg = Mean(lst.slice(0+i,span+i))
    final.push(formartNumber(avg))
  }
  return final
}

// Exponential Moving Average
function EMA(lst, span){
  var final = lst.slice()
  for(var i in lst){
    final[i] = i==0? lst[i]:((span - 1) * final[i-1] + 2 * lst[i]) / (span + 1)  
  }
  return final
}

function DIF(priceLst){
  if (priceLst == null || priceLst.length <= 0) return new Array();
  let EMAS = EMA(priceLst, 12);
  let EMAL = EMA(priceLst, 26);
  let DIFs = new Array();
  for(let i =0;i<EMAL.length;i++){
    DIFs.push(formartNumber(EMAS[i]-EMAL[i]));
  }
  return DIFs;
}

function DEA(priceLst,span){
  if (priceLst == null || priceLst.length <= 0) return new Array();
  let dif = DIF(priceLst);
  var final = priceLst.slice()
  for(let i in dif){
    final[i] = i==0? dif[i]:((span - 1) * final[i-1] + 2 * dif[i]) / (span + 1)  
  }
  return final;
}

function MACD(priceLst){
  if (priceLst == null || priceLst.length <= 0) return new Array();
  let dif = DIF(priceLst);
  let dea = DEA(priceLst,9);
  let bar = new Array();
  for(let i=0;i<priceLst.length;i++){
    bar.push(2*(formartNumber(dif[i]-dea[i])));
  }
  return bar;
}

function Boll(priceLst, span=20){
  if (priceLst == null || priceLst.length <= 0) return new Array();
  var mean = [], upper = [], lower = []
  for(var i=0; i<priceLst.length; i++){
    if(i<span){
      mean.push(null); upper.push(null); lower.push(null)
    }else{
      var sampleData = priceLst.slice(i-span, i)
      var ma = formartNumber(Sum(sampleData)/span)
      var std = formartNumber(Std(sampleData))
      mean.push(ma)
      upper.push(ma + 2 * std)
      lower.push(ma - 2 * std)
    }
  }
  return {'mean': mean, 'upper': upper, 'lower': lower}
}
