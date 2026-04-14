# Changelog

所有重要變更都會記錄在此檔案中。

格式基於 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)。

## [0.1.0] - 2026-04-14

### Added

- Phase 1：基礎環境搭建 — Vue 3 + TypeScript + Vite 前端專案、Python venv + pywebview 後端
- Phase 2：STT 核心實作 — Web Speech API (`webkitSpeechRecognition`) 整合、靜音自動重連機制、interim/final 雙層文字顯示
- Phase 3：前後端通訊橋接 — pywebview `js_api` 注入 `Api` 類別、前端 `isFinal` 文字即時傳至 Python 後端、後端 `print()` 輸出 + 檔案儲存
- Phase 4：UI/UX 優化 — 麥克風收音狀態指示燈（呼吸燈動畫）、錯誤訊息提示橫幅（權限拒絕、網路斷線等）、開始/停止/清除控制按鈕
- Phase 5：打包配置 — `main.py` 自動偵測 `dist/` 切換 dev server 與本地靜態檔案、支援 PyInstaller `sys._MEIPASS` 路徑
