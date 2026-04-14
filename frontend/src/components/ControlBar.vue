<script setup lang="ts">
import { ref, watch } from 'vue'
import { LANGUAGES, LANGUAGE_GROUPS } from '../composables/languages'

const props = defineProps<{
  isListening: boolean
  hasText: boolean
  currentLang: string
}>()

const emit = defineEmits<{
  toggle: []
  clear: []
  copy: []
  'update:currentLang': [lang: string]
}>()

const copied = ref(false)

function handleCopy() {
  emit('copy')
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}

const showLangMenu = ref(false)

function selectLang(code: string) {
  emit('update:currentLang', code)
  showLangMenu.value = false
}

function toggleLangMenu() {
  showLangMenu.value = !showLangMenu.value
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.lang-selector')) {
    showLangMenu.value = false
  }
}

watch(showLangMenu, (val) => {
  if (val) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <div class="controls">
    <button class="btn-toggle" :class="{ active: isListening }" @click="emit('toggle')">
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

    <button class="btn-secondary" @click="handleCopy" :disabled="!hasText">
      <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>{{ copied ? '已複製' : '複製' }}</span>
    </button>

    <button class="btn-secondary" @click="emit('clear')" :disabled="!hasText">
      清除文字
    </button>

    <div class="lang-selector">
      <button class="btn-lang" @click.stop="toggleLangMenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" x2="22" y1="12" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        {{ LANGUAGES.find(l => l.code === currentLang)?.label ?? '語言' }}
      </button>
      <div v-if="showLangMenu" class="lang-menu">
        <template v-for="group in LANGUAGE_GROUPS" :key="group">
          <div class="lang-group-label">{{ group }}</div>
          <button
            v-for="lang in LANGUAGES.filter(l => l.group === group)"
            :key="lang.code"
            class="lang-option"
            :class="{ active: lang.code === currentLang }"
            @click.stop="selectLang(lang.code)"
          >
            {{ lang.label }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
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

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  background: white;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover:not(:disabled) {
  border-color: #bbb;
  color: #333;
}

.btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.lang-selector {
  position: relative;
}

.btn-lang {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  background: white;
  color: #444;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-lang:hover {
  border-color: #16213e;
  color: #16213e;
}

.lang-menu {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 8px 0;
  min-width: 180px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 100;
}

.lang-group-label {
  padding: 8px 16px 4px;
  font-size: 11px;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lang-group-label:not(:first-child) {
  border-top: 1px solid #f0f0f0;
  margin-top: 4px;
  padding-top: 12px;
}

.lang-option {
  display: block;
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.15s;
}

.lang-option:hover {
  background: #f5f5f5;
}

.lang-option.active {
  color: #16213e;
  font-weight: 600;
  background: #e8eaf6;
}
</style>
