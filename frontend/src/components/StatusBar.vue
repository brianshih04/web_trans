<script setup lang="ts">
import type { MicStatus } from '../composables/useSpeechRecognition'

defineProps<{
  micStatus: MicStatus
  backendConnected: boolean
}>()

const statusLabel: Record<MicStatus, string> = {
  listening: '收音中',
  error: '錯誤',
  idle: '待機',
}
</script>

<template>
  <div class="status-bar">
    <span class="mic-indicator" :class="micStatus">
      <span class="dot"></span>
      <span class="label">{{ statusLabel[micStatus] }}</span>
    </span>
    <span v-if="!backendConnected" class="backend-warning">後端未連線</span>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
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

.backend-warning {
  font-size: 12px;
  color: #e65100;
  background: #fff3e0;
  padding: 4px 10px;
  border-radius: 12px;
}
</style>
