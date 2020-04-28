CACHE = CacheService.getScriptCache();
CACHELIFETIME = 10800
SPECIFICCLOSEDAY = ['2020-1-2', '2020-1-21', '2020-2-18', '2020-4-11', '2020-5-26', '2020-7-4', '2020-9-8', '2020-11-27', '2020-12-26']
CBSMUSTFAIL = ['MA', 'V', 'PYPL']
STOCK_SYMBOLS = {
  'E-commerce':['nasdaq-pdd', 'nasdaq-jd', 'nyse-shop', 'nasdaq-wix'],
  'Internet Service':['nasdaq-goog', 'nasdaq-amzn', 'nasdaq-adbe', 'nyse-ma', 'nyse-v', 'nasdaq-zm', 'nyse-work', 'nasdaq-msft', 'nasdaq-pypl'],
  'Internet Service (China)':['nyse-se', 'nyse-baba', 'nasdaq-ntes', 'nasdaq-bidu', 'nasdaq-vnet'],
  'Video Streaming':['nyse-dis', 'nasdaq-nflx', 'nasdaq-roku'],
  'Social Network Service':['nyse-twtr', 'nyse-snap', 'nasdaq-fb'], 
  'Advertisement and Sales':['nyse-crm', 'nasdaq-ttd'],
  'Military Industry':['nyse-lmt', 'nyse-ba', 'nyse-rtx', 'nyse-gd', 'nyse-noc', 'nasdaq-grmn'],
  'Airlines':['nyse-dal', 'nyse-ual','nyse-alk', 'nasdaq-aal', 'nyse-luv'],
  'Travel':['nasdaq-bkng', 'nasdaq-expe'],
  'GPU':['nasdaq-amd', 'nasdaq-nvda'],
  'Cannabis':['nasdaq-gwph', 'nyse-acb'],
  'Space':['nyse-spce', 'nyse-ajrd', 'nyse-maxr'],
  'Energy Company':['nyse-xom', 'nyse-psx', 'nyse-cvx'],
  'Hype':['nasdaq-bynd','nasdaq-tsla', 'nasdaq-lk', 'nasdaq-sbux'],
  'Hardware':['nasdaq-logi', 'nasdaq-aapl']
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
