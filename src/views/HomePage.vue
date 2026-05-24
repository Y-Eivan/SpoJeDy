<template>
  <div class="max-w-7xl mx-auto px-6 py-6">
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Hero / Featured</h2>
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 bg-gray-50 dark:bg-gray-800">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-8">
          <div
            @click="goToSong(featured)"
            class="w-40 h-40 rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-500 overflow-hidden flex-shrink-0 cursor-pointer hover:border-brand"
          >
            <img :src="featured.cover" :alt="featured.title" class="w-full h-full object-cover" />
          </div>
          <div class="text-center sm:text-left">
            <h3 class="text-2xl font-bold leading-tight">{{ featured.title }}</h3>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              {{ featured.artist }} · {{ featured.genre }}
            </p>
            <button
              @click="playFeatured"
              class="mt-4 px-5 py-2 rounded-full bg-brand text-white font-medium inline-flex items-center gap-2 hover:bg-brand-dark transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Listen On Repeat</h2>
      <div class="flex gap-4 overflow-x-auto pb-2 media-row">
        <MediaCard
          v-for="song in repeatSongs"
          :key="song.id"
          :item="song"
          variant="song"
          @click="goToSong(song)"
        />
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Pop Music</h2>
      <div class="flex gap-4 overflow-x-auto pb-2 media-row">
        <MediaCard
          v-for="song in popSongs"
          :key="song.id"
          :item="song"
          variant="song"
          @click="goToSong(song)"
        />
      </div>
    </section>
  </div>
</template>

<script>
import MediaCard from '../components/MediaCard.vue'
import { songs } from '../data/media'

export default {
  name: 'HomePage',
  components: { MediaCard },
  props: {
    currentSong: { type: Object, default: null }
  },
  emits: ['play-song'],
  data() {
    return {
      songs
    }
  },
  computed: {
    featured() {
      return this.songs[0]
    },
    repeatSongs() {
      return this.songs.filter(s => s.category === 'repeat')
    },
    popSongs() {
      return this.songs.filter(s => s.category === 'pop')
    }
  },
  methods: {
    goToSong(song) {
      this.$router.push({ name: 'song-detail', params: { id: song.id } })
    },
    playFeatured() {
      this.$emit('play-song', this.featured)
    }
  }
}
</script>
