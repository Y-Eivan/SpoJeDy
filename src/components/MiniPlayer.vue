<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 z-30">
    <div class="max-w-7xl mx-auto flex items-center gap-4">
      <div class="w-14 h-14 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0">
        <img v-if="song.cover" :src="song.cover" :alt="song.title" class="w-full h-full object-cover" />
      </div>

      <div class="min-w-0 flex-1 sm:flex-none sm:w-56">
        <p class="text-sm font-semibold truncate">{{ song.title }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ song.artist }}</p>
      </div>

      <div class="flex-1 flex items-center justify-center gap-4">
        <button @click="$emit('prev')" class="p-2 hover:text-brand transition" aria-label="Previous">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        <button
          @click="$emit('toggle-play')"
          class="w-10 h-10 rounded-full border-2 border-brand flex items-center justify-center text-brand hover:bg-brand hover:text-white transition"
          :aria-label="isPlaying ? 'Pause' : 'Play'"
        >
          <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 5h4v14H6zm8 0h4v14h-4z"/>
          </svg>
        </button>
        <button @click="$emit('next')" class="p-2 hover:text-brand transition" aria-label="Next">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2z"/>
          </svg>
        </button>
      </div>

      <div class="hidden md:flex items-center gap-2 w-40">
        <span class="text-xs text-gray-500 dark:text-gray-400">Vol</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="volume"
          @input="$emit('set-volume', parseFloat($event.target.value))"
          class="w-full accent-brand"
        />
      </div>
    </div>

    <div
      ref="bar"
      @pointerdown="onPointerDown"
      class="max-w-7xl mx-auto mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden cursor-pointer group relative"
    >
      <div
        class="h-full bg-brand"
        :class="{ 'transition-all': !dragging }"
        :style="{ width: progress + '%' }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MiniPlayer',
  props: {
    song: { type: Object, required: true },
    isPlaying: { type: Boolean, default: false },
    volume: { type: Number, default: 0.7 },
    progress: { type: Number, default: 0 }
  },
  emits: ['toggle-play', 'next', 'prev', 'set-volume', 'seek'],
  data() {
    return { dragging: false }
  },
  beforeUnmount() {
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerup', this.onPointerUp)
  },
  methods: {
    seekAt(clientX) {
      const el = this.$refs.bar
      if (!el) return
      const rect = el.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      this.$emit('seek', ratio)
    },
    onPointerDown(e) {
      this.dragging = true
      this.seekAt(e.clientX)
      window.addEventListener('pointermove', this.onPointerMove)
      window.addEventListener('pointerup', this.onPointerUp)
    },
    onPointerMove(e) {
      if (this.dragging) this.seekAt(e.clientX)
    },
    onPointerUp() {
      this.dragging = false
      window.removeEventListener('pointermove', this.onPointerMove)
      window.removeEventListener('pointerup', this.onPointerUp)
    }
  }
}
</script>
