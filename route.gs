function doGet(e){
  Logger.log(e.queryString)
  if(e.queryString !==''){  
    switch(e.parameter.mode){
      case 'historyData': 
        return e.parameter.symbol? historyChartController(e.parameter.symbol) : errorMessageController("Chart Not Found!!")
      case 'historyCompare': 
        Logger.log(e.parameter.symbols)
        return e.parameter.symbols? historyCompareController(e.parameter.symbols) : errorMessageController("Chart Not Found!!")
      default:
        return errorMessageController("404 Page Not Found!!")
    }
  }else{
    return errorMessageController("404 Page Not Found!!")
  }
}