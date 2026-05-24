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

    <div class="yt-audio-host" aria-hidden="true">
      <div ref="ytMount"></div>
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import MiniPlayer from './components/MiniPlayer.vue'
import { songs } from './data/media'
import { loadYouTubeAPI } from './utils/youtube'

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
      duration: 0,
      player: null,
      playerReady: false,
      pendingSong: null,
      pollTimer: null
    }
  },
  created() {
    this.loadProfile()
    if (!this.currentSong) {
      this.currentSong = songs[0]
    }
  },
  async mounted() {
    window.addEventListener('spojedy-profile-updated', this.loadProfile)
    try {
      const YT = await loadYouTubeAPI()
      const mountDiv = document.createElement('div')
      this.$refs.ytMount.appendChild(mountDiv)
      this.player = new YT.Player(mountDiv, {
        height: '1',
        width: '1',
        videoId: this.currentSong ? this.currentSong.youtubeId : '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: this.onPlayerReady,
          onStateChange: this.onPlayerStateChange
        }
      })
    } catch (e) {
      console.error('Failed to load YouTube API', e)
    }
  },
  beforeUnmount() {
    window.removeEventListener('spojedy-profile-updated', this.loadProfile)
    if (this.pollTimer) clearInterval(this.pollTimer)
    if (this.player && this.player.destroy) this.player.destroy()
  },
  methods: {
    loadProfile() {
      const data = localStorage.getItem('spojedy-profile')
      if (data) {
        try {
          const parsed = JSON.parse(data)
          this.username = parsed.username || 'user123'
          this.profileImage = parsed.profileImage || ''
        } catch (e) {
          // noop
        }
      }
    },
    onPlayerReady() {
      this.playerReady = true
      if (this.player.setVolume) this.player.setVolume(Math.round(this.volume * 100))
      if (this.pendingSong) {
        this.loadAndPlay(this.pendingSong)
        this.pendingSong = null
      }
      this.pollTimer = setInterval(this.pollProgress, 250)
    },
    onPlayerStateChange(e) {
      const YT = window.YT
      if (!YT) return
      if (e.data === YT.PlayerState.PLAYING) {
        this.isPlaying = true
      } else if (e.data === YT.PlayerState.PAUSED) {
        this.isPlaying = false
      } else if (e.data === YT.PlayerState.ENDED) {
        this.isPlaying = false
        this.nextSong()
      }
    },
    pollProgress() {
      if (!this.player || !this.player.getDuration) return
      const dur = this.player.getDuration() || 0
      const cur = this.player.getCurrentTime() || 0
      this.duration = dur
      this.currentTime = cur
      if (dur > 0) this.progress = (cur / dur) * 100
    },
    loadAndPlay(song) {
      if (!this.player || !this.player.loadVideoById || !song.youtubeId) return
      this.player.loadVideoById(song.youtubeId)
    },
    playSong(song) {
      this.currentSong = song
      this.isPlaying = true
      if (!this.playerReady) {
        this.pendingSong = song
        return
      }
      this.loadAndPlay(song)
    },
    togglePlay() {
      if (!this.player || !this.playerReady) return
      const YT = window.YT
      const state = this.player.getPlayerState()
      if (state === YT.PlayerState.PLAYING) {
        this.player.pauseVideo()
      } else {
        this.player.playVideo()
      }
    },
    pauseAudio() {
      if (this.player && this.playerReady && this.player.pauseVideo) {
        this.player.pauseVideo()
      }
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
      if (this.player && this.playerReady && this.player.setVolume) {
        this.player.setVolume(Math.round(v * 100))
      }
    },
    seekTo(ratio) {
      if (!this.player || !this.playerReady || !this.player.getDuration) return
      const dur = this.player.getDuration()
      if (dur > 0) {
        this.player.seekTo(ratio * dur, true)
        this.progress = ratio * 100
      }
    }
  }
}
</script>

<style scoped>
.yt-audio-host {
  position: fixed;
  left: -9999px;
  top: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
  pointer-events: none;
}
</style>
