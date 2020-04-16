function doGet(e){
  Logger.log(e.queryString)
  if(e.queryString !==''){  
    switch(e.parameter.mode){
      case 'historyData': 
        return e.parameter.symbol? historyChartController(e.parameter.symbol) : messageController("Chart Not Found!!")
      case 'historyCompare': 
        return e.parameter.symbols? historyCompareController(e.parameter.symbols) : messageController("Chart Not Found!!")
      case 'unsubscribe': 
        return e.parameter.email? unsubscribeController(e.parameter.email) : messageController("No Such Email")
      default:
        return messageController("404 Page Not Found!!")
    }
  }else{
    return messageController("404 Page Not Found!!")
  }
}