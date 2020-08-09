function macroData(span){
  var macroDoc = SpreadsheetApp.openById(MACROSHEET_ID).getSheetByName('每日數據')
  var macroMonthlyDoc = SpreadsheetApp.openById(MACROSHEET_ID).getSheetByName('每月數據')
  //  var macroData = macroDoc.getRange("A2:H2").getValues()[0]
  var macroDataJSON = {
    date: macroDoc.getSheetValues(2, 1, span, 1).map(item => item[0].replace(/年|月/g, '-').replace(/日/g, '')).reverse(),
    fearGreed:  macroDoc.getSheetValues(2, 2, span, 1).map(item => parseFloat(item[0])).reverse(),
    fearGreedNote:  macroDoc.getSheetValues(2, 3, span, 1).map(item => item[0]).reverse(),
    fearGreedRatio:  macroDoc.getSheetValues(2, 4, span, 1).map(item => parseFloat(item[0])).reverse(),
    globalRecession:  macroDoc.getSheetValues(2, 5, span, 1).map(item => parseFloat(item[0])).reverse(),
    mmCovid19:  macroDoc.getSheetValues(2, 6, span, 1).map(item => parseFloat(item[0])).reverse(),
    mmBuffettIndex:  macroDoc.getSheetValues(2, 7, span, 1).map(item => parseFloat(item[0])).reverse(),
    sInvestorBear:  macroDoc.getSheetValues(2, 8, span, 1).map(item => parseFloat(item[0])).reverse(),
    sInvestorNeutral:  macroDoc.getSheetValues(2, 9, span, 1).map(item => parseFloat(item[0])).reverse(),
    sInvestorBull:   macroDoc.getSheetValues(2, 10, span, 1).map(item => parseFloat(item[0])).reverse(),
    gapYield10to2:   macroDoc.getSheetValues(2, 11, span, 1).map(item => parseFloat(item[0])).reverse(),
    snp500Index:   macroDoc.getSheetValues(2, 12, span, 1).map(item => parseFloat(item[0])).reverse(),
    vix:   macroDoc.getSheetValues(2, 13, span, 1).map(item => parseFloat(item[0])/100).reverse(),
    requiredMarketReturn:   macroDoc.getSheetValues(2, 14, span, 1).map(item => parseFloat(item[0])*100).reverse(),
    week:         macroMonthlyDoc.getSheetValues(2, 1, span, 1).map(item => item[0].replace(/年|月/g, '-').replace(/日/g, '')).reverse(),
    mmShillerPE:  macroMonthlyDoc.getSheetValues(2, 2, span, 1).map(item => parseFloat(item[0])).reverse(),
    usRecession:  macroMonthlyDoc.getSheetValues(2, 3, span, 1).map(item => parseFloat(item[0])/100).reverse(),
  }
  Logger.log(macroDataJSON)
  return macroDataJSON
}

function macroFEDQuarterlyData(span){
  var macroQuarterlyData = SpreadsheetApp.openById(MACROSHEET_ID).getSheetByName('FED每季數據')
  var rawData = transpose(macroQuarterlyData.getSheetValues(2, 1, span, 43))
  var fedJSON = {
    period: rawData[0].reverse(),
    nominalGDP: rawData[1].reverse(),
    realGDP: rawData[2].reverse(),
    realExports: rawData[3].reverse(),
    realImports: rawData[4].reverse(),
    netExports: rawData[5].reverse(),
    privateDomesticInvestment: rawData[6].reverse(),
    privateResidentialFixedInvestment: rawData[7].reverse(),
    privateNonresidentialFixedInvestment: rawData[8].reverse(),
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
