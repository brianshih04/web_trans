import { ref, onUnmounted } from 'vue'

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent {
  error: string
  message?: string
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  abort(): void
  onstart: (() => void) | null
  onend: (() => void) | null
  onresult: ((ev: SpeechRecognitionEvent) => void) | null
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance
    webkitSpeechRecognition: new () => SpeechRecognitionInstance
    pywebview: {
      api: {
        receive_text(text: string): Promise<void>
      }
    }
  }
}

export type MicStatus = 'idle' | 'listening' | 'error'

export function useSpeechRecognition() {
  const isListening = ref(false)
  const micStatus = ref<MicStatus>('idle')
  const interimTranscript = ref('')
  const finalTranscript = ref('')
  const errorMessage = ref('')

  const allFinalTexts: string[] = []
  let recognition: SpeechRecognitionInstance | null = null
  let shouldRestart = false

  function createRecognition(): SpeechRecognitionInstance | null {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      errorMessage.value = '此瀏覽器不支援 Web Speech API'
      micStatus.value = 'error'
      return null
    }

    const instance = new SpeechRecognition()
    instance.lang = 'zh-TW'
    instance.continuous = true
    instance.interimResults = true
    return instance
  }

  function sendToBackend(text: string) {
    if (window.pywebview?.api?.receive_text) {
      window.pywebview.api.receive_text(text)
    }
  }

  function start() {
    if (isListening.value) return

    recognition = createRecognition()
    if (!recognition) return

    shouldRestart = true

    recognition.onstart = () => {
      isListening.value = true
      micStatus.value = 'listening'
      errorMessage.value = ''
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          const text = result[0].transcript
          allFinalTexts.push(text)
          finalTranscript.value = allFinalTexts.join('')
          interimTranscript.value = ''
          sendToBackend(text)
        } else {
          interim += result[0].transcript
        }
      }
      if (interim) {
        interimTranscript.value = interim
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('STT Error:', event.error, event.message)
      if (event.error === 'not-allowed') {
        errorMessage.value = '麥克風權限被拒絕，請允許麥克風存取'
        micStatus.value = 'error'
        shouldRestart = false
        isListening.value = false
      } else if (event.error === 'no-speech') {
        // 靜音，讓 onend 處理重連
      } else if (event.error === 'network') {
        errorMessage.value = '網路連線錯誤，請檢查網路狀態'
        micStatus.value = 'error'
      } else {
        errorMessage.value = `語音辨識錯誤：${event.error}`
      }
    }

    recognition.onend = () => {
      if (shouldRestart) {
        try {
          recognition?.start()
        } catch {
          isListening.value = false
          micStatus.value = 'idle'
        }
      } else {
        isListening.value = false
        micStatus.value = 'idle'
      }
    }

    try {
      recognition.start()
    } catch (e) {
      errorMessage.value = '無法啟動語音辨識'
      micStatus.value = 'error'
      isListening.value = false
    }
  }

  function stop() {
    shouldRestart = false
    if (recognition) {
      recognition.stop()
      recognition = null
    }
    isListening.value = false
    micStatus.value = 'idle'
    interimTranscript.value = ''
  }

  function toggle() {
    if (isListening.value) {
      stop()
    } else {
      start()
    }
  }

  function clearText() {
    allFinalTexts.length = 0
    finalTranscript.value = ''
    interimTranscript.value = ''
  }

  onUnmounted(() => {
    stop()
  })

  return {
    isListening,
    micStatus,
    interimTranscript,
    finalTranscript,
    errorMessage,
    start,
    stop,
    toggle,
    clearText,
  }
}
