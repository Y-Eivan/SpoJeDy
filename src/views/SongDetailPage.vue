<template>
  <div class="max-w-7xl mx-auto px-6 py-6">
    <router-link to="/" class="inline-flex items-center gap-2 text-brand text-sm hover:underline">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
      Back to Home
    </router-link>

    <div v-if="song" class="mt-3">
      <h1 class="text-2xl font-bold mb-4">Song Detail</h1>

      <div class="flex flex-col lg:flex-row gap-6">
        <div
          @click="openFullscreen"
          class="w-full lg:w-96 aspect-square rounded-2xl overflow-hidden flex-shrink-0 shadow-md cursor-zoom-in group relative"
        >
          <img
            :src="song.cover"
            :alt="song.title"
            class="w-full h-full object-cover"
            :class="coverLoaded ? 'img-loaded' : 'img-loading'"
            @load="coverLoaded = true"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 8v6M8 11h6M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </div>
        </div>

        <div class="flex-1">
          <h2 class="text-3xl font-bold">{{ song.title }}</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            {{ song.artist }} · {{ song.genre }} · {{ song.duration }}
          </p>

          <div class="mt-6 border-2 border-gray-300 dark:border-gray-600 rounded-2xl p-6 bg-gray-50 dark:bg-gray-800">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-sm text-gray-500 dark:text-gray-400 w-12">{{ formatTime(currentTime) }}</span>
              <input
                type="range"
                min="0"
                :max="duration || 0"
                step="0.1"
                :value="currentTime"
                @input="onSeek($event.target.value)"
                class="flex-1 accent-brand"
              />
              <span class="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">{{ formatTime(duration) }}</span>
            </div>

            <div class="flex items-center justify-center gap-6">
              <button @click="prev" class="p-2 hover:text-brand transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              <button
                @click="togglePlay"
                class="w-16 h-16 rounded-full border-2 border-brand flex items-center justify-center text-brand hover:bg-brand hover:text-white transition"
              >
                <svg v-if="!isLocalPlaying" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 5h4v14H6zm8 0h4v14h-4z"/>
                </svg>
              </button>
              <button @click="next" class="p-2 hover:text-brand transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2z"/>
                </svg>
              </button>
              <button
                @click="$emit('toggle-loop')"
                class="p-2 transition"
                :class="loop ? 'text-brand' : 'text-gray-400 hover:text-brand'"
                aria-label="Loop"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                </svg>
              </button>
            </div>

            <div class="flex items-center gap-3 mt-6 justify-center">
              <button
                @click="$emit('toggle-mute')"
                class="p-1 hover:text-brand transition flex-shrink-0"
                aria-label="Toggle mute"
              >
                <svg v-if="!muted" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM11 4L7.73 9H3v6h4l5 5v-6.73L11 4z"/>
                </svg>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                :value="localVolume"
                @input="onVolumeChange($event.target.value)"
                class="w-48 accent-brand"
              />
            </div>

            <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Audio streamed from ImageKit CDN.
            </p>
          </div>

          <button
            v-if="song.musicVideoId"
            @click="goToMusicVideo"
            class="mt-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-2xl p-4 flex items-center justify-center gap-3 hover:border-brand hover:text-brand transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
            </svg>
            Watch Music Video &gt;
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-gray-500">Song not found.</p>
    </div>

    <!-- Fullscreen cover overlay -->
    <div
      v-if="fullscreen && song"
      class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center overflow-hidden select-none"
      @wheel.prevent="onWheel"
      @mousedown="onPanStart"
      @mousemove="onPanMove"
      @mouseup="onPanEnd"
      @mouseleave="onPanEnd"
    >
      <img
        :src="song.cover"
        :alt="song.title"
        class="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-100"
        :style="{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          cursor: zoom > 1 ? (panning ? 'grabbing' : 'grab') : 'default'
        }"
        draggable="false"
      />

      <!-- Top-right controls -->
      <div class="absolute top-4 right-4 flex items-center gap-2">
        <button
          @click.stop="zoomOut"
          class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <button
          @click.stop="zoomIn"
          class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          @click.stop="closeFullscreen"
          class="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center transition"
          aria-label="Exit fullscreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Zoom indicator -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-xs px-3 py-1 rounded-full">
        {{ Math.round(zoom * 100) }}% · Scroll to zoom · Drag to pan · Esc to exit
      </div>
    </div>
  </div>
</template>

<script>
import { findSong } from '../data/media'

export default {
  name: 'SongDetailPage',
  props: {
    id: { type: [String, Number], required: true },
    currentSong: { type: Object, default: null },
    isPlaying: { type: Boolean, default: false },
    volume: { type: Number, default: 0.7 },
    muted: { type: Boolean, default: false },
    loop: { type: Boolean, default: false },
    currentTime: { type: Number, default: 0 },
    duration: { type: Number, default: 0 }
  },
  emits: ['play-song', 'toggle-play', 'next', 'prev', 'set-volume', 'seek', 'toggle-mute', 'toggle-loop'],
  data() {
    return {
      coverLoaded: false,
      fullscreen: false,
      zoom: 1,
      panX: 0,
      panY: 0,
      panning: false,
      panStartX: 0,
      panStartY: 0
    }
  },
  computed: {
    song() {
      return findSong(this.id)
    },
    isLocalPlaying() {
      return this.isPlaying && this.currentSong && this.song && this.currentSong.id === this.song.id
    },
    localVolume() {
      return this.volume
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(newId) {
        const s = findSong(newId)
        if (s && (!this.currentSong || this.currentSong.id !== s.id)) {
          this.$emit('play-song', s)
        }
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKeyDown)
  },
  methods: {
    formatTime(sec) {
      if (!sec || isNaN(sec)) return '0:00'
      const m = Math.floor(sec / 60)
      const s = Math.floor(sec % 60).toString().padStart(2, '0')
      return `${m}:${s}`
    },
    togglePlay() {
      if (!this.currentSong || this.currentSong.id !== this.song.id) {
        this.$emit('play-song', this.song)
      } else {
        this.$emit('toggle-play')
      }
    },
    next() { this.$emit('next') },
    prev() { this.$emit('prev') },
    onVolumeChange(v) { this.$emit('set-volume', parseFloat(v)) },
    onSeek(value) {
      if (this.duration > 0) {
        this.$emit('seek', parseFloat(value) / this.duration)
      }
    },
    goToMusicVideo() {
      this.$router.push({ name: 'mv-detail', params: { id: this.song.musicVideoId } })
    },
    onKeyDown(e) {
      if (this.fullscreen) {
        if (e.key === 'Escape') this.closeFullscreen()
        else if (e.key === '+' || e.key === '=') this.zoomIn()
        else if (e.key === '-' || e.key === '_') this.zoomOut()
        return
      }
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault()
        this.togglePlay()
      }
    },
    openFullscreen() {
      this.fullscreen = true
      this.zoom = 1
      this.panX = 0
      this.panY = 0
      document.body.style.overflow = 'hidden'
    },
    closeFullscreen() {
      this.fullscreen = false
      document.body.style.overflow = ''
    },
    zoomIn() {
      this.zoom = Math.min(5, this.zoom + 0.25)
    },
    zoomOut() {
      const next = Math.max(0.5, this.zoom - 0.25)
      this.zoom = next
      if (next <= 1) { this.panX = 0; this.panY = 0 }
    },
    onWheel(e) {
      const delta = e.deltaY < 0 ? 0.15 : -0.15
      const next = Math.min(5, Math.max(0.5, this.zoom + delta))
      this.zoom = next
      if (next <= 1) { this.panX = 0; this.panY = 0 }
    },
    onPanStart(e) {
      if (this.zoom <= 1) return
      this.panning = true
      this.panStartX = e.clientX - this.panX
      this.panStartY = e.clientY - this.panY
    },
    onPanMove(e) {
      if (!this.panning) return
      this.panX = e.clientX - this.panStartX
      this.panY = e.clientY - this.panStartY
    },
    onPanEnd() {
      this.panning = false
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
    document.body.style.overflow = ''
  }
}
</script>
