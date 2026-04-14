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

const MAX_NETWORK_RETRIES = 5
const NETWORK_RETRY_BASE_MS = 2000

export function useSpeechRecognition(lang: string = 'zh-TW') {
  const isListening = ref(false)
  const micStatus = ref<MicStatus>('idle')
  const interimTranscript = ref('')
  const finalTranscript = ref('')
  const errorMessage = ref('')
  const backendConnected = ref(true)

  const allFinalTexts: string[] = []
  let recognition: SpeechRecognitionInstance | null = null
  let shouldRestart = false
  let networkRetryCount = 0

  function createRecognition(): SpeechRecognitionInstance | null {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      errorMessage.value = '此瀏覽器不支援 Web Speech API'
      micStatus.value = 'error'
      return null
    }

    const instance = new SpeechRecognition()
    instance.lang = lang
    instance.continuous = true
    instance.interimResults = true
    return instance
  }

  function sendToBackend(text: string) {
    if (window.pywebview?.api?.receive_text) {
      window.pywebview.api.receive_text(text).catch(() => {
        backendConnected.value = false
        console.error('Failed to send text to backend')
      })
    } else {
      backendConnected.value = false
    }
  }

  function start() {
    if (isListening.value) return

    recognition = createRecognition()
    if (!recognition) return

    shouldRestart = true
    networkRetryCount = 0

    recognition.onstart = () => {
      isListening.value = true
      micStatus.value = 'listening'
      errorMessage.value = ''
      networkRetryCount = 0
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
        networkRetryCount++
        if (networkRetryCount > MAX_NETWORK_RETRIES) {
          errorMessage.value = '網路連線持續中斷，已停止重試'
          micStatus.value = 'error'
          shouldRestart = false
        } else {
          errorMessage.value = `網路連線錯誤，正在重試 (${networkRetryCount}/${MAX_NETWORK_RETRIES})...`
          micStatus.value = 'listening'
        }
      } else {
        errorMessage.value = `語音辨識錯誤：${event.error}`
      }
    }

    recognition.onend = () => {
      if (shouldRestart) {
        const delay = networkRetryCount > 0
          ? Math.min(NETWORK_RETRY_BASE_MS * Math.pow(2, networkRetryCount - 1), 30000)
          : 0
        setTimeout(() => {
          try {
            recognition?.start()
          } catch {
            recognition = createRecognition()
            try {
              recognition?.start()
            } catch {
              isListening.value = false
              micStatus.value = 'idle'
            }
          }
        }, delay)
      } else {
        isListening.value = false
        micStatus.value = 'idle'
      }
    }

    try {
      recognition.start()
    } catch {
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
    backendConnected,
    start,
    stop,
    toggle,
    clearText,
  }
}
