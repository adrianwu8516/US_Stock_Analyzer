CACHE = CacheService.getScriptCache();
CACHELIFETIME = 10800
SPECIFICCLOSEDAY = ['2020-1-2', '2020-1-21', '2020-2-18', '2020-4-11', '2020-5-26', '2020-7-4', '2020-9-8', '2020-11-27', '2020-12-26']
CBSMUSTFAIL = ['MA', 'V', 'PYPL', 'CME', 'ICE', 'AXP', 'GS', 'BAC', 'JPM', 'SPGI', 'WFC', 'C', 'SCHW', 'USB', 'AIG', 'MS', 'LVMUY', 'IBN', 'HDB']
STOCK_SYMBOLS = {
  'EC':['nasdaq-pdd', 'nasdaq-jd', 'nyse-shop', 'nasdaq-wix', 'nasdaq-ebay', 'nasdaq-etsy', 'nyse-w'],
  'Internet':['nasdaq-goog', 'nasdaq-amzn', 'nasdaq-msft', 'nasdaq-adbe', 'nasdaq-pypl', 'nyse-sq', 'nyse-four', 'nyse-bill', 'nyse-net', 'nyse-fsly', 'nasdaq-akam', 'nasdaq-crwd', 'nasdaq-fivn', 'nasdaq-bl', 'nasdaq-iac', 'nasdaq-tree', 'nasdaq-intu', 'nyse-uber', 'nasdaq-lyft', 'nasdaq-upwk', 'nyse-infy'],
  'SaaS':['nasdaq-zm', 'nyse-twlo', 'nyse-work', 'nasdaq-team', 'nasdaq-ddog', 'nyse-estc', 'nyse-dt', 'nyse-pd', 'nasdaq-splk', 'nyse-ayx', 'nasdaq-zs', 'nasdaq-docu', 'nasdaq-okta', 'nyse-smar'],
  'ChinaConcept':['nyse-se', 'nyse-baba', 'nasdaq-bidu', 'nasdaq-vnet', 'nasdaq-gds', 'nasdaq-kc', 'nasdaq-sy', 'nasdaq-sina'],
  'Streaming':['nyse-dis', 'nasdaq-nflx', 'nasdaq-cmcsa', 'nasdaq-iq', 'nasdaq-bili', 'nasdaq-roku', 'nyse-spot', 'nasdaq-tme'],
  'SNS':['nyse-twtr', 'nyse-snap', 'nasdaq-fb', 'nyse-pins', 'nasdaq-mtch', 'nasdaq-momo', 'nasdaq-yy', 'nyse-huya', 'nasdaq-doyu', 'nasdaq-wb'], 
  'Edu':['nasdaq-twou', 'nyse-chgg', 'nyse-lrn','nyse-edu', 'nyse-tal'],
  'AdTech':['nyse-crm', 'nasdaq-ttd', 'nyse-hubs', 'nyse-omc'],
  'Military':['nyse-lmt', 'nyse-ba', 'nyse-rtx', 'nyse-gd', 'nyse-noc', 'nasdaq-grmn'],
  'Airlines':['nyse-dal', 'nyse-ual','nyse-alk', 'nasdaq-aal', 'nyse-luv'],
  'Traveling':['nasdaq-bkng', 'nasdaq-expe', 'nasdaq-trip', 'nasdaq-mar', 'nyse-hlt', 'nyse-ccl', 'nasdaq-mmyt'],
  'IC':['nasdaq-amd', 'nasdaq-nvda', 'nasdaq-intc', 'nasdaq-avgo', 'nasdaq-qcom', 'nasdaq-mu', 'nasdaq-xlnx', 'nasdaq-nxpi', 'nasdaq-txn', 'nasdaq-asml', 'nasdaq-swks', 'nasdaq-qrvo', 'nasdaq-mrvl'],
  'Cannabis':['nasdaq-gwph', 'nyse-acb', 'nyse-cgc', 'nasdaq-tlry'],
  'Space':['nyse-spce', 'nyse-ajrd', 'nyse-maxr'],
  'Energy':['nyse-xom', 'nyse-psx', 'nyse-cvx', 'nyse-rds-a', 'nyse-rds-b', 'nyse-oxy'],
  'NewEnergy':['nasdaq-enph', 'nasdaq-sedg', 'nyse-gnrc', 'nasdaq-bldp', 'nasdaq-plug', 'nasdaq-fslr', 'nasdaq-spwr', 'nyse-nee', 'nyse-ora'], //VWSYF - Vestas Wind
  'Hardware':['nasdaq-logi', 'nasdaq-aapl'],
  'Health':['nasdaq-hqy', 'nasdaq-ppd', 'nyse-unh', 'nyse-lh', 'nyse-jnj', 'nyse-tmo', 'nasdaq-mtbc', 'nyse-tdoc', 'nasdaq-lvgo', 'nyse-mck', 'nyse-hca', 'nyse-cnc', 'nasdaq-algn', 'otcmkts-mdxg', 'nasdaq-ilmn', 'nyse-nvta', 'nasdaq-isrg'],
  'Medicine':['nyse-mrk', 'nasdaq-amgn', 'nyse-pfe', 'nyse-abt', 'nasdaq-biib', 'nasdaq-drrx', 'nasdaq-mrna', 'nasdaq-vygr', 'nasdaq-gild', 'nyse-rdy'],
  'Telecom':['nyse-t', 'nyse-vz', 'nasdaq-tmus'],
  'Fashion':['nyse-rl', 'nasdaq-shoo', 'nyse-anf', 'nyse-aeo', 'nyse-gps', 'nyse-lb','nyse-rvlv',  'nyse-tif', 'nyse-tpr', 'nyse-deo', 'otcmkts-lvmuy'], 
  'Gaming':['nasdaq-atvi', 'nasdaq-ea', 'nasdaq-znga', 'nasdaq-ttwo', 'nasdaq-ntes', 'nasdaq-ttwo', 'nasdaq-dkng'],
  'Catering':['nasdaq-pzza', 'nyse-mcd', 'nyse-cmg', 'nasdaq-cake', 'nyse-hsy', 'nyse-ko', 'nasdaq-pep', 'nasdaq-sbux', 'nasdaq-bynd', 'nyse-k', 'nyse-usfd'], 
  'Sport':['nyse-nke', 'nyse-ua', 'nasdaq-lulu', 'nyse-skx', 'nyse-fl'],
  'Diet':['nyse-hlf', 'nasdaq-ww', 'nyse-med', 'nyse-plnt', 'nasdaq-pton', 'nyse-vfc'],
  'Retailing':['nasdaq-cost', 'nyse-m', 'nyse-wmt', 'nyse-tgt', 'nyse-bby', 'nyse-hd', 'nyse-low', 'nyse-cvna', 'nyse-chwy', 'nasdaq-dltr'],
  'Automotive':['nasdaq-tsla', 'nyse-tm', 'nyse-hmc', 'nyse-f', 'nyse-fcau', 'nyse-gm', 'nyse-aptv', 'nyse-shll', 'nyse-nio', 'nasdaq-niu'],
  'Railways':['nyse-unp', 'nyse-nsc', 'nasdaq-csx'],
  'Industry':['nyse-ge', 'nyse-de', 'nyse-cat', 'nyse-hon', 'nyse-mhk', 'nyse-dd', 'nyse-mmm', 'nyse-keys', 'nasdaq-flir'],
  'Finance':['nyse-jpm', 'nyse-c', 'nyse-bac', 'nyse-usb', 'nyse-gs', 'nyse-ms', 'nyse-wfc', 'nyse-schw', 'nyse-axp', 'nyse-ma', 'nyse-v', 'nyse-ice', 'nasdaq-cme', 'nyse-spgi', 'nyse-aig', 'nyse-hdb', 'nyse-ibn'],
  'IT':['nasdaq-csco', 'nyse-ibm', 'nyse-orcl', 'nyse-infy', 'nyse-sap'],
  'RealEstate':['nyse-o', 'nyse-spg', 'nyse-amt', 'nyse-cci', 'nyse-iipr', 'nasdaq-reg', 'nyse-dhi', 'nyse-low', 'nasdaq-z', 'nasdaq-nymt', 'nyse-mfa'],
  'Logistics':['nyse-ups', 'nyse-fdx', 'nasdaq-dada', 'nyse-best'],
  'Consulting':['nasdaq-ctsh', 'nyse-wns']
}

ETF_LIST = {
  'Index':['nysearca-spy', 'nysearca-voo', 'nysearca-vti', 'nysearca-ivv', 'nasdaq-qqq', 'nasdaq-tqqq', 'nasdaq-sqqq', 'nysearca-spxs'],
  'US-Stock':['nysearca-xlk', 'nysearca-vgt', 'nysearca-arkw', 'nysearca-arkk', 'nysearca-mj', 'nysearca-vym', 'nysearca-vnq', 'nasdaq-ibb', 'nysearca-xlf', 'nysearca-vtv', 'nysearca-pbw', 'nasdaq-icln', 'nasdaq-qcln', 'bats-ita', 'nysearca-betz'],
  'Dividend':['nysearca-sphd', 'nysearca-spyd', 'nysearca-vig', 'nasdaq-pff'],
  'Emerging-Markets':['nysearca-vwo', 'nysearca-iemg', 'nysearca-eem', 'nysearca-ewz', 'nysearca-ewj', 'nasdaq-mchi', 'nysearca-eido', 'bats-inda', 'nysearca-ews', 'nysearca-efa'],
  'Bond':['nasdaq-tlt', 'nasdaq-iei', 'bats-govt', 'nysearca-lqd', 'nysearca-hyg', 'nysearca-jnk'],
  'Commodities':['nysearca-gld', 'nysearca-gdx', 'nysearca-iau', 'nysearca-slv', 'nysearca-uso', 'nysearca-bno', 'nysearca-xle', 'nysearca-gsg']
}

function getDataFromXpath(path, xmlDoc, target='text', removeDot = false) {
  // Replacing tbody tag because app script doesnt understand.
  path = path.replace("/html/","").replace("/tbody","");
  var tags = path.split("/");
  try {
    var root = xmlDoc.getRootElement();
    for(var i in tags) {
      var tag = tags[i];
      var index = tag.indexOf("[");
      if(index != -1) {
        var val = parseInt(tag[index+1]);
        tag = tag.substring(0,index);
        root = root.getChildren(tag)[val-1];
      }else{
        root = root.getChild(tag);
      }
    }
    var output = (target == 'text')?  root.getText().replace(/\n| +|,/g, '') : root.getAttribute(target).getValue()
    if(removeDot) output = root.getText().replace(/\./g, '')
  }catch (exception) {
    return;
  }
  return output
}

function PARSER_PACKAGE(){
  dailyMacroRecord()
  collectDataFromWeBull()
  collectDataFromCBS()
}

function RECORDER_PACKAGE(){
  dataRecordandProcess()
  if(!checkifClosed()) return;
  renewCache()
}

function renewCache(){
  CACHE.remove('index');
  CACHE.remove('etfIndex');
  //var noteObj = JSON.parse(readLog("LoggerMailer.txt"))
  //CACHE.put('index', JSON.stringify(noteObj), CACHELIFETIME)
  for(var cat in STOCK_SYMBOLS){
    for (var stockSymbol in STOCK_SYMBOLS[cat]){
      var stockName = STOCK_SYMBOLS[cat][stockSymbol].split('-')[1]
      CACHE.remove(stockName + '-history')
    }
  }
}

function onSearch(sheetName, searchString, searchTargetCol) {
  var values = sheetName.getDataRange().getValues();
  for(var i=0; i<values.length; i++) {
    if(values[i][searchTargetCol] == searchString) {return i}
  }
}

function saveLog(contents, filename, folder = STOCKFILE) {
  var children = folder.getFilesByName(filename);
  var file = null;
  if (children.hasNext()) {
    file = children.next();
    file.setContent(contents);
  } else {
    file = folder.createFile(filename, contents);
  }
}

function readLog(filename, folder = STOCKFILE) {
  var children = folder.getFilesByName(filename);
  var file = null;
  if (children.hasNext()) {
    file = children.next();
    return file.getBlob().getDataAsString();
  } else {
    Logger.log("No Logger File Found")
  }
}

//Stop if the market is closed!
function checkifClosed(){
  var today = new Date();
  if(today.getDay() < 2){Logger.log("Market Closed!");return;}
  var todayString = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate()
  if(SPECIFICCLOSEDAY.includes(todayString)){Logger.log("Holiday!");return;}
  return todayString
}

function render(file, argsObject){
  var html_page = HtmlService.createTemplateFromFile(file)
  if(argsObject){
    var keys = Object.keys(argsObject);
    keys.forEach(function(key){
      html_page[key] = argsObject[key]
    })
  }
  return html_page
        .evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
