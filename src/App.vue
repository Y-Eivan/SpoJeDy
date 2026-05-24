<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex flex-col">
    <NavBar :username="username" :profileImage="profileImage" />

    <main class="flex-1 pb-28">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component
            :is="Component"
            :current-song="currentSong"
            :is-playing="isPlaying"
            :volume="volume"
            :current-time="currentTime"
            :duration="duration"
            @play-song="playSong"
            @toggle-play="togglePlay"
            @next="nextSong"
            @prev="prevSong"
            @set-volume="setVolume"
            @seek="seekTo"
            @pause-audio="pauseAudio"
          />
        </transition>
      </router-view>
    </main>

    <MiniPlayer
      v-if="currentSong"
      :song="currentSong"
      :is-playing="isPlaying"
      :volume="volume"
      :progress="progress"
      @toggle-play="togglePlay"
      @next="nextSong"
      @prev="prevSong"
      @set-volume="setVolume"
      @seek="seekTo"
    />

    <!-- Global HTML5 audio element. Streamed from ImageKit CDN. -->
    <audio
      ref="audio"
      :src="currentSong ? currentSong.audioUrl : ''"
      preload="metadata"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="nextSong"
    ></audio>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import MiniPlayer from './components/MiniPlayer.vue'
import { songs } from './data/media'
import { loadBlob } from './utils/blobStore'

export default {
  name: 'App',
  components: { NavBar, MiniPlayer },
  data() {
    return {
      username: 'user123',
      profileImage: '',
      currentSong: null,
      isPlaying: false,
      volume: 0.7,
      progress: 0,
      currentTime: 0,
      duration: 0
    }
  },
  created() {
    this.loadProfile()
    // Apply saved theme before first paint so it persists across reloads.
    if (localStorage.getItem('spojedy-theme') === 'dark') {
      document.documentElement.classList.add('dark')
    }
    if (!this.currentSong) {
      this.currentSong = songs[0]
    }
  },
  mounted() {
    window.addEventListener('spojedy-profile-updated', this.loadProfile)
    if (this.$refs.audio) {
      this.$refs.audio.volume = this.volume
    }
  },
  beforeUnmount() {
    window.removeEventListener('spojedy-profile-updated', this.loadProfile)
  },
  methods: {
    async loadProfile() {
      const data = localStorage.getItem('spojedy-profile')
      if (data) {
        try {
          const parsed = JSON.parse(data)
          this.username = parsed.username || 'user123'
        } catch (e) {
          // noop
        }
      }
      // Avatar lives in IndexedDB as a Blob; expose it as an object URL.
      try {
        const blob = await loadBlob('avatar')
        if (this.profileImage && this.profileImage.startsWith('blob:')) {
          URL.revokeObjectURL(this.profileImage)
        }
        this.profileImage = blob ? URL.createObjectURL(blob) : ''
      } catch (e) {
        console.warn('Failed to load avatar from IndexedDB', e)
      }
    },
    onTimeUpdate() {
      const a = this.$refs.audio
      if (!a) return
      this.currentTime = a.currentTime || 0
      if (a.duration > 0) this.progress = (a.currentTime / a.duration) * 100
    },
    onLoadedMetadata() {
      const a = this.$refs.audio
      if (a) this.duration = a.duration || 0
    },
    playSong(song) {
      this.currentSong = song
      // Vue updates <audio :src> on next tick; reload then play.
      this.$nextTick(() => {
        const a = this.$refs.audio
        if (!a) return
        a.load()
        a.volume = this.volume
        a.play().catch(() => {
          // Browsers block autoplay without user gesture; user can press play manually.
        })
      })
    },
    togglePlay() {
      const a = this.$refs.audio
      if (!a) return
      if (a.paused) {
        a.play().catch(() => {})
      } else {
        a.pause()
      }
    },
    pauseAudio() {
      const a = this.$refs.audio
      if (a && !a.paused) a.pause()
    },
    nextSong() {
      if (!this.currentSong) return
      const i = songs.findIndex(s => s.id === this.currentSong.id)
      const next = songs[(i + 1) % songs.length]
      this.playSong(next)
    },
    prevSong() {
      if (!this.currentSong) return
      const i = songs.findIndex(s => s.id === this.currentSong.id)
      const prev = songs[(i - 1 + songs.length) % songs.length]
      this.playSong(prev)
    },
    setVolume(v) {
      this.volume = v
      if (this.$refs.audio) this.$refs.audio.volume = v
    },
    seekTo(ratio) {
      const a = this.$refs.audio
      if (a && a.duration > 0) {
        a.currentTime = ratio * a.duration
        this.progress = ratio * 100
      }
    }
  }
}
</script>
