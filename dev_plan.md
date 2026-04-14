這是一份專為 Python + Vue + pywebview 架構設計的即時 STT WebApp 開發計畫。採用敏捷開發的概念，我們將專案拆解為五個明確的階段，讓您可以快速看到成果並逐步優化。



Phase 1: 基礎環境與骨架搭建

目標： 建立前後端分離的開發環境，並確認兩邊能成功「合體」顯示在桌面視窗中。



步驟 1 (前端)： 使用 Vite 建立一個乾淨的 Vue 3 專案 (npm create vite@latest)，並啟動本地開發伺服器 (通常是 http://localhost:5173)。



步驟 2 (後端)： 建立 Python 虛擬環境，安裝 pywebview。撰寫一支簡短的 main.py，啟動視窗並將 URL 指向 Vue 的開發伺服器。



檢核點： 執行 Python 腳本後，能跳出一個獨立視窗，裡面成功渲染出 Vue 的預設畫面。



Phase 2: 前端 STT 核心實作 (Web Speech API)

目標： 讓網頁具備「聽寫」能力，並將結果呈現在畫面上。



步驟 1 (語音引擎)： 在 Vue 建立一個專門處理 STT 的組件或 Composable 函數。初始化 webkitSpeechRecognition 物件。



步驟 2 (狀態綁定)： 設定變數來儲存「即時草稿字 (Interim)」與「最終確認字 (Final)」，並綁定到 UI 上顯示。



步驟 3 (生命週期管理)： 實作 onstart, onresult, onerror 等事件處理。



步驟 4 (靜音重連機制)： 這是最關鍵的一步。在 onend 事件中加入邏輯，判斷如果是系統因為靜音而自動切斷，必須自動呼叫 .start() 重新監聽。



檢核點： 對著電腦講話，畫面上能即時打出字幕，且暫停說話 15 秒後再講，系統依然能繼續辨識。



Phase 3: 前後端通訊橋接

目標： 將前端辨識出的文字，安全地傳遞回 Python 進行後續處理。



步驟 1 (後端 API 暴露)： 在 Python 中定義一個類別 (例如 Api)，裡面寫一個 receive\_text(text) 方法。在建立 pywebview 視窗時，將這個 Api 物件傳入 js\_api 參數。



步驟 2 (前端呼叫)： 在 Vue 的 onresult 判斷出 isFinal == true 時，呼叫 window.pywebview.api.receive\_text(finalTranscript)。



步驟 3 (後端處理)： Python 收到文字後，先簡單用 print() 印出，或寫入一個 .txt 檔案做測試。



檢核點： 在視窗中講完一句話，Python 的終端機 (Terminal) 能同步印出該句話。



Phase 4: UI/UX 優化與例外處理

目標： 讓應用程式看起來專業、穩定，具備良好的使用者體驗。



步驟 1 (視覺回饋)： 實作麥克風狀態指示燈（例如收音時顯示呼吸燈或波浪動畫），讓使用者明確知道系統正在聽。



步驟 2 (錯誤處理)： 攔截 onerror 的各種狀態（例如網路斷線、找不到麥克風），並在 UI 上給予友善的提示。



步驟 3 (控制開關)： 增加「開始 / 暫停」按鈕，讓使用者能手動控制麥克風的收音狀態。



Phase 5: 獨立打包編譯

目標： 將開發環境轉換為可以獨立交付的桌面應用程式。



步驟 1 (前端編譯)： 執行 npm run build，將 Vue 專案打包成靜態的 HTML/JS/CSS 檔案夾 (通常叫 dist)。



步驟 2 (後端修改)： 修改 main.py，將 pywebview 的 URL 從 localhost 改為指向編譯好的本地 dist/index.html 路徑。



步驟 3 (最終打包)： 使用 PyInstaller 將 Python 腳本與前端的 dist 資料夾打包成單一的獨立執行檔。

