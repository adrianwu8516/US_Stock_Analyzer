function getCBSFinancialReport(symbol = 'msft'){
  var data = {'近12个月':{}}
  var url = 'https://caibaoshuo.com/companies/' + symbol + '/financials#guru_al_sheet_tab';
  var xml = UrlFetchApp.fetch(url).getContentText();
  var xmlRaw = xml.match(/<table class="table table-hover table-scroll">[\s\S]*?<\/table>/g)
  
  // 资产负债比率(重要科目)
  var blRatioPeriod = xmlRaw[0].match(/<th class="p-1 text-center">[0-9-]*<\/th>/g).map(item => item.replace(/<th class="p-1 text-center">([0-9-]*)<\/th>/, '$1'))
  blRatioPeriod.forEach(item => data[item] = {})
  var blRatioItems = xmlRaw[0].match(/<a class="wiki-terms"[\s\S]*?<\/td>\s<\/tr>/gm)
  for(var no in blRatioItems){
    var blRatioItem = blRatioItems[no]
    var itemTitle = blRatioItem.replace(/<a[\s\S]*?">([\s\S]*?)<\/a>[\s\S]*/, '$1')
    var itemLst = blRatioItem.match(/<span>([\s\S]*?)<\/span>/g)
    for(var i in itemLst){
      if(!(data[blRatioPeriod[i]]['資產負債比率'])){data[blRatioPeriod[i]]['資產負債比率']={}}
      data[blRatioPeriod[i]]['資產負債比率'][itemTitle] = translateNumber(itemLst[i].replace(/<span>([\s\S]*?)<\/span>/, '$1'))
    }
  }
  
  //五大财务比率(+成长能力)
  var fRRatioPeriod = xmlRaw[2].match(/<th class="p-1">[\S]*[0-9]+[\S]*<\/th>/g).map(item => item.replace(/<th class="p-1">([\S]*[0-9]+[\S]*)<\/th>/, '$1'))
  var fRRatioItems = xmlRaw[2].match(/<a class="wiki-terms"[\S\s]*?<\/td><\/tr>/gm)
  for(var no in fRRatioItems){
    var fRRatioItem = fRRatioItems[no]
    var itemTitle = fRRatioItem.replace(/<a[\s\S]*?">([\s\S]*?)<\/a>[\s\S]*/, '$1')
    var itemLst = fRRatioItem.match(/<td class="p-1">([\s\S]*?)<\/td>/g)
    for(var i in itemLst){
      if(!(data[fRRatioPeriod[i]]['五大財務比率'])){data[fRRatioPeriod[i]]['五大財務比率']={}}
      data[fRRatioPeriod[i]]['五大財務比率'][itemTitle] = translateNumber(itemLst[i].replace(/<td class="p-1">([\s\S]*?)<\/td>/, '$1'))
    }
  }
  
  //资产负债表
  var bLPeriod = xmlRaw[3].match(/<th class="p-1 p-sm-2">[\S]*[0-9]+[\S]*<\/th>/g).map(item => item.replace(/<th class="p-1 p-sm-2">([\S]*[0-9]+[\S]*)<\/th>/, '$1'))
  for(var i in bLPeriod){
    if(!(data[bLPeriod[i]])) data[bLPeriod[i]]={} 
    if(!(data[bLPeriod[i]]['資產負債表'])) data[bLPeriod[i]]['資產負債表']={}
  }
  var bLXml = xmlRaw[3].replace(/<td class="p-1 p-sm-2"><span class="line trends">[\s\S]*?<\/span><\/td>/g, '').replace(/<span>&nbsp;&nbsp;&nbsp;<\/span>/g, '')
  var bLXmlLst = bLXml.match(/<td class="p-1 p-sm-2">([\s\S]+?)<\/td>/g).map(item => item.replace(/<td class="p-1 p-sm-2">([\s\S]+?)<\/td>/, '$1'))
  let handlingTitle = ''
  for(var no in bLXmlLst){
    if(no % (bLPeriod.length+1) == 0){
      handlingTitle = bLXmlLst[no]
    }else{
      let year = no % (bLPeriod.length+1) - 1
      data[bLPeriod[year]]['資產負債表'][handlingTitle] = translateNumber(bLXmlLst[no])
    }
  }
  
  //利潤表
  var iSPeriod = xmlRaw[4].match(/<th class="p-1 p-sm-2">[\S]*[0-9]+[\S]*<\/th>/g).map(item => item.replace(/<th class="p-1 p-sm-2">([\S]*[0-9]+[\S]*)<\/th>/, '$1'))
  for(var i in iSPeriod){
    if(!(data[iSPeriod[i]])) data[iSPeriod[i]]={} 
    if(!(data[iSPeriod[i]]['利潤表'])) data[iSPeriod[i]]['利潤表']={} 
  }
  var iSXml = xmlRaw[4].replace(/<td class="p-1 p-sm-2"><span class="line trends">[\s\S]*?<\/span><\/td>/g, '').replace(/<span>&nbsp;<\/span>[-\s]*[\+\s]*/g, '')
  var iSXmlLst = iSXml.match(/<td class="p-1 p-sm-2">([\s\S]+?)<\/td>/g).map(item => item.replace(/<td class="p-1 p-sm-2">([\s\S]+?)<\/td>/, '$1'))
  for(var no in iSXmlLst){
    if(no % (iSPeriod.length+1) == 0){
      handlingTitle = iSXmlLst[no]
    }else{
      year = no % (iSPeriod.length+1) - 1
      data[iSPeriod[year]]['利潤表'][handlingTitle] = translateNumber(iSXmlLst[no])
    }
  }
  
  //現金流量表
  var cFPeriod = xmlRaw[5].match(/<th class="p-1 p-sm-2">([\S]*[0-9]+[\S]*)<\/th>/g).map(item => item.replace(/<th class="p-1 p-sm-2">([\S]*[0-9]+[\S]*)<\/th>/, '$1'))
  for(var i in cFPeriod){
    if(!(data[cFPeriod[i]])) data[cFPeriod[i]]={} 
    if(!(data[cFPeriod[i]]['現金流量表'])) data[cFPeriod[i]]['現金流量表']={} 
  }
  var cFXml = xmlRaw[5].replace(/<td class="p-1 p-sm-2"><span class="line trends">[\s\S]*?<\/span><\/td>/g, '').replace(/<span>&nbsp;<\/span>[-\s]*[\+\s]*/g, '')
  var cFXmlLst = cFXml.match(/<td class="p-1 p-sm-2">([\s\S]+?)<\/td>/g).map(item => item.replace(/<td class="p-1 p-sm-2">([\s\S]+?)<\/td>/, '$1'))
  for(var no in cFXmlLst){
    if(no % (cFPeriod.length+1) == 0){
      handlingTitle = cFXmlLst[no]
    }else{
      year = no % (cFPeriod.length+1) - 1
      data[cFPeriod[year]]['現金流量表'][handlingTitle] = translateNumber(cFXmlLst[no])
    }
  }
  
  // Record 
  var sheet = SpreadsheetApp.openById(FINANCIALREPORTSSHEET_ID)
  for(year in data){
    var uuid = symbol + '-' + year
    var targetRow = onSearch(sheet, uuid, searchTargetCol=0)
    if(targetRow){
      targetRow += 1
      sheet.getRange('A' + targetRow + ':H' + targetRow).setValues([[
        uuid, symbol, year, data[year]['五大財務比率'], data[year]['資產負債比率'], data[year]['資產負債表'], data[year]['利潤表'], data[year]['現金流量表']
      ]]) 
    }else{
      sheet.insertRowBefore(2);
      sheet.getRange('A2:H2').setValues([[
        uuid, symbol, year, data[year]['五大財務比率'], data[year]['資產負債比率'], data[year]['資產負債表'], data[year]['利潤表'], data[year]['現金流量表']
      ]]) 
    }
  }
}

function translateNumber(str){
  if(str.includes('千亿')){
    return parseFloat(str) * 10**11
  }else if(str.includes('百亿')){
    return parseFloat(str) * 10**10
  }else if(str.includes('亿')){
    return parseFloat(str) * 10**8
  }else if(str.includes('千万')){
    return parseFloat(str) * 10**7
  }else if(str.includes('百万')){
    return parseFloat(str) * 10**6
  }else if(str.includes('万')){
    return parseFloat(str) * 10**4
  }else if(str.includes('百元')){
    return parseFloat(str) * 10**2
  }else if(str.includes('元')){
    return parseFloat(str)
  }else if(str.includes('%')){
    return parseFloat(str)/100
  }else{
    return str
  }
}

function monthlyFinancialReport(){
  for(var cat in STOCK_SYMBOLS){
    for(var stockNo in STOCK_SYMBOLS[cat]){
      var symbol = STOCK_SYMBOLS[cat][stockNo].split(/-(.+)/)[1].replace('-', '.')
      let sleepDurationSec = 0.5
      let round = 0
      while(round < 3){
        try{
          getCBSFinancialReport(symbol)
        }catch(e){
          Logger.log(e)
          Logger.log(stockName + " : CBS parse failed " + retry)
          Utilities.sleep(sleepDurationSec * 1000 * retry)
          retry  += 1
        }
      }
    }
  }
}