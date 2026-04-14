<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSpeechRecognition } from './composables/useSpeechRecognition'
import { DEFAULT_LANG } from './composables/languages'
import StatusBar from './components/StatusBar.vue'
import TranscriptArea from './components/TranscriptArea.vue'
import ControlBar from './components/ControlBar.vue'

const currentLang = ref(DEFAULT_LANG)

let speech = createSpeech(currentLang.value)

function createSpeech(lang: string) {
  return useSpeechRecognition(lang)
}

watch(currentLang, (newLang) => {
  if (speech.isListening.value) {
    speech.stop()
  }
  speech = createSpeech(newLang)
})

function handleCopy() {
  const text = speech.finalTranscript.value
  if (text) {
    navigator.clipboard.writeText(text).catch(() => {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    })
  }
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>即時語音轉文字</h1>
      <p class="subtitle">Web Speech API + pywebview</p>
    </header>

    <StatusBar
      :mic-status="speech.micStatus.value"
      :backend-connected="speech.backendConnected.value"
    />

    <div v-if="speech.errorMessage.value" class="error-banner">
      {{ speech.errorMessage.value }}
    </div>

    <TranscriptArea
      :final-transcript="speech.finalTranscript.value"
      :interim-transcript="speech.interimTranscript.value"
      :is-listening="speech.isListening.value"
    />

    <ControlBar
      :is-listening="speech.isListening.value"
      :has-text="!!speech.finalTranscript.value"
      :current-lang="currentLang"
      @toggle="speech.toggle()"
      @clear="speech.clearText()"
      @copy="handleCopy()"
      @update:current-lang="currentLang = $event"
    />
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
</style>
