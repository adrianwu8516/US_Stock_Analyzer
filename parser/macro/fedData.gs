function FedMonthlyModule() {
  var FedObj = {
    // Monthly Record
    personalConsumptionExpenditures: FedWebParser('https://fred.stlouisfed.org/series/PCEC96', 2),
    personalDisposableIncome: FedWebParser('https://fred.stlouisfed.org/series/DSPIC96', 3),
    realRetailandFoodServicesSales: FedWebParser('https://fred.stlouisfed.org/series/RRSFS', 4),
    durableGoodsOrder: FedWebParser('https://fred.stlouisfed.org/series/DGORDER', 5),
    durableGoodsPersonal: FedWebParser('https://fred.stlouisfed.org/series/PCEDG', 6),
    totalBusinessInventories: FedWebParser('https://fred.stlouisfed.org/series/BUSINV', 7),
    unemployedLessThan5Weeks : FedWebParser('https://fred.stlouisfed.org/series/UEMPLT5', 8),
    unemployed27WeeksOver : FedWebParser('https://fred.stlouisfed.org/series/UEMP27OV', 9),
    coreCPI: FedWebParser('https://fred.stlouisfed.org/series/CPILFESL', 10),
  }
  var macroDoc = SpreadsheetApp.openById(MACROSHEET_ID).getSheetByName('FED每月數據');
  for(var item in FedObj){
    var peroid = FedObj[item].period
    var targetRow = onSearch(macroDoc, peroid, searchTargetCol=0)
    if(targetRow){
      macroDoc.getRange(1, FedObj[item].index).setValue(item);
      macroDoc.getRange(targetRow+1, FedObj[item].index).setValue(FedObj[item].data);
    }else{
      macroDoc.insertRowAfter(1);
      macroDoc.getRange(2, 1).setValues([[FedObj[item].period]]);
      macroDoc.getRange(2, FedObj[item].index).setValue(FedObj[item].data);
    }
  }
  return
}

function FedQuarterlyModule(){
  var FedObj = {
    nominalGDP: FedWebParser('https://fred.stlouisfed.org/series/GDP', 2),
    realGDP: FedWebParser('https://fred.stlouisfed.org/series/GDPC1', 3),
    realExports: FedWebParser('https://fred.stlouisfed.org/series/EXPGSC1', 4),
    realImports: FedWebParser('https://fred.stlouisfed.org/series/IMPGSC1', 5),
    netExports: FedWebParser("https://fred.stlouisfed.org/series/NETEXP", 6),
    privateDomesticInvestment: FedWebParser('https://fred.stlouisfed.org/series/GPDIC1', 7),
    privateResidentialFixedInvestment: FedWebParser('https://fred.stlouisfed.org/series/PRFI', 8),
    privateNonresidentialFixedInvestment: FedWebParser('https://fred.stlouisfed.org/series/PNFI', 9),
    GDPContrConsumption: FedWebParser("https://fred.stlouisfed.org/series/DPCERY2Q224SBEA", 10),
    GDPContrConsumptionDurable: FedWebParser("https://fred.stlouisfed.org/series/DDURRY2Q224SBEA", 11),
    GDPContrConsumptionDurableVehicles: FedWebParser("https://fred.stlouisfed.org/series/DMOTRY2Q224SBEA", 12),
    GDPContrConsumptionDurableHousehold: FedWebParser("https://fred.stlouisfed.org/series/DFDHRY2Q224SBEA", 13),
    GDPContrConsumptionDurableRecreational: FedWebParser("https://fred.stlouisfed.org/series/DREQRY2Q224SBEA", 14),
    GDPContrConsumptionNonDurable: FedWebParser("https://fred.stlouisfed.org/series/A356RY2Q224SBEA", 15),
    GDPContrConsumptionNonDurableClothing: FedWebParser("https://fred.stlouisfed.org/series/DCLORY2Q224SBEA", 16),
    GDPContrConsumptionNonDurableFood: FedWebParser("https://fred.stlouisfed.org/series/DFXARY2Q224SBEA", 17),
    GDPContrConsumptionNonDurableGasoline: FedWebParser("https://fred.stlouisfed.org/series/DGOERY2Q224SBEA", 18),
    GDPContrConsumptionService: FedWebParser("https://fred.stlouisfed.org/series/DSERRY2Q224SBEA", 19),
    GDPContrConsumptionServiceHousing: FedWebParser("https://fred.stlouisfed.org/series/DHUTRY2Q224SBEA", 20),
    GDPContrConsumptionServiceHealth: FedWebParser("https://fred.stlouisfed.org/series/DHLCRY2Q224SBEA", 21),
    GDPContrConsumptionServiceTransportation: FedWebParser("https://fred.stlouisfed.org/series/DTRSRY2Q224SBEA", 22),
    GDPContrConsumptionServiceRecreation: FedWebParser("https://fred.stlouisfed.org/series/DRCARY2Q224SBEA", 23),
    GDPContrConsumptionServiceFood: FedWebParser("https://fred.stlouisfed.org/series/DFSARY2Q224SBEA", 24),
    GDPContrConsumptionServiceFinancial: FedWebParser("https://fred.stlouisfed.org/series/DIFSRY2Q224SBEA", 25),
    GDPContrInvestment: FedWebParser("https://fred.stlouisfed.org/series/A006RY2Q224SBEA", 26),
    GDPContrInvestmentFixed: FedWebParser("https://fred.stlouisfed.org/series/A007RY2Q224SBEA", 27),
    GDPContrInvestmentFixedNonResidential: FedWebParser("https://fred.stlouisfed.org/series/A008RY2Q224SBEA", 28),
    GDPContrInvestmentFixedNonResidentialStructures: FedWebParser("https://fred.stlouisfed.org/series/A009RY2Q224SBEA", 29),
    GDPContrInvestmentFixedNonResidentialEquipment: FedWebParser("https://fred.stlouisfed.org/series/Y033RY2Q224SBEA", 30),
    GDPContrInvestmentFixedNonResidentialEquipmentInformationProcessing: FedWebParser("https://fred.stlouisfed.org/series/Y034RY2Q224SBEA", 31),
    GDPContrInvestmentFixedNonResidentialEquipmentIndustrial : FedWebParser("https://fred.stlouisfed.org/series/A680RY2Q224SBEA", 32),
    GDPContrInvestmentFixedNonResidentialEquipmentTransportation: FedWebParser("https://fred.stlouisfed.org/series/A681RY2Q224SBEA", 33),
    GDPContrInvestmentFixedNonResidentialIP: FedWebParser("https://fred.stlouisfed.org/series/Y001RY2Q224SBEA", 34),
    GDPContrInvestmentFixedNonResidentialIPSoftware: FedWebParser("https://fred.stlouisfed.org/series/B985RY2Q224SBEA", 35),
    GDPContrInvestmentFixedNonResidentialIPRD: FedWebParser("https://fred.stlouisfed.org/series/Y006RY2Q224SBEA", 36),
    GDPContrInvestmentFixedNonResidentialIPEntertainment: FedWebParser("https://fred.stlouisfed.org/series/Y020RY2Q224SBEA", 37),
    GDPContrInvestmentFixedResidential: FedWebParser("https://fred.stlouisfed.org/series/A011RY2Q224SBEA", 38),
    GDPContrInvestmentInventories: FedWebParser("https://fred.stlouisfed.org/series/A014RY2Q224SBEA", 39),
    GDPContrGov: FedWebParser("https://fred.stlouisfed.org/series/A822RY2Q224SBEA", 40),
    GDPContrGovDefense: FedWebParser("https://fred.stlouisfed.org/series/A824RY2Q224SBEA", 41),
    GDPContrExport: FedWebParser("https://fred.stlouisfed.org/series/A020RY2Q224SBEA", 42),
    GDPContrImport: FedWebParser("https://fred.stlouisfed.org/series/A021RY2Q224SBEA", 43),
  }
  var macroDoc = SpreadsheetApp.openById(MACROSHEET_ID).getSheetByName('FED每季數據');
  for(var item in FedObj){
    var peroid = FedObj[item].period
    var targetRow = onSearch(macroDoc, peroid, searchTargetCol=0)
    if(targetRow){
      macroDoc.getRange(1, FedObj[item].index).setValue(item);
      macroDoc.getRange(targetRow+1, FedObj[item].index).setValue(FedObj[item].data);
    }else{
      macroDoc.insertRowAfter(1);
      macroDoc.getRange(2, 1).setValues([[FedObj[item].period]]);
      macroDoc.getRange(2, FedObj[item].index).setValue(FedObj[item].data);
    }
  }
  return
}

function FedWebParser(url, recordPlace){
  // recordPlace starts from 2
  let xml = UrlFetchApp.fetch(url).getContentText();
  let data = xml.replace(/[\s\S]*?<span class="series-meta-observation-value">([\s\S]*?)<\/span>[\s\S]*/, '$1')
  let period = xml.replace(/[\s\S]*?<div id="mobile-meta-col" style="display:none;" class="pull-left col-xs-12">[\s]*([\s\S]*?): <span class="series-meta-observation-value">[\s\S]*/, '$1').replace(/ /g, '')
  return {data:data, period:period, index:recordPlace}
}
