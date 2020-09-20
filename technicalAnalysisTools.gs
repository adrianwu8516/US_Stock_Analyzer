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

function changeRatio(target, base){
  return (target - base)/base
}


// Formatting Numbers
function formatNumber(n){
      return Number(n.toFixed(2));
}

function pearsonCorrelation(prefs, p1, p2) {
  var si = [];

  for (var key in prefs[p1]) {
    if (prefs[p2][key]) si.push(key);
  }

  var n = si.length;

  if (n == 0) return 0;

  var sum1 = 0;
  for (var i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]];

  var sum2 = 0;
  for (var i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]];

  var sum1Sq = 0;
  for (var i = 0; i < si.length; i++) {
    sum1Sq += Math.pow(prefs[p1][si[i]], 2);
  }

  var sum2Sq = 0;
  for (var i = 0; i < si.length; i++) {
    sum2Sq += Math.pow(prefs[p2][si[i]], 2);
  }

  var pSum = 0;
  for (var i = 0; i < si.length; i++) {
    pSum += prefs[p1][si[i]] * prefs[p2][si[i]];
  }

  var num = pSum - (sum1 * sum2 / n);
  var den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
      (sum2Sq - Math.pow(sum2, 2) / n));

  if (den == 0) return 0;

  return num / den;
}

// Simple Moving Average
function SMA(lst=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], span=3){
  var final = []
  for(var i=0; i<lst.length; i++){
    if(i < span-1){
      final.push(0)
    }else{
      var avg = Sum(lst.slice(1+i-span,1+i))/span
      final.push(formatNumber(avg))
    }
  }
  Logger.log(final)
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
    DIFs.push(formatNumber(EMAS[i]-EMAL[i]));
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
    bar.push(2*(formatNumber(dif[i]-dea[i])));
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
      var ma = formatNumber(Sum(sampleData)/span)
      var std = formatNumber(Std(sampleData))
      mean.push(ma)
      upper.push(ma + 2 * std)
      lower.push(ma - 2 * std)
    }
  }
  return {'mean': mean, 'upper': upper, 'lower': lower}
}
