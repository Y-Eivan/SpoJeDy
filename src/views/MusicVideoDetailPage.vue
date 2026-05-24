<template>
  <div class="max-w-7xl mx-auto px-6 py-6">
    <router-link
      to="/music-videos"
      class="inline-flex items-center gap-2 text-brand text-sm hover:underline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
      Back to Music Videos
    </router-link>

    <div v-if="mv" class="mt-3">
      <h1 class="text-2xl font-bold mb-4">Music Video Detail</h1>

      <div
        ref="videoWrapper"
        class="border-2 border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden bg-black relative aspect-video"
      >
        <div ref="ytMount" class="absolute inset-0"></div>
        <div
          v-if="!playerReady"
          class="absolute inset-0 flex items-center justify-center text-white text-sm"
        >
          Loading video…
        </div>
      </div>

      <div class="flex items-center gap-3 mt-3 px-1">
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

      <div class="mt-3 border-2 border-gray-300 dark:border-gray-600 rounded-2xl p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="prev" class="p-2 hover:text-brand transition" aria-label="Previous">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          <button
            @click="togglePlay"
            class="w-10 h-10 rounded-full border-2 border-brand flex items-center justify-center text-brand hover:bg-brand hover:text-white transition"
            :aria-label="isPlayingVideo ? 'Pause' : 'Play'"
          >
            <svg v-if="!isPlayingVideo" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 5h4v14H6zm8 0h4v14h-4z"/>
            </svg>
          </button>
          <button @click="next" class="p-2 hover:text-brand transition" aria-label="Next">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2z"/>
            </svg>
          </button>

          <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </span>
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="goFullscreen"
            class="p-2 hover:text-brand transition"
            aria-label="Fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          </button>
          <span class="text-sm text-gray-500 dark:text-gray-400">Vol</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="videoVolume"
            @input="onVolumeChange($event.target.value)"
            class="w-32 accent-brand"
          />
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold">{{ mv.title }}</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ mv.artist }} · {{ mv.genre }}</p>
        </div>
        <button
          v-if="mv.songId"
          @click="goToSong"
          class="px-5 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl flex items-center gap-2 hover:border-brand hover:text-brand transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          Listen
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 11v2h12l-5.5 5.5L12 20l8-8-8-8-1.5 1.5L16 11z"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-gray-500">Music video not found.</p>
    </div>
  </div>
</template>

<script>
import { findMusicVideo, musicVideos } from '../data/media'
import { loadYouTubeAPI } from '../utils/youtube'

export default {
  name: 'MusicVideoDetailPage',
  props: {
    id: { type: [String, Number], required: true }
  },
  emits: ['pause-audio'],
  data() {
    return {
      isPlayingVideo: false,
      currentTime: 0,
      duration: 0,
      videoVolume: 0.7,
      player: null,
      playerReady: false,
      pollTimer: null
    }
  },
  computed: {
    mv() {
      return findMusicVideo(this.id)
    }
  },
  watch: {
    id(newId) {
      const mv = findMusicVideo(newId)
      if (mv && this.player && this.playerReady && mv.youtubeId) {
        this.isPlayingVideo = false
        this.currentTime = 0
        this.player.loadVideoById(mv.youtubeId)
      }
    }
  },
  async mounted() {
    this.$emit('pause-audio')
    window.addEventListener('keydown', this.onKey)
    try {
      const YT = await loadYouTubeAPI()
      if (!this.mv || !this.mv.youtubeId) return
      this.player = new YT.Player(this.$refs.ytMount, {
        height: '100%',
        width: '100%',
        videoId: this.mv.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          disablekb: 1
        },
        events: {
          onReady: this.onReady,
          onStateChange: this.onStateChange
        }
      })
    } catch (e) {
      console.error('Failed to load YouTube player', e)
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKey)
    if (this.pollTimer) clearInterval(this.pollTimer)
    if (this.player && this.player.destroy) this.player.destroy()
  },
  methods: {
    onReady() {
      this.playerReady = true
      if (this.player.setVolume) this.player.setVolume(Math.round(this.videoVolume * 100))
      this.pollTimer = setInterval(this.poll, 250)
    },
    onStateChange(e) {
      const YT = window.YT
      if (!YT) return
      if (e.data === YT.PlayerState.PLAYING) this.isPlayingVideo = true
      else if (e.data === YT.PlayerState.PAUSED) this.isPlayingVideo = false
      else if (e.data === YT.PlayerState.ENDED) {
        this.isPlayingVideo = false
        this.next()
      }
    },
    poll() {
      if (!this.player || !this.player.getDuration) return
      this.duration = this.player.getDuration() || 0
      this.currentTime = this.player.getCurrentTime() || 0
    },
    togglePlay() {
      if (!this.player || !this.playerReady) return
      const YT = window.YT
      const state = this.player.getPlayerState()
      if (state === YT.PlayerState.PLAYING) this.player.pauseVideo()
      else this.player.playVideo()
    },
    onSeek(value) {
      if (this.player && this.playerReady) this.player.seekTo(parseFloat(value), true)
    },
    onVolumeChange(v) {
      this.videoVolume = parseFloat(v)
      if (this.player && this.playerReady && this.player.setVolume) {
        this.player.setVolume(Math.round(this.videoVolume * 100))
      }
    },
    next() {
      const i = musicVideos.findIndex(x => x.id === this.mv.id)
      const nextMV = musicVideos[(i + 1) % musicVideos.length]
      this.$router.push({ name: 'mv-detail', params: { id: nextMV.id } })
    },
    prev() {
      const i = musicVideos.findIndex(x => x.id === this.mv.id)
      const prevMV = musicVideos[(i - 1 + musicVideos.length) % musicVideos.length]
      this.$router.push({ name: 'mv-detail', params: { id: prevMV.id } })
    },
    goFullscreen() {
      const wrap = this.$refs.videoWrapper
      if (!wrap) return
      if (wrap.requestFullscreen) wrap.requestFullscreen()
      else if (wrap.webkitRequestFullscreen) wrap.webkitRequestFullscreen()
      else if (wrap.msRequestFullscreen) wrap.msRequestFullscreen()
    },
    goToSong() {
      this.$router.push({ name: 'song-detail', params: { id: this.mv.songId } })
    },
    onKey(e) {
      if (e.target.tagName === 'INPUT') return
      if (e.key === ' ') {
        e.preventDefault()
        this.togglePlay()
      } else if (e.key === 'f' || e.key === 'F') {
        this.goFullscreen()
      }
    },
    formatTime(sec) {
      if (!sec || isNaN(sec)) return '0:00'
      const m = Math.floor(sec / 60)
      const s = Math.floor(sec % 60).toString().padStart(2, '0')
      return `${m}:${s}`
    }
  }
}
</script>
