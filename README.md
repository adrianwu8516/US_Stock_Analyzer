# US Stock Analyzer

### Project Introduction
透過 Google Apps Script (GAS)，每天從各大網站上面擷取美國股市資料，並且整理過後，於早晨推送美股分析日報的一個開源服務。並且藉由 GAS 的 HtmlService 結合 Google Site 達成輕鬆股票網站架設。

網站服務請見此（[點我！](https://sites.google.com/view/us-stock-today/home)）

### Project Structure
![Structure Concept](https://github.com/kkmanwilliam/US_Stock_Analyzer/blob/master/StructureMap/US%20Stock%20Analysis-Project%20Structure.png)

### Pending tickets：
* Parse EPS and EPS Estimation data and build related model
* Add more information into HisChart, like volumn, CBS signal, and make it more stylish
* Add a rendering function to make the site work smoother
* Seperate Email view with Website view
* Multi stock comparison
* 用戶可自訂義股票觀察清單（含選擇界面等等，Mailer Function 的升級版本）(10hr)
* 用戶行為追蹤 Log（3hr）<br>
  https://www.labnol.org/code/19543-analytics-with-google-script
* 開信 Pixel （3hr，研究加實作）
* 跨語系支援（英語，日語）
* 其他的爬蟲加速研究與實作
* Better front end view with Vue.js


### Done tickets 
* ~~CBS 爬資料失敗後的重試一次機制~~
* ~~Recoder 獨立於 CSB 處理流程之外，這樣可以另外開一個 Trigger 獨立處理，加快效率（2hr）~~
* ~~資安升級，用戶資料編碼（3hr）~~
* ~~Use Cache to speedup data accessing~~
* ~~CBS 數據爬蟲的分散式架構，支援可憐的免費 GAS Server（5hr，研究加實作）~~
* ~~Cache refresh in the morning with the mailer~~
* ~~Index Page and better view with Google Site~~
* ~~Better front end view with bootstrap~~
* ~~Asynchronous page loading~~
* ~~Fixing trigger cannot run with the right variable issue~~
