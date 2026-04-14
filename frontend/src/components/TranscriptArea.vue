<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  finalTranscript: string
  interimTranscript: string
  isListening: boolean
}>()

const areaRef = ref<HTMLElement | null>(null)

watch(
  () => [props.finalTranscript, props.interimTranscript],
  () => {
    nextTick(() => {
      if (areaRef.value) {
        areaRef.value.scrollTop = areaRef.value.scrollHeight
      }
    })
  },
)
</script>

<template>
  <div ref="areaRef" class="transcript-area">
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
</template>

<style scoped>
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
</style>
