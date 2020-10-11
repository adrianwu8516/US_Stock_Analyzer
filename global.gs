CACHE = CacheService.getScriptCache();
CACHELIFETIME = 10800
SPECIFICCLOSEDAY = ['2020-1-2', '2020-1-21', '2020-2-18', '2020-4-11', '2020-5-26', '2020-7-4', '2020-9-8', '2020-11-27', '2020-12-26']
CBSMUSTFAIL = ['MA', 'V', 'PYPL', 'CME', 'ICE', 'AXP', 'GS', 'BAC', 'JPM', 'SPGI', 'WFC', 'C', 'SCHW', 'USB', 'AIG', 'MS', 'LVMUY', 'IBN', 'HDB', 'STNE', 'DFS', 'FISV', 'PNC', 'IBN', 'CINF', 'SLM']
STOCK_SYMBOLS = {
  'EC':['nasdaq-pdd', 'nasdaq-jd', 'nyse-shop', 'nasdaq-bigc', 'nasdaq-wix', 'nasdaq-ebay', 'nasdaq-etsy', 'nyse-w', 'nasdaq-ostk', 'nasdaq-meli', 'nasdaq-bzun', 'nyse-jmia'],
  'Internet':['nasdaq-goog', 'nasdaq-amzn', 'nasdaq-msft', 'nasdaq-yndx', 'nyse-veev', 'nyse-net', 'nyse-fsly', 'nyse-vmw', 'nasdaq-llnw', 'nasdaq-akam', 'nasdaq-crwd', 'nasdaq-fivn', 'nasdaq-bl', 'nasdaq-iac', 'nasdaq-intu', 'nyse-uber', 'nasdaq-lyft', 'nyse-grub', 'nasdaq-upwk', 'nyse-fvrr', 'nyse-lmnd', 'nyse-sstk'],
  'SaaS':['nasdaq-zm', 'nyse-twlo', 'nyse-rng', 'nasdaq-adbe', 'nasdaq-adsk', 'nyse-work', 'nasdaq-team', 'nyse-asan', 'nasdaq-dbx', 'nyse-now', 'nasdaq-ddog', 'nyse-snow', 'nasdaq-frog', 'nyse-estc', 'nyse-dt', 'nyse-pd', 'nasdaq-splk', 'nyse-ayx', 'nasdaq-sumo', 'nasdaq-zs', 'nasdaq-docu', 'nasdaq-okta', 'nyse-smar', 'nyse-rng', 'nasdaq-ftnt', 'nasdaq-mdb', 'nyse-zuo', 'nasdaq-pega', 'nasdaq-amba', 'nyse-pstg', 'nasdaq-tlnd', 'nyse-zen', 'nasdaq-zi'],
  'FinTech':['nasdaq-pypl', 'nyse-sq', 'nyse-four', 'nyse-bill', 'nasdaq-ncno', 'nasdaq-stne', 'nyse-rkt', 'nasdaq-tree', 'nyse-axp', 'nyse-ma', 'nyse-v', 'nyse-dfs', 'nasdaq-fisv', 'nasdaq-ssnc'],
  'ChinaConcept':['nyse-se', 'nyse-baba', 'otcmkts-tcehy', 'nasdaq-bidu', 'nasdaq-vnet', 'nasdaq-gds', 'nasdaq-kc', 'nasdaq-sy', 'nasdaq-sina', 'nasdaq-futu', 'nasdaq-tcom','nyse-beke'],
  'Streaming':['nyse-dis', 'nasdaq-nflx', 'nasdaq-cmcsa', 'nasdaq-iq', 'nasdaq-bili', 'nasdaq-roku', 'nasdaq-sono', 'nyse-spot', 'nasdaq-tme'],
  'SNS':['nyse-twtr', 'nyse-snap', 'nasdaq-fb', 'nyse-pins', 'nasdaq-mtch', 'nasdaq-momo', 'nasdaq-yy', 'nyse-huya', 'nasdaq-doyu', 'nasdaq-wb'], 
  'Edu':['nasdaq-twou', 'nasdaq-boxl', 'nyse-chgg', 'nyse-lrn','nyse-edu', 'nyse-tal'],
  'AdTech':['nyse-crm', 'nyse-hubs', 'nasdaq-ttd', 'nasdaq-mgni',  'nyse-omc', 'nasdaq-lamr', 'nasdaq-apps', 'nasdaq-nxst'],
  'Military':['nyse-lmt', 'nyse-ba', 'nyse-rtx', 'nyse-gd', 'nyse-noc', 'nyse-hei'],
  'Aerospace':['nyse-spce', 'nyse-ajrd', 'nyse-maxr', 'nyse-dal', 'nyse-ual','nyse-alk', 'nasdaq-aal', 'nyse-luv', 'nyse-spr', 'nyse-save', 'nyse-asr', 'nyse-pac', 'nasdaq-omab'],
  'Traveling':['nasdaq-bkng', 'nasdaq-expe', 'nasdaq-trip', 'nasdaq-mar', 'nyse-hlt', 'nyse-ccl', 'nasdaq-mmyt', 'nyse-mgm', 'nasdaq-wynn', 'nyse-lvs'],
  'IC':['nasdaq-amd', 'nasdaq-nvda', 'nasdaq-intc', 'nasdaq-avgo', 'nasdaq-qcom', 'nasdaq-mu', 'nasdaq-xlnx', 'nasdaq-nxpi', 'nasdaq-txn', 'nasdaq-asml', 'nasdaq-swks', 'nasdaq-qrvo', 'nasdaq-mrvl', 'nasdaq-lite', 'nasdaq-insg', 'nasdaq-lrcx'],
  'Cannabis':['nasdaq-gwph', 'nyse-acb', 'nasdaq-apha', 'nyse-cgc', 'nasdaq-tlry', 'otcmkts-cwbhf', 'nyse-mo', 'nyse-pm'],
  'ArgiTech':['nasdaq-cvgw', 'otcmkts-bayry', 'nasdaq-bynd', 'nasdaq-fmci', 'nasdaq-opes'],
  'Energy':['nyse-xom', 'nyse-psx', 'nyse-cvx', 'nyse-rds-a', 'nyse-rds-b', 'nyse-oxy', 'nyse-et', 'nyse-ceqp', 'nyse-atco', 'nyse-tpl'],
  'NewEnergy':['nasdaq-enph', 'nasdaq-sedg', 'nyse-gnrc', 'nasdaq-bldp', 'nasdaq-plug', 'nasdaq-fslr', 'nasdaq-spwr', 'nyse-nee', 'nyse-ora', 'nyse-bep'], //VWSYF - Vestas Wind
  'Hardware':['nasdaq-logi', 'nasdaq-aapl', 'nasdaq-pi', 'nasdaq-irbt', 'nasdaq-vicr', 'nasdaq-gpro', 'nasdaq-wdc', 'nasdaq-stx'],
  'Health':['nasdaq-hqy', 'nasdaq-ppd', 'nyse-unh', 'nyse-lh', 'nyse-tmo', 'nasdaq-mtbc', 'nyse-tdoc', 'nasdaq-lvgo', 'nyse-mck', 'nyse-hca', 'nyse-cnc', 'nasdaq-algn', 'otcmkts-mdxg', 'nasdaq-ilmn', 'nyse-nvta', 'nasdaq-isrg', 'nyse-vapo', 'nasdaq-srne', 'nasdaq-prsc', 'nasdaq-bli', 'nasdaq-txg', 'nasdaq-cort', 'nasdaq-inva', 'nyse-nvst', 'nyse-abbv', 'nyse-coo', 'nasdaq-abmd'],//
  'Medicine':['nyse-mrk', 'nyse-jnj', 'nasdaq-amgn', 'nyse-pfe', 'nyse-abt', 'nasdaq-biib', 'nasdaq-drrx', 'nasdaq-mrna', 'nasdaq-vygr', 'nasdaq-gild', 'nyse-rdy', 'nasdaq-crsp', 'nasdaq-blue', 'nasdaq-ino'],
  'Telecom':['nyse-t', 'nyse-vz', 'nasdaq-tmus', 'otcmkts-sftby', 'nasdaq-eric', 'nyse-nok', 'nasdaq-comm', 'nyse-cien', 'nyse-jnpr', 'otcmkts-ifnny'],
  'Fashion':['nyse-rl', 'nasdaq-shoo', 'nyse-anf', 'nyse-aeo', 'nyse-gps', 'nyse-lb','nyse-rvlv',  'nyse-tif', 'nyse-tpr', 'nyse-deo', 'otcmkts-lvmuy', 'nyse-rvlv', 'nyse-tjx', 'nasdaq-rost'], 
  'Gaming':['nyse-u', 'nasdaq-atvi', 'nasdaq-ea', 'nasdaq-znga', 'nasdaq-ttwo', 'nasdaq-ntes', 'nasdaq-ttwo', 'nasdaq-dkng', 'nasdaq-penn', 'otcmkts-pdypy'],
  'Catering':['nyse-yum', 'nyse-qsr', 'nyse-dpz', 'nasdaq-pzza', 'nyse-mcd', 'nyse-cmg', 'nasdaq-cake', 'nyse-hsy', 'nyse-ko', 'nasdaq-pep', 'nasdaq-mnst', 'nasdaq-fizz', 'nasdaq-sbux', 'nyse-k', 'nyse-gis', 'nyse-usfd', 'nyse-tsn', 'nyse-sam', 'nyse-bud', 'nyse-stz', 'nasdaq-play'], 
  'Sport':['nyse-nke', 'nyse-ua', 'nasdaq-lulu', 'nyse-skx', 'nyse-fl'],
  'Diet':['nyse-hlf', 'nasdaq-ww', 'nyse-nus', 'nyse-med', 'nyse-plnt', 'nasdaq-pton', 'nyse-vfc', 'nasdaq-grmn'],
  'Retailing':['nasdaq-cost', 'nyse-m', 'nyse-jwn', 'nyse-wmt', 'nyse-tgt', 'nyse-bby', 'nyse-hd', 'nyse-low', 'nyse-cvna', 'nasdaq-dltr', 'nyse-dg', 'nyse-azo', 'nasdaq-five'],
  'Transport':['nasdaq-tsla', 'nyse-tm', 'nyse-hmc', 'nyse-f', 'nyse-fcau', 'nyse-gm', 'nyse-aptv', 'nyse-hyln', 'nyse-nio', 'nasdaq-niu', 'nasdaq-li', 'nasdaq-gp', 'nyse-unp', 'nyse-nsc', 'nasdaq-csx'],
  'Industry':['nyse-ge', 'nyse-de', 'nyse-cat', 'nyse-hon', 'nyse-mhk', 'nyse-dd', 'nyse-dow', 'nyse-mmm', 'nyse-keys', 'nasdaq-flir', 'nyse-glw', 'nyse-vsto', 'nyse-gold', 'nyse-nem', 'nyse-kl', 'nyse-trtn'],
  'Finance':['nyse-jpm', 'nyse-c', 'nyse-bac', 'nyse-usb', 'nyse-gs', 'nyse-ms', 'nyse-wfc', 'nyse-schw', 'nyse-ice', 'nasdaq-cme', 'nyse-spgi', 'nyse-aig', 'nyse-hdb', 'nyse-ibn', 'nasdaq-cinf', 'nyse-pnc', 'nasdaq-slm'],
  'ITSolution':['nasdaq-csco', 'nyse-ibm', 'nyse-orcl', 'nyse-infy', 'nyse-sap', 'nyse-pltr', 'nasdaq-ctsh', 'nasdaq-nvee', 'nyse-wns', 'nyse-anet', 'nasdaq-adp', 'nyse-tnet', 'nyse-cday', 'nyse-payc', 'nasdaq-wday'],
  'RealEstate':['nyse-o', 'nyse-spg', 'nyse-mac', 'nasdaq-bpy', 'nyse-bam', 'nyse-amt', 'nyse-cci', 'nyse-iipr', 'nyse-stor', 'nyse-wpc', 'nasdaq-reg', 'nyse-epr', 'nyse-apts', 'nyse-dhi', 'nyse-low', 'nasdaq-z', 'nasdaq-nymt', 'nyse-mfa', 'nyse-ivr', 'nyse-eqr', 'nyse-tol'],  //, 'nyse-srg'
  'Logistics':['nyse-ups', 'nyse-fdx', 'nyse-tfii', 'nasdaq-dada', 'nyse-best'], 
  'DailyLife':['nyse-sci', 'nyse-wm', 'nyse-cnk', 'nyse-amc', 'nyse-el', 'nasdaq-ulta', 'nyse-pg', 'nyse-kmb', 'nyse-cl', 'nyse-un', 'nyse-ntco', 'nasdaq-wdfc', 'nasdaq-mbuu', 'nasdaq-itri'],
  'pets':['nyse-zts', 'nyse-chwy', 'nasdaq-cvet', 'nasdaq-frpt', 'nasdaq-idxx', 'nasdaq-pets']
}

ETF_LIST = {
  'Index':['nysearca-spy', 'nysearca-voo', 'nysearca-vti', 'nysearca-ivv', 'nasdaq-qqq', 'nasdaq-tqqq', 'nasdaq-sqqq', 'nysearca-spxs'],
  'US-Stock':['nysearca-gvip', 'nysearca-xlk', 'nysearca-vgt', 'nysearca-arkw', 'nysearca-arkk', 'nysearca-mj', 'nysearca-vym', 'nysearca-vnq', 'nasdaq-ibb', 'nysearca-xlf', 'nysearca-vtv', 'nysearca-pbw', 'nasdaq-icln', 'nasdaq-qcln', 'bats-ita', 'nysearca-betz', 'nysearca-schh', 'nasdaq-espo', 'bats-prnt'],
  'Dividend':['nysearca-sphd', 'nysearca-spyd', 'nysearca-vig', 'nasdaq-pff'],
  'Emerging-Markets':['nysearca-vwo', 'nysearca-iemg', 'nysearca-eem', 'nysearca-ewz', 'nysearca-ewj', 'nasdaq-mchi', 'nysearca-eido', 'bats-inda', 'nysearca-ews', 'nysearca-efa'],
  'Bond':['nasdaq-tlt', 'nasdaq-iei', 'bats-govt', 'nysearca-lqd', 'nysearca-hyg', 'nysearca-jnk'],
  'Commodities':['nysearca-gld', 'nysearca-gdx', 'nysearca-iau', 'nysearca-slv', 'nysearca-uso', 'nysearca-bno', 'nysearca-xle', 'nysearca-gsg']
}

function count(){
  let total = 0
  for(var cat in STOCK_SYMBOLS){
    total += cat.length
  }
  for(var cat in ETF_LIST){
    total += cat.length
  }
  Logger.log(total)
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

function REGENERATELOG(){
  collectDataFromWeBull()
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

function saveLog(contents, filename, folder = LOGFILE) {
  var children = folder.getFilesByName(filename);
  var file = null;
  if (children.hasNext()) {
    file = children.next();
    file.setContent(contents);
  } else {
    file = folder.createFile(filename, contents);
  }
}

function readLog(filename, folder = LOGFILE) {
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

function transpose(a) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}