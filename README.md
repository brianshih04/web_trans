# Web Trans - 即時語音轉文字桌面應用

基於 Python + Vue 3 + pywebview 架構的即時語音辨識桌面應用，使用瀏覽器原生 Web Speech API 實現 STT（Speech-to-Text）。

## 功能特色

- 即時語音辨識（繁體中文）
- 靜音自動重連，持續收音不中斷
- 即時草稿字（interim）與最終確認字（final）雙層顯示
- 麥克風狀態指示燈（呼吸燈動畫）
- 錯誤提示（權限拒絕、網路斷線等）
- 開始 / 停止 / 清除 控制按鈕
- 辨識結果自動儲存至本機 `output/` 目錄（按日期分檔）
- 支援 PyInstaller 打包為獨立執行檔

## 技術架構

```
web_trans/
├── main.py                              # Python 後端 (pywebview + API 橋接)
├── frontend/
│   ├── src/
│   │   ├── composables/
│   │   │   └── useSpeechRecognition.ts  # STT 核心 Composable
│   │   ├── App.vue                      # 主畫面 UI
│   │   ├── main.ts                      # Vue 進入點
│   │   └── style.css                    # 全域樣式
│   ├── dist/                            # 編譯產出 (npm run build)
│   └── vite.config.ts
├── venv/                                # Python 虛擬環境
└── output/                              # 辨識文字存放目錄 (自動建立)
```

## 環境需求

- Python 3.10+
- Node.js 18+
- Windows 作業系統

## 安裝

```bash
# Clone 專案
git clone https://github.com/brianshih04/web_trans.git
cd web_trans

# 前端依賴安裝
cd frontend
npm install
cd ..

# Python 虛擬環境與依賴
python -m venv venv
venv\Scripts\pip.exe install pywebview
```

## 啟動

### 開發模式

需要兩個終端機：

```bash
# 終端機 1：啟動 Vue 開發伺服器
cd frontend
npm run dev

# 終端機 2：啟動 pywebview 桌面視窗
venv\Scripts\python.exe main.py --debug
```

### 生產模式

```bash
# 先編譯前端
cd frontend
npm run build
cd ..

# 啟動（自動載入 dist/ 靜態檔案）
venv\Scripts\python.exe main.py
```

## 打包為獨立執行檔

```bash
# 1. 編譯前端
cd frontend && npm run build && cd ..

# 2. PyInstaller 打包
venv\Scripts\pip.exe install pyinstaller
venv\Scripts\pyinstaller.exe --onefile --windowed --add-data "frontend\dist;frontend\dist" main.py
```

## 授權

MIT License
