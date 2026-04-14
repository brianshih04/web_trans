<script setup lang="ts">
import { useSpeechRecognition } from './composables/useSpeechRecognition'

const {
  isListening,
  micStatus,
  interimTranscript,
  finalTranscript,
  errorMessage,
  toggle,
  clearText,
} = useSpeechRecognition()
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>即時語音轉文字</h1>
      <p class="subtitle">Web Speech API + pywebview</p>
    </header>

    <div class="status-bar">
      <span class="mic-indicator" :class="micStatus">
        <span class="dot"></span>
        <span class="label">{{ micStatus === 'listening' ? '收音中' : micStatus === 'error' ? '錯誤' : '待機' }}</span>
      </span>
    </div>

    <div v-if="errorMessage" class="error-banner">
      {{ errorMessage }}
    </div>

    <div class="transcript-area">
      <div class="transcript-content">
        <p class="final-text">{{ finalTranscript }}</p>
        <p class="interim-text">{{ interimTranscript }}</p>
        <p v-if="!finalTranscript && !interimTranscript && !isListening" class="placeholder">
          按下下方按鈕開始語音辨識...
        </p>
        <p v-if="!finalTranscript && !interimTranscript && isListening" class="placeholder">
          開始說話吧...
        </p>
      </div>
    </div>

    <div class="controls">
      <button class="btn-toggle" :class="{ active: isListening }" @click="toggle">
        <svg v-if="!isListening" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" x2="12" y1="19" y2="22"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"/>
        </svg>
        <span>{{ isListening ? '停止' : '開始' }}</span>
      </button>

      <button class="btn-clear" @click="clearText" :disabled="!finalTranscript">
        清除文字
      </button>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 32px;
  box-sizing: border-box;
  font-family: 'Microsoft JhengHei', 'PingFang TC', system-ui, sans-serif;
  color: #1a1a2e;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px;
  color: #16213e;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #888;
}

.status-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.mic-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 20px;
  background: #f0f0f0;
  font-size: 14px;
  font-weight: 500;
}

.mic-indicator .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #aaa;
}

.mic-indicator.listening {
  background: #e8f5e9;
  color: #2e7d32;
}

.mic-indicator.listening .dot {
  background: #4caf50;
  animation: pulse 1.5s ease-in-out infinite;
}

.mic-indicator.error {
  background: #fce4ec;
  color: #c62828;
}

.mic-indicator.error .dot {
  background: #e53935;
}

.mic-indicator.idle {
  background: #f0f0f0;
  color: #888;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

.error-banner {
  background: #fff3e0;
  border: 1px solid #ffcc02;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 16px;
  color: #e65100;
  font-size: 14px;
  text-align: center;
}

.transcript-area {
  flex: 1;
  min-height: 200px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  overflow-y: auto;
}

.transcript-content {
  font-size: 18px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
}

.final-text {
  margin: 0;
  color: #1a1a2e;
}

.interim-text {
  margin: 0;
  color: #90a4ae;
  font-style: italic;
}

.placeholder {
  margin: 0;
  color: #bdbdbd;
  text-align: center;
  padding-top: 60px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  border: none;
  border-radius: 25px;
  background: #16213e;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-toggle:hover {
  background: #1a237e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 33, 62, 0.3);
}

.btn-toggle.active {
  background: #c62828;
}

.btn-toggle.active:hover {
  background: #b71c1c;
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.3);
}

.btn-clear {
  padding: 12px 24px;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  background: white;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-clear:hover:not(:disabled) {
  border-color: #bbb;
  color: #333;
}

.btn-clear:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
