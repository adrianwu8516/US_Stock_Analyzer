function macroData(span=5){
  var macroDoc = SpreadsheetApp.openById(MACROSHEET_ID).getSheetByName('每日數據')
  var macroMonthlyDoc = SpreadsheetApp.openById(MACROSHEET_ID).getSheetByName('每月數據')
  var rawData = transpose(macroDoc.getSheetValues(2, 1, span, 14))
  var rawMonthlyData = transpose(macroMonthlyDoc.getSheetValues(2, 1, span, 25))
  var macroDataJSON = {
    date:                rawData[0].reverse(),
    fearGreed:           rawData[1].reverse(),
    fearGreedNote:       rawData[2].reverse(),
    fearGreedRatio:      rawData[3].reverse(),
    globalRecession:     rawData[4].reverse(),
    mmCovid19:           rawData[5].reverse(),
    mmBuffettIndex:      rawData[6].reverse(),
    sInvestorBear:       rawData[7].reverse(),
    sInvestorNeutral:    rawData[8].reverse(),
    sInvestorBull:       rawData[9].reverse(),
    gapYield10to2:       rawData[10].reverse(),
    snp500Index:         rawData[11].reverse(),
    vix:                 rawData[12].reverse(),
    requiredMarketReturn:rawData[13].reverse(),
    week:         rawMonthlyData[0].reverse(),
    mmShillerPE:  rawMonthlyData[1].reverse()
  }
  Logger.log(macroDataJSON)
  return macroDataJSON
}

function macroFEDQuarterlyData(span){
  var macroQuarterlyData = SpreadsheetApp.openById(MACROSHEET_ID).getSheetByName('FED每季數據')
  var rawData = transpose(macroQuarterlyData.getSheetValues(2, 1, span, 43))
  var fedJSON = {
    period: rawData[0].reverse(),
    nominalGDP: changeRate(rawData[1].reverse()),
    realGDP: changeRate(rawData[2].reverse()),
    realExports: changeRate(rawData[3].reverse()),
    realImports: changeRate(rawData[4].reverse()),
    netExports: changeRate(rawData[5].reverse()),
    privateDomesticInvestment: changeRate(rawData[6].reverse()),
    privateResidentialFixedInvestment: changeRate(rawData[7].reverse()),
    privateNonresidentialFixedInvestment: changeRate(rawData[8].reverse()),
    GDPContrConsumption: rawData[9].reverse(),
    GDPContrConsumptionDurable: rawData[10].reverse(),
    GDPContrConsumptionDurableVehicles: rawData[11].reverse(),
    GDPContrConsumptionDurableHousehold: rawData[12].reverse(),
    GDPContrConsumptionDurableRecreational: rawData[13].reverse(),
    GDPContrConsumptionNonDurable: rawData[14].reverse(),
    GDPContrConsumptionNonDurableClothing: rawData[15].reverse(),
    GDPContrConsumptionNonDurableFood: rawData[16].reverse(),
    GDPContrConsumptionNonDurableGasoline: rawData[17].reverse(),
    GDPContrConsumptionService: rawData[18].reverse(),
    GDPContrConsumptionServiceHousing: rawData[19].reverse(),
    GDPContrConsumptionServiceHealth: rawData[20].reverse(),
    GDPContrConsumptionServiceTransportation: rawData[21].reverse(),
    GDPContrConsumptionServiceRecreation: rawData[22].reverse(),
    GDPContrConsumptionServiceFood: rawData[23].reverse(),
    GDPContrConsumptionServiceFinancial: rawData[24].reverse(),
    GDPContrInvestment: rawData[25].reverse(),
    GDPContrInvestmentFixed: rawData[26].reverse(),
    GDPContrInvestmentFixedNonResidential: rawData[27].reverse(),
    GDPContrInvestmentFixedNonResidentialStructures: rawData[28].reverse(),
    GDPContrInvestmentFixedNonResidentialEquipment: rawData[29].reverse(),
    GDPContrInvestmentFixedNonResidentialEquipmentInformationProcessing: rawData[30].reverse(),
    GDPContrInvestmentFixedNonResidentialEquipmentIndustrial: rawData[31].reverse(),
    GDPContrInvestmentFixedNonResidentialEquipmentTransportation: rawData[32].reverse(),
    GDPContrInvestmentFixedNonResidentialIP: rawData[33].reverse(),
    GDPContrInvestmentFixedNonResidentialIPSoftware: rawData[34].reverse(),
    GDPContrInvestmentFixedNonResidentialIPRD: rawData[35].reverse(),
    GDPContrInvestmentFixedNonResidentialIPEntertainment: rawData[36].reverse(),
    GDPContrInvestmentFixedResidential: rawData[37].reverse(),
    GDPContrInvestmentInventories: rawData[38].reverse(),
    GDPContrGov: rawData[39].reverse(),
    GDPContrGovDefense: rawData[40].reverse(),
    GDPContrExport: rawData[41].reverse(),
    GDPContrImport: rawData[42].reverse()
  }
  Logger.log(fedJSON)
  return fedJSON
}

function macroFEDMonthlyData(span){
  var macroQuarterlyData = SpreadsheetApp.openById(MACROSHEET_ID).getSheetByName('FED每月數據')
  var rawData = transpose(macroQuarterlyData.getSheetValues(2, 1, span, 10))
  var fedJSON = {
    period: rawData[0].reverse(),
    personalConsumptionExpenditures: changeRate(rawData[1].reverse()),
    personalDisposableIncome: changeRate(rawData[2].reverse()),
    realRetailandFoodServicesSales: changeRate(rawData[3].reverse()),
    durableGoodsOrder: changeRate(rawData[4].reverse()),
    durableGoodsPersonal: changeRate(rawData[5].reverse()),
    totalBusinessInventories: changeRate(rawData[6].reverse()),
    unemployedLessThan5Weeks: rawData[7].reverse(),
    unemployed27WeeksOver: rawData[8].reverse(),
    coreCPI: changeRate(rawData[9].reverse()),
  }
  return fedJSON
}

function changeRate(lst=[1, 2, 3, 4, 5, 6]){
  let changeRateLst = [0]
  for(let i=1; i< lst.length; i++){
    changeRateLst.push(Math.round((lst[i] - lst[i-1])/lst[i] * 1000)/1000)
  }
  return changeRateLst
}
