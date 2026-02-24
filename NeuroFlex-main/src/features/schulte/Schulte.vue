<template>
  <div class="schulte-page">
    <header class="page-header">
      <button class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="page-title">舒尔特方格</h1>
      <button v-if="!isTraining" class="help-button" @click="showGuide = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="2" />
          <path d="M12 16v-4M12 8h.01" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>规则</span>
      </button>
      <div v-if="isTraining" class="timer">{{ formatTime(elapsedTime) }}</div>
    </header>

    <!-- 游戏说明弹窗 -->
    <GameGuide
      :visible="showGuide"
      title="舒尔特方格"
      :how-to-play="guideContent.howToPlay"
      :benefits="guideContent.benefits"
      :tips="guideContent.tips"
      @close="showGuide = false"
    />

    <!-- 配置界面 -->
    <div v-if="!isTraining && !showResult" class="config-screen">
      <div class="config-card">
        <h2>选择难度</h2>

        <div class="config-group">
          <label>方格尺寸</label>
          <div class="button-group">
            <button
              v-for="size in gridSizes"
              :key="size"
              :class="['size-button', { active: gridSize === size }]"
              @click="gridSize = size"
            >
              {{ size }}×{{ size }}
            </button>
          </div>
          <p class="config-hint">标准时间: {{ getTimeLimit(gridSize) }}秒</p>
        </div>

        <div class="config-group">
          <label>训练模式</label>
          <div class="mode-buttons">
            <button
              v-for="modeOption in modeOptions"
              :key="modeOption.value"
              :class="['mode-button', { active: mode === modeOption.value }]"
              @click="mode = modeOption.value"
            >
              {{ modeOption.label }}
            </button>
          </div>
        </div>

        <div class="settings-section">
          <h4 class="section-title">{{ settingsConfig.sections.assist.title }}</h4>

          <div class="switch-option">
            <span class="switch-label">{{ settingsConfig.options.highlightShown.label }}</span>
            <van-switch v-model="showFeedback" size="24px" @change="saveSettings" />
          </div>
        </div>

        <button class="start-button" @click="handleStartTraining">开始训练</button>
      </div>
    </div>

    <!-- 训练界面 -->
    <div v-if="isTraining" class="training-screen">
      <div
        class="grid-container"
        :class="{ disabled: isGameDisabled }"
        :style="{ '--grid-size': gridSize }"
      >
        <button
          v-for="(cell, index) in grid"
          :key="index"
          :class="[
            'grid-cell',
            {
              correct: clickedNumbers.includes(cell.value),
              error: lastClickWrong && index === lastClickIndex
            }
          ]"
          :style="cell.color ? { color: cell.color } : {}"
          @click="handleClick(cell.value, index)"
        >
          {{ cell.value }}
        </button>
      </div>

      <div class="progress-info">
        <p>
          当前目标: <strong>{{ game.currentTarget }}</strong>
        </p>
        <p>
          已完成: {{ showFeedback ? clickedNumbers.length : (mode === 'reverse' ? game.totalNumbers - game.currentTarget : game.currentTarget - 1) }} /
          {{ game.totalNumbers }}
        </p>
        <p>
          错误次数: <strong class="error-count">{{ game.errorCount }}</strong>
        </p>
      </div>
    </div>

    <!-- 结果弹窗 -->
    <GameResult
      :visible="showResult"
      :type="resultType"
      :title="resultTitle"
      :subtitle="resultSubtitle"
      :stats="resultStats"
      :show-retry="true"
      close-text="返回首页"
      @retry="handleRetry"
      @close="handleClose"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTrainingStore } from '@/stores/training'
import { useSchulteGame } from '@/shared/composables/useSchulteGame'
import { gridSizes, modeOptions, timeLimitMap, settingsConfig } from './config/schulte.js'
import GameGuide from '@/shared/components/GameGuide.vue'
import GameResult from '@/shared/components/GameResult.vue'
import { Switch as VanSwitch } from 'vant'
import 'vant/lib/switch/style'

const router = useRouter()
const trainingStore = useTrainingStore()

// ==================== 配置相关 ====================
const gridSize = ref(gridSizes[1]) // 默认 5×5
const mode = ref('number')
const showFeedback = ref(settingsConfig.options.highlightShown.default)

// 游戏说明
const showGuide = ref(false)
const guideContent = {
  howToPlay: `
    <p>按照<strong>从小到大</strong>的顺序依次点击方格中的数字。</p>
    <ul>
      <li>选择方格尺寸（3×3 到 9×9）</li>
      <li>选择训练模式（数字/多色/降序）</li>
      <li>尽快按顺序点击所有数字</li>
    </ul>
  `,
  benefits: `
    <p>舒尔特方格是一种经典的<strong>注意力训练</strong>工具，可以有效提升：</p>
    <ul>
      <li><strong>视觉搜索能力</strong> - 快速定位目标</li>
      <li><strong>注意力集中度</strong> - 保持专注不分心</li>
      <li><strong>反应速度</strong> - 提高大脑处理速度</li>
      <li><strong>眼脑协调</strong> - 增强视觉与认知配合</li>
    </ul>
  `,
  tips: `
    <p>训练技巧：</p>
    <ul>
      <li>保持<em>视线中心</em>不动，用余光扫描</li>
      <li>从简单难度开始，逐步提升</li>
      <li>每天训练10-15分钟效果最佳</li>
      <li>多色模式可增加挑战性</li>
    </ul>
  `
}

// 游戏逻辑 Hook
const game = useSchulteGame(gridSize, mode)

// 设置持久化
const STORAGE_KEY = settingsConfig.options.highlightShown.storageKey

function isLocalStorageAvailable() {
  try {
    const testKey = '__localStorage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    console.error('localStorage 不可用:', error)
    return false
  }
}

function loadSettings() {
  if (!isLocalStorageAvailable()) return
  
  try {
    const savedValue = localStorage.getItem(STORAGE_KEY)
    if (savedValue !== null) {
      showFeedback.value = JSON.parse(savedValue)
    }
  } catch (error) {
    console.error('加载设置失败:', error)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (removeError) {
      console.error('清除损坏数据失败:', removeError)
    }
  }
}

function saveSettings() {
  if (!isLocalStorageAvailable()) return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(showFeedback.value))
  } catch (error) {
    console.error('保存设置失败:', error)
  }
}

// ==================== UI 状态 ====================
const gameState = ref('idle') // 'idle' | 'countdown' | 'active' | 'completed'
const isTraining = ref(false)
const showResult = ref(false)
const grid = ref([])
const clickedNumbers = ref([]) // 用于视觉反馈
const lastClickWrong = ref(false)
const lastClickIndex = ref(-1)
const elapsedTime = ref(0)
const finalTime = ref(0)
const isSuccess = ref(false)

let timer = null

// ==================== 计算属性 ====================
const isGameDisabled = computed(() => false)

const resultType = computed(() => (isSuccess.value ? 'success' : 'timeout'))

const resultTitle = computed(() => (isSuccess.value ? '完成！' : '超时'))

const resultSubtitle = computed(() => {
  if (isSuccess.value) {
    return game.errorCount.value === 0 ? '完美表现！' : '继续努力！'
  }
  return '再试一次，你可以做得更好！'
})

const resultStats = computed(() => [
  {
    label: '用时',
    value: formatTime(finalTime.value),
    highlight: true
  },
  {
    label: '标准时间',
    value: `${getTimeLimit(gridSize.value)}秒`,
    highlight: false
  },
  {
    label: '平均反应',
    value: `${game.averageReactionTime.value}ms`,
    highlight: true
  },
  {
    label: '最快反应',
    value: `${game.fastestReaction.value}ms`,
    highlight: false
  },
  {
    label: '准确率',
    value: `${game.accuracy.value}%`,
    highlight: true
  },
  {
    label: '错误次数',
    value: `${game.errorCount.value}`,
    highlight: false
  }
])

// ==================== 工具函数 ====================
function getTimeLimit(size) {
  return timeLimitMap[size] || 30
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000)
  const milliseconds = Math.floor((ms % 1000) / 100)
  return `${seconds}.${milliseconds}s`
}

function getRandomColor() {
  const colors = [
    '#ff3366', '#00d4ff', '#00ff88', '#ffaa00',
    '#ff66cc', '#7b2cbf', '#00ffff', '#ffff00'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

function generateGrid() {
  // 根据模式生成数字序列
  let numbers
  if (mode.value === 'reverse') {
    numbers = Array.from({ length: game.totalNumbers.value }, (_, i) => game.totalNumbers.value - i)
  } else {
    numbers = Array.from({ length: game.totalNumbers.value }, (_, i) => i + 1)
  }
  
  // Fisher-Yates 洗牌
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
  }

  // 多色模式
  if (mode.value === 'color') {
    return numbers.map(num => ({ value: num, color: getRandomColor() }))
  }

  return numbers.map(num => ({ value: num, color: null }))
}

// ==================== 游戏流程 ====================
function handleStartTraining() {
  isTraining.value = true
  showResult.value = false
  grid.value = generateGrid()
  clickedNumbers.value = []
  lastClickWrong.value = false
  
  // 重置游戏逻辑
  game.resetGame()
  
  // 直接开始游戏
  startGame()
}

function startGame() {
  gameState.value = 'active'
  elapsedTime.value = 0
  
  // 启动游戏逻辑
  game.startGame()
  
  trainingStore.startTraining('schulte')

  // 开始计时 - 使用独立的开始时间
  const gameStartTime = Date.now()
  timer = setInterval(() => {
    elapsedTime.value = Date.now() - gameStartTime

    // 检查超时
    if (elapsedTime.value >= getTimeLimit(gridSize.value) * 1000) {
      endTraining(false)
    }
  }, 100)
}

function handleClick(num, index) {
  // 使用 Hook 处理点击逻辑
  const isCorrect = game.handleNumberClick(num)
  
  if (isCorrect) {
    // 正确点击的视觉反馈
    if (showFeedback.value) {
      clickedNumbers.value.push(num)
    }
    lastClickWrong.value = false

    // 检查是否完成
    if (game.isCompleted.value) {
      endTraining(true)
    }
  } else {
    // 错误点击的视觉反馈
    lastClickWrong.value = true
    lastClickIndex.value = index
    setTimeout(() => {
      lastClickWrong.value = false
    }, 400)
  }
}

function endTraining(success) {
  if (timer) {
    clearInterval(timer)
    timer = null
  }

  gameState.value = 'completed'
  isTraining.value = false
  showResult.value = true
  finalTime.value = game.totalTime.value || elapsedTime.value
  isSuccess.value = success

  trainingStore.endTraining()

  // 计算分数 - 主要基于准确率，速度作为加分项
  // 计算新的评分系统分数
  const score = calculateSchulteScore()

  // 发送得分给父窗口（index.html）
  if (window.opener) {
    window.opener.postMessage({
      type: 'gameScore',
      gameId: 'schulte',
      score: Math.round(score),
      details: {
        gridSize: gridSize.value,
        mode: mode.value,
        correctCount: game.correctCount.value,
        totalNumbers: game.totalNumbers.value,
        accuracy: game.accuracy.value,
        duration: finalTime.value
      }
    }, '*')
  }
}

function calculateSchulteScore() {
  // 检查必要的数据是否存在
  if (!game.accuracy || !game.timestamps) {
    console.warn('游戏数据不完整，使用默认分数')
    return 50 // 返回默认分数
  }

  // 准确率分数 (70%)
  const accuracyScore = game.accuracy.value || 0

  // 速度分数 (20%) - 基于研究数据的标准时间
  const gridSizeNum = gridSize.value
  let standardTime
  
  // 根据心理学研究数据设定标准时间
  if (gridSizeNum === 3) {
    standardTime = 5400 // 5.4秒
  } else if (gridSizeNum === 4) {
    standardTime = 9600 // 9.6秒
  } else if (gridSizeNum === 5) {
    standardTime = 20000 // 20秒 (基于研究数据)
  } else {
    standardTime = gridSizeNum * gridSizeNum * 800 // 其他尺寸的估算
  }
  
  const currentTime = finalTime.value || 0
  const speedRatio = currentTime > 0 ? standardTime / currentTime : 0
  const speedScore = Math.min(100, speedRatio * 100)

  // 稳定性分数 (10%) - 基于反应时间的一致性
  const intervals = game.intervals?.value || []
  let stabilityScore = 100
  
  if (intervals.length > 1) {
    const avgInterval = intervals.reduce((sum, time) => sum + time, 0) / intervals.length
    const variance = intervals.reduce((sum, time) => sum + Math.pow(time - avgInterval, 2), 0) / intervals.length
    stabilityScore = Math.max(0, 100 - (variance / 1000))
  }

  // 最终分数 (70% + 20% + 10%)
  const finalScore = accuracyScore * 0.7 + speedScore * 0.2 + stabilityScore * 0.1
  
  // 确保分数在合理范围内并四舍五入为整数
  return Math.round(Math.max(0, Math.min(100, finalScore)))
}

function resetTraining() {
  showResult.value = false
  isTraining.value = false
  gameState.value = 'idle'
  game.resetGame()
}

function handleRetry() {
  showResult.value = false
  resetTraining()
  handleStartTraining()
}

function handleClose() {
  showResult.value = false
  goBack()
}

function goBack() {
  window.close()
}

// ==================== 生命周期 ====================
onMounted(() => {
  loadSettings()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
  countdown.cleanup()
})
</script>

<style lang="scss" scoped>
.schulte-page {
  min-height: 100vh;
  background-image: linear-gradient(135deg, #4c1d95 0%, #622A88 30%, #B12F80 60%, #FF8459 80%, #F9F871 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: -20%;
    left: -20%;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background-color: #2e1065;
    filter: blur(120px);
    opacity: 0.8;
    animation: float 10s infinite ease-in-out;
    z-index: -1;
  }

  &::after {
    content: '';
    position: fixed;
    bottom: -20%;
    right: -20%;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background-color: #FF8459;
    filter: blur(100px);
    opacity: 0.6;
    animation: float 15s infinite ease-in-out reverse;
    z-index: -1;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, 20px); }
  }
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: env(safe-area-inset-top, 0px);
  left: 0;
  right: 0;
  z-index: 100;

  .back-button {
    @include button-reset;
    @include click-feedback;
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: white;
    @include flex-center;
    position: absolute;
    left: 24px;
    transition: all 0.3s;

    &:hover {
      background: white;
      color: #622A88;
      transform: scale(1.05);
    }
  }

  .page-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    text-align: center;
    color: white;
  }

  .help-button {
    @include button-reset;
    @include click-feedback;
    height: 40px;
    padding: 0 24px;
    border-radius: 9999px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: white;
    display: flex;
    align-items: center;
    gap: 4px;
    position: absolute;
    right: 24px;
    transition: all 0.3s;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      background: white;
      color: #622A88;
      border-color: white;
      transform: scale(1.05);
    }

    svg {
      flex-shrink: 0;
    }

    span {
      white-space: nowrap;
    }
  }

  .timer {
    font-size: 24px;
    font-weight: 700;
    color: white;
    min-width: 80px;
    text-align: right;
    position: absolute;
    right: 24px;
  }
}

.config-screen,
.result-screen {
  flex: 1;
  @include flex-center;
  padding: calc(16px + 60px) 24px 16px;
  overflow-y: auto;
  @include custom-scrollbar;
}

.config-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 32px;
  max-width: 600px;
  width: 100%;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.1);

  @include mobile {
    padding: 24px;
    max-width: 90vw;
    margin: 0 auto;
  }

  h2 {
    text-align: center;
    margin-bottom: 32px;
    font-size: 32px;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

    @include mobile {
      font-size: 24px;
      margin-bottom: 24px;
    }
  }
}

.config-group {
  margin-bottom: 32px;

  label {
    display: block;
    font-weight: 500;
    margin-bottom: 16px;
    color: white;
  }

  .config-hint {
    margin-top: 8px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
  }
}

.button-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @include mobile {
    gap: 8px;
  }

  .size-button {
    @include button-reset;
    @include click-feedback;
    padding: 16px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    color: white;
    font-weight: 600;
    font-size: 18px;
    transition: all 0.3s;
    position: relative;

    @include mobile {
      padding: 12px;
      font-size: 14px;
    }

    &.active {
      background: white;
      border-color: white;
      color: #622A88;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
      transform: scale(1.05);
    }

    &:hover:not(.active) {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }
}

.mode-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .mode-button {
    @include button-reset;
    @include click-feedback;
    padding: 16px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    color: white;
    font-weight: 500;
    text-align: left;
    transition: all 0.3s;

    &.active {
      background: white;
      border-color: white;
      color: #622A88;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
    }

    &:hover:not(.active) {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
}

.settings-section {
  margin-bottom: 32px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: white;
  }
}

.switch-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  .switch-label {
    font-size: 14px;
    color: white;
  }
}

.start-button {
  @include button-reset;
  width: 100%;
  padding: 16px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.9);
  color: #622A88;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.9);

  @include mobile {
    padding: 12px;
    font-size: 16px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: none;
  }
}

.training-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  // 精确计算：100vh - 标题栏60px
  height: calc(100vh - 60px);
  padding: $spacing-lg;
  overflow: hidden;
  position: relative;

  @include mobile {
    padding: $spacing-md;
  }
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(var(--grid-size), 1fr);
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &.disabled {
    opacity: 0.3;
    pointer-events: none;
    filter: blur(12px);
  }

  gap: calc(36px - var(--grid-size) * 2px);
  padding: calc(44px - var(--grid-size) * 2.5px);

  width: min(
    calc(140px * var(--grid-size) - var(--grid-size) * 12px),
    90vw,
    calc(100vh - 60px - 48px - 120px)
  );
  max-height: calc(100vh - 60px - 48px - 120px);

  @include mobile {
    gap: calc(24px - var(--grid-size) * 2px);
    padding: calc(24px - var(--grid-size) * 1.5px);

    width: min(85vw, calc(100vh - 60px - 32px - 120px));
    max-height: calc(100vh - 60px - 32px - 120px);
  }

  .grid-cell {
    @include button-reset;
    @include flex-center;
    font-weight: 800;
    color: white;
    transition: none !important;
    transform: none !important;
    cursor: pointer;
    aspect-ratio: 1;
    border-radius: 9999px;
    position: relative;
    overflow: hidden;

    font-size: calc(4rem - var(--grid-size) * 0.3rem);

    @include mobile {
      font-size: calc(2.9rem - var(--grid-size) * 0.2rem);
      border-radius: 9999px;
    }

    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    border: 2px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);

    @include mobile {
      border-width: 1px;
      box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    // 光泽效果
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
      opacity: 0;
      transition: opacity $transition-base;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        transform: none !important;
        box-shadow: none !important;
      }
    }

    &:active {
      transform: none !important;
      box-shadow: none !important;
    }

    &.correct {
      background: linear-gradient(135deg, rgba(0, 255, 136, 0.25) 0%, rgba(0, 255, 136, 0.12) 100%);
      border-color: rgba(0, 255, 136, 0.6);
      box-shadow:
        0 4px 20px rgba(0, 255, 136, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      pointer-events: none;

      // 在高亮模式下，覆盖颜色为绿色
      color: $accent-success !important;
    }

    &.error {
      background: linear-gradient(135deg, rgba(255, 51, 102, 0.2) 0%, rgba(255, 51, 102, 0.1) 100%);
      border-color: rgba(255, 51, 102, 0.6);
      box-shadow:
        0 4px 16px rgba(255, 51, 102, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
  }
}

.progress-info {
  position: fixed;
  bottom: 24px;
  right: 24px;
  text-align: center;
  font-size: 18px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 200px;
  z-index: 50;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.1);

  @include mobile {
    min-width: auto;
    padding: 16px;
    bottom: 16px;
    right: 16px;
    font-size: 14px;
  }

  p {
    margin-bottom: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;

    @include mobile {
      margin-bottom: 8px;
      font-size: 12px;
    }

    &:last-child {
      margin-bottom: 0;
    }

    strong {
      color: white;
      font-size: 32px;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
      display: inline-block;
      margin: 0 4px;

      @include mobile {
        font-size: 24px;
        margin: 0 4px;
      }
    }

    .error-count {
      color: #FF3366;
      font-size: 24px;
      text-shadow: 0 0 20px rgba(255, 51, 102, 0.5);

      @include mobile {
        font-size: 18px;
      }
    }
  }
}

.switch-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md $spacing-lg;
  border-radius: $radius-md;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all $transition-base;
  margin-bottom: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(0, 212, 255, 0.3);
  }

  .switch-label {
    font-size: $font-base;
    font-weight: $font-medium;
    color: $text-primary;
  }

  // 自定义Vant Switch样式
  :deep(.van-switch) {
    --van-switch-on-background: linear-gradient(135deg, #00d4ff, #7b2cbf);
    --van-switch-background: rgba(255, 255, 255, 0.15);
    --van-switch-node-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

.settings-section {
  margin-bottom: $spacing-xl;

  .section-title {
    font-size: $font-base;
    font-weight: $font-medium;
    color: $text-primary;
    margin-bottom: 12px;
    margin-top: 0;
  }
}
</style>
