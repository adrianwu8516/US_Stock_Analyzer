CACHE = CacheService.getScriptCache();
CACHELIFETIME = 10800
SPECIFICCLOSEDAY = ['2020-1-2', '2020-1-21', '2020-2-18', '2020-4-11', '2020-5-26', '2020-7-4', '2020-9-8', '2020-11-27', '2020-12-26']
CBSMUSTFAIL = ['MA', 'V', 'PYPL']
STOCK_SYMBOLS = {
  'EC':['nasdaq-pdd', 'nasdaq-jd', 'nyse-shop', 'nasdaq-wix', 'nasdaq-ebay'],
  'Internet':['nasdaq-goog', 'nasdaq-amzn', 'nasdaq-adbe', 'nyse-ma', 'nyse-v', 'nasdaq-zm', 'nyse-work', 'nasdaq-msft', 'nasdaq-pypl', 'nasdaq-mtch', 'nyse-net'],
  'Internet-China':['nyse-se', 'nyse-baba', 'nasdaq-bidu', 'nasdaq-vnet', 'nasdaq-kc'],
  'Streaming':['nyse-dis', 'nasdaq-nflx', 'nasdaq-roku', 'nyse-spot'],
  'SNS':['nyse-twtr', 'nyse-snap', 'nasdaq-fb', 'nyse-pins'], 
  'AdTech':['nyse-crm', 'nasdaq-ttd', 'nyse-hubs', 'nyse-omc'],
  'Military':['nyse-lmt', 'nyse-ba', 'nyse-rtx', 'nyse-gd', 'nyse-noc', 'nasdaq-grmn'],
  'Airlines':['nyse-dal', 'nyse-ual','nyse-alk', 'nasdaq-aal', 'nyse-luv'],
  'Traveling':['nasdaq-bkng', 'nasdaq-expe', 'nasdaq-trip', 'nasdaq-mar', 'nyse-hlt'],
  'IC':['nasdaq-amd', 'nasdaq-nvda', 'nasdaq-intc', 'nasdaq-avgo', 'nasdaq-qcom'],
  'Cannabis':['nasdaq-gwph', 'nyse-acb', 'nyse-cgc', 'nasdaq-tlry'],
  'Space':['nyse-spce', 'nyse-ajrd', 'nyse-maxr'],
  'Energy':['nyse-xom', 'nyse-psx', 'nyse-cvx', 'nyse-rds-a'],
  'Hardware':['nasdaq-logi', 'nasdaq-aapl'],
  'Health':['nasdaq-hqy', 'nasdaq-ppd', 'nyse-lh', 'nasdaq-amgn', 'nasdaq-biib', 'nyse-jnj', 'nyse-tmo'], //, 'nasdaq-mtbc'
  'Telecom':['nyse-t', 'nyse-vz', 'nasdaq-tmus'],
  'Fashion':['nyse-rl', 'nasdaq-shoo', 'nyse-anf', 'nyse-aeo', 'nyse-gps', 'nyse-lb', 'nyse-tif', 'nyse-tpr', 'nyse-deo'], //, 'otcmkts-lvmuy'
  'Gaming':['nasdaq-atvi', 'nasdaq-ea', 'nasdaq-znga', 'nasdaq-ttwo', 'nasdaq-ntes'],
  'Catering':['nasdaq-pzza', 'nyse-mcd', 'nyse-cmg', 'nyse-hsy', 'nyse-ko', 'nasdaq-lk', 'nasdaq-sbux', 'nasdaq-bynd'], 
  'Sport':['nyse-nke', 'nyse-ua', 'nasdaq-lulu', 'nyse-skx', 'nyse-fl'],
  'Diet':['nyse-hlf', 'nasdaq-ww', 'nyse-plnt', 'nasdaq-pton', 'nyse-vfc'],
  'Retailing':['nasdaq-cost', 'nyse-m', 'nyse-wmt', 'nyse-tgt', 'nyse-bby', 'nyse-low'],
  'Automotive':['nasdaq-tsla', 'nyse-tm', 'nyse-hmc', 'nyse-f', 'nyse-fcau', 'nyse-gm'],
  'Railways':['nyse-unp', 'nyse-nsc', 'nasdaq-csx'],
  'Machinery':['nyse-de', 'nyse-cat', 'nyse-hon']
}
CATLIST = Object.keys(STOCK_SYMBOLS)

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
  collectDataFromWeBull()
  collectDataFromCBS()
  dataRecordandProcess()
  if(!checkifClosed()) return;
  renewCache()
}

function renewCache(){
  CACHE.remove('index');
  var noteObj = JSON.parse(readLog("LoggerMailer.txt"))
  CACHE.put('index', JSON.stringify(noteObj), CACHELIFETIME)
}

function onSearch(sheetName, searchString, searchTargetCol) {
  var values = sheetName.getDataRange().getValues();
  for(var i=values.length-1, basic=0; i>basic; i--) {
    if(values[i][searchTargetCol] == searchString) {return i;}
  }
}

function saveLog(contents, filename) {
  var children = STOCKFILE.getFilesByName(filename);
  var file = null;
  if (children.hasNext()) {
    file = children.next();
    file.setContent(contents);
  } else {
    file = STOCKFILE.createFile(filename, contents);
  }
}

function readLog(filename) {
  var children = STOCKFILE.getFilesByName(filename);
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
