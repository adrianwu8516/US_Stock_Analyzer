# US Stock Analyzer

透過 Google Apps Script，每天從各大網站上面擷取美國股市資料，並且整理過後，於早晨推送美股分析日報的一個開源服務。

待處理的工作事項：
1. Recoder 獨立於 CSB 處理流程之外，這樣可以另外開一個 Trigger 獨立處理，加快效率（2hr）
2. CBS 數據爬蟲的分散式架構，支援可憐的免費 GAS Server（5hr，研究加實作）
3. CBS 爬資料失敗後的重試一次機制
4. 資安升級，用戶資料編碼（3hr）
5. 用戶可自訂義股票觀察清單（含選擇界面等等，Mailer Function 的升級版本）(10hr)
6. 用戶行為追蹤 Log（3hr）
7. 開信 Pixel （3hr，研究加實作）
8. 跨語系支援（英語，日語）
