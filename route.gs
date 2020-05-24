function doGet(e){
  Logger.log(e.queryString)
  if(e.queryString !==''){  
    switch(e.parameter.mode){
      case 'historyData': 
        return e.parameter.symbol? historyChartController(e.parameter.symbol) : messageController("Chart Not Found!!")
      case 'historyETFData': 
        return e.parameter.symbol? historyETFChartController(e.parameter.symbol) : messageController("Chart Not Found!!")
      case 'compare': 
        return e.parameter.symbols? historyCompareController(e.parameter.symbols) : messageController("Chart Not Found!!")
      case 'unsubscribe': 
        return (e.parameter.email && e.parameter.id) ? unsubscribeController(e.parameter.email, e.parameter.id) : messageController("No Such Email or ID")
      case 'etf': 
        return indexController("etf")
      case 'stock': 
        return indexController("stock")
      default:
        return indexController("stock")
    }
  }else{
    Logger.log('Here')
    return indexController("stock")
  }
}