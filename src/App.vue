<template>
  <!-- root wrapper — dark mode class is toggled on <html> by ProfilePage -->
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex flex-col">

    <!-- sticky top nav bar -->
    <NavBar :username="username" :profileImage="profileImage" />

    <!-- page content area — router swaps components here with a fade transition -->
    <main class="flex-1 pb-28">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <!-- all playback state is passed down as props, events bubble back up -->
          <component
            :is="Component"
            :current-song="currentSong"
            :is-playing="isPlaying"
            :volume="volume"
            :muted="muted"
            :loop="loop"
            :current-time="currentTime"
            :duration="duration"
            @play-song="playSong"
            @toggle-play="togglePlay"
            @next="nextSong"
            @prev="prevSong"
            @set-volume="setVolume"
            @seek="seekTo"
            @pause-audio="pauseAudio"
            @toggle-mute="toggleMute"
            @toggle-loop="toggleLoop"
          />
        </transition>
      </router-view>
    </main>

    <!-- persistent mini player at the bottom — only shows once a song is loaded -->
    <MiniPlayer
      v-if="currentSong"
      :song="currentSong"
      :is-playing="isPlaying"
      :volume="volume"
      :muted="muted"
      :loop="loop"
      :progress="progress"
      @toggle-play="togglePlay"
      @next="nextSong"
      @prev="prevSong"
      @set-volume="setVolume"
      @seek="seekTo"
      @toggle-mute="toggleMute"
      @toggle-loop="toggleLoop"
    />

    <!-- the actual audio element — hidden, streams from ImageKit CDN -->
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
      profileImage: '', //blob:// url of the avatar
      currentSong: null, //the song object currently loaded in the audio element
      isPlaying: false,
      volume: 0.7,
      muted: false,
      loop: false,
      progress: 0, //0-100, drives the mini player seek bar
      currentTime: 0, //seconds elapsed
      duration: 0 //total seconds of current song
    }
  },
  created() {
    this.loadProfile()
    //apply saved theme before the first paint so there's no flash
    if (localStorage.getItem('spojedy-theme') === 'dark') {
      document.documentElement.classList.add('dark')
    }
    if (!this.currentSong) {
      this.currentSong = songs[0] //preload the first song so the mini player isn't empty
    }
  },
  mounted() {
    window.addEventListener('spojedy-profile-updated', this.loadProfile) //refresh avatar when profile is saved
    if (this.$refs.audio) {
      this.$refs.audio.volume = this.volume
    }
  },
  beforeUnmount() {
    window.removeEventListener('spojedy-profile-updated', this.loadProfile)
  },
  methods: {
    async loadProfile() {
      //read username from localStorage
      const data = localStorage.getItem('spojedy-profile')
      if (data) {
        try {
          const parsed = JSON.parse(data)
          this.username = parsed.username || 'user123'
        } catch (e) {
          // noop
        }
      }
      //read avatar blob from IndexedDB and convert to a displayable url
      try {
        const blob = await loadBlob('avatar')
        if (this.profileImage && this.profileImage.startsWith('blob:')) {
          URL.revokeObjectURL(this.profileImage) //free old url before replacing
        }
        this.profileImage = blob ? URL.createObjectURL(blob) : ''
      } catch (e) {
        console.warn('Failed to load avatar from IndexedDB', e)
      }
    },
    onTimeUpdate() {
      //called continuously while audio plays — keeps progress bar in sync
      const a = this.$refs.audio
      if (!a) return
      this.currentTime = a.currentTime || 0
      if (a.duration > 0) this.progress = (a.currentTime / a.duration) * 100
    },
    onLoadedMetadata() {
      //fired once when the audio file is ready — grab the total duration
      const a = this.$refs.audio
      if (a) this.duration = a.duration || 0
    },
    playSong(song) {
      this.currentSong = song
      //wait for vue to update :src, then reload and play
      this.$nextTick(() => {
        const a = this.$refs.audio
        if (!a) return
        a.load()
        a.volume = this.volume
        a.muted = this.muted
        a.loop = this.loop
        a.play().catch(() => {
          //browsers block autoplay without a user gesture — user can press play manually
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
      //called by MusicVideoDetailPage so audio doesn't play over the video
      const a = this.$refs.audio
      if (a && !a.paused) a.pause()
    },
    nextSong() {
      //wrap around to the first song when reaching the end of the list
      if (!this.currentSong) return
      const i = songs.findIndex(s => s.id === this.currentSong.id)
      const next = songs[(i + 1) % songs.length]
      this.playSong(next)
    },
    prevSong() {
      //wrap around to the last song when going back from the first
      if (!this.currentSong) return
      const i = songs.findIndex(s => s.id === this.currentSong.id)
      const prev = songs[(i - 1 + songs.length) % songs.length]
      this.playSong(prev)
    },
    setVolume(v) {
      this.volume = v
      if (this.$refs.audio) this.$refs.audio.volume = v
    },
    toggleMute() {
      this.muted = !this.muted
      if (this.$refs.audio) this.$refs.audio.muted = this.muted
    },
    toggleLoop() {
      this.loop = !this.loop
      if (this.$refs.audio) this.$refs.audio.loop = this.loop //native loop property handles replay automatically
    },
    seekTo(ratio) {
      //ratio is 0-1, convert to seconds using total duration
      const a = this.$refs.audio
      if (a && a.duration > 0) {
        a.currentTime = ratio * a.duration
        this.progress = ratio * 100
      }
    }
  }
}
</script>
