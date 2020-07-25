function getCBSFinancialReport(symbol){
  if(symbol.includes(['mdxg'])) return
  var data = {'近12个月':{}}
  var url = 'https://caibaoshuo.com/companies/' + symbol + '/financials#guru_al_sheet_tab';
  var xml = UrlFetchApp.fetch(url).getContentText();
  var xmlRaw = xml.match(/<!-- 年 -->[\s\S]*?<table[\s\S]*?<\/table>/g)

  // 资产负债比率(重要科目)
  var blRatioPeriod = xmlRaw[0].match(/<th class="p-1 text-center">[0-9-]*<\/th>/g).map(item => item.replace(/<th class="p-1 text-center">([0-9-]*)<\/th>/, '$1'))
  blRatioPeriod.forEach(item => data[item] = {})
  var blRatioItems = xmlRaw[0].match(/<a class="wiki-terms"[\s\S]*?<\/td>\s<\/tr>/gm)
  for(var no in blRatioItems){
    var blRatioItem = blRatioItems[no]
    var itemTitle = translateChar(blRatioItem.replace(/<a[\s\S]*?">([\s\S]*?)<\/a>[\s\S]*/, '$1'))
    var itemLst = blRatioItem.match(/<span>([\s\S]*?)<\/span>/g)
    for(var i in itemLst){
      if(!(data[blRatioPeriod[i]])){data[blRatioPeriod[i]]={}}
      if(!(data[blRatioPeriod[i]]['資產負債比率'])){data[blRatioPeriod[i]]['資產負債比率']={}}
      data[blRatioPeriod[i]]['資產負債比率'][itemTitle] = translateNumber(itemLst[i].replace(/<span>([\s\S]*?)<\/span>/, '$1'))
    }
  }
  //五大财务比率(+成长能力)
  var fRRatioPeriod = xmlRaw[2].match(/<th class="p-1">[\S]*[0-9]+[\S]*<\/th>/g).map(item => item.replace(/<th class="p-1">([\S]*[0-9]+[\S]*)<\/th>/, '$1'))
  var fRRatioItems = xmlRaw[2].match(/<a class="wiki-terms"[\S\s]*?<\/td><\/tr>/gm)
  for(var no in fRRatioItems){
    var fRRatioItem = fRRatioItems[no]
    var itemTitle = translateChar(fRRatioItem.replace(/<a[\s\S]*?">([\s\S]*?)<\/a>[\s\S]*/, '$1'))
    var itemLst = fRRatioItem.match(/<td class="p-1">([\s\S]*?)<\/td>/g)
    for(var i in itemLst){
      if(!(data[fRRatioPeriod[i]])){data[fRRatioPeriod[i]]={}}
      if(!(data[fRRatioPeriod[i]]['五大財務比率'])){data[fRRatioPeriod[i]]['五大財務比率']={}}
      data[fRRatioPeriod[i]]['五大財務比率'][itemTitle] = translateNumber(itemLst[i].replace(/<td class="p-1">([\s\S]*?)<\/td>/, '$1'))
    }
  }
  
  //资产负债表
  var bLPeriod = xmlRaw[3].match(/<th class="p-1[\s\S]*?>([\S]*[0-9]+[\S]*)<\/th>/g).map(item => item.replace(/<th class="p-1[\s\S]*?>([\S]*[0-9]+[\S]*)<\/th>/, '$1'))
  for(var i in bLPeriod){
    if(!(data[bLPeriod[i]])) data[bLPeriod[i]]={} 
    if(!(data[bLPeriod[i]]['資產負債表'])) data[bLPeriod[i]]['資產負債表']={}
  }
  var bLXml = xmlRaw[3].replace(/<td class="p-1 p-sm-2"><span class="line trends">[\s\S]*?<\/span><\/td>/g, '').replace(/<span>[&nbsp;]*<\/span>/g, '')
  var bLXmlLst = bLXml.match(/<td class="p-1 p-sm-2">([\s\S]+?)<\/td>/g).map(item => item.replace(/<td class="p-1 p-sm-2">([\s\S]+?)<\/td>/, '$1'))
  let handlingTitle = ''
  for(var no in bLXmlLst){
    if(no % (bLPeriod.length+1) == 0){
      handlingTitle = translateChar(bLXmlLst[no])
    }else{
      let year = no % (bLPeriod.length+1) - 1
      data[bLPeriod[year]]['資產負債表'][handlingTitle] = translateNumber(bLXmlLst[no])
    }
  }
  
  //利潤表
  var iSPeriod = xmlRaw[4].match(/<th class="p-1[\s\S]*?>([\S]*[0-9]+[\S]*)<\/th>/g).map(item => item.replace(/<th class="p-1[\s\S]*?>([\S]*[0-9]+[\S]*)<\/th>/, '$1'))
  for(var i in iSPeriod){
    if(!(data[iSPeriod[i]])) data[iSPeriod[i]]={} 
    if(!(data[iSPeriod[i]]['利潤表'])) data[iSPeriod[i]]['利潤表']={} 
  }
  var iSXml = xmlRaw[4].replace(/<td class="p-1 p-sm-2"><span class="line trends">[\s\S]*?<\/span><\/td>/g, '').replace(/<span>[&nbsp;]*<\/span>[-\s]*[\+\s]*/g, '')
  var iSXmlLst = iSXml.match(/<td class="p-1 p-sm-2">([\s\S]+?)<\/td>/g).map(item => item.replace(/<td class="p-1 p-sm-2">([\s\S]+?)<\/td>/, '$1'))
  for(var no in iSXmlLst){
    if(no % (iSPeriod.length+1) == 0){
      handlingTitle = translateChar(iSXmlLst[no])
    }else{
      year = no % (iSPeriod.length+1) - 1
      data[iSPeriod[year]]['利潤表'][handlingTitle] = translateNumber(iSXmlLst[no])
    }
  }
  
  //現金流量表
  var cFPeriod = xmlRaw[5].match(/<th class="p-1[\s\S]*?>([\S]*[0-9]+[\S]*)<\/th>/g).map(item => item.replace(/<th class="p-1[\s\S]*?>([\S]*[0-9]+[\S]*)<\/th>/, '$1'))
  for(var i in cFPeriod){
    if(!(data[cFPeriod[i]])) data[cFPeriod[i]]={} 
    if(!(data[cFPeriod[i]]['現金流量表'])) data[cFPeriod[i]]['現金流量表']={} 
  }
  var cFXml = xmlRaw[5].replace(/<td class="p-1 p-sm-2"><span class="line trends">[\s\S]*?<\/span><\/td>/g, '').replace(/<span>[&nbsp;]*<\/span>[-\s]*[\+\s]*/g, '')
  var cFXmlLst = cFXml.match(/<td class="p-1 p-sm-2">([\s\S]+?)<\/td>/g).map(item => item.replace(/<td class="p-1 p-sm-2">([\s\S]+?)<\/td>/, '$1'))
  for(var no in cFXmlLst){
    if(no % (cFPeriod.length+1) == 0){
      handlingTitle = translateChar(cFXmlLst[no])
    }else{
      year = no % (cFPeriod.length+1) - 1
      data[cFPeriod[year]]['現金流量表'][handlingTitle] = translateNumber(cFXmlLst[no])
    }
  }
  CACHE.put(symbol+'-CBSFinancialReport', JSON.stringify(data), CACHELIFETIME)
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
      let retry = 0
      while(retry < 3){
        try{
          Logger.log('Handling: ' + symbol)
          getCBSFinancialReport(symbol)
          break
        }catch(e){
          Logger.log(e)
          Logger.log(symbol + " : CBS parse failed " + retry)
          Utilities.sleep(sleepDurationSec * 1000 * retry)
          retry  += 1
        }
      }
    }
  }
  //monthlyFinancialReportRecording()
}

// Record 
function monthlyFinancialReportRecording(){
  var sheet = SpreadsheetApp.openById(FINANCIALREPORTSSHEET_ID)
  for(var cat in STOCK_SYMBOLS){
    for(var stockNo in STOCK_SYMBOLS[cat]){
      var symbol = STOCK_SYMBOLS[cat][stockNo].split(/-(.+)/)[1].replace('-', '.')
      Logger.log("recording: " + symbol)
      var data = CACHE.get(symbol+'-CBSFinancialReport')
      if(!(data)) continue;
      data = JSON.parse(data)
      for(var year in data){
        var uuid = symbol + '-' + year.replace('近12个月', 'TTM')
        var targetRow = onSearch(sheet, uuid, searchTargetCol=0)
        if(targetRow){
          targetRow += 1
          sheet.getRange('A' + targetRow + ':H' + targetRow).setValues([[
            uuid, symbol, year.replace('近12个月', 'TTM'), 
            JSON.stringify(data[year]['五大財務比率']), JSON.stringify(data[year]['資產負債比率']), 
            JSON.stringify(data[year]['資產負債表']), JSON.stringify(data[year]['利潤表']), JSON.stringify(data[year]['現金流量表'])
          ]]) 
        }else{
          sheet.insertRowBefore(2);
          sheet.getRange('A2:H2').setValues([[
            uuid, symbol, year.replace('近12个月', 'TTM'), 
            JSON.stringify(data[year]['五大財務比率']), JSON.stringify(data[year]['資產負債比率']), 
            JSON.stringify(data[year]['資產負債表']), JSON.stringify(data[year]['利潤表']), JSON.stringify(data[year]['現金流量表'])
          ]]) 
        }
      }
    }
  }
}

function translateChar(str){
  return str.replace('货', '貨').replace('转', '轉').replace('数', '數').replace('长', '長').replace('资', '資').replace('占', '佔').replace('产', '產').replace('营', '營')
  .replace('实', '實').replace('润', '潤').replace('钱', '錢').replace('报', '報').replace('动', '動').replace('经', '經').replace('边', '邊').replace('际', '際')
  .replace('净', '淨').replace('负', '負').replace('债', '債').replace('总', '總').replace('应', '應').replace('项', '項').replace('业', '業').replace('现', '現')
  .replace('当', '當').replace('费', '費').replace('与', '與').replace('东', '東').replace('权', '權').replace('赁', '賃').replace('务', '務').replace('预', '預')
  .replace('递', '遞').replace('价', '價').replace('证', '證').replace('积', '積').replace('据', '據').replace('计', '計').replace('亏', '虧').replace('损', '損')
  .replace('誉', '譽').replace('账', '帳').replace('旧', '舊').replace('库', '庫').replace('制', '製').replace('筑', '築').replace('机', '機').replace('设', '設')
  .replace('备', '備').replace('优', '優').replace('无', '無').replace('余', '餘').replace('调', '調').replace('销', '銷').replace('摊', '攤').replace('发', '發')
  .replace('续', '續').replace('购', '購').replace('买', '買').replace('厂', '廠').replace('补', '補').replace('偿', '償').replace('额', '額').replace('币', '幣')
  .replace('运', '運').replace('变', '變').replace(' ', '').replace('=', '')
}