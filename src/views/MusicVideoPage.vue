<template>
  <div class="max-w-7xl mx-auto px-6 py-6">

    <!-- featured hero — first video in the list -->
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Hero / Featured</h2>
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 bg-gray-50 dark:bg-gray-800">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-8">
          <!-- thumbnail, clicking navigates to the video -->
          <div
            @click="goToMV(featured)"
            class="w-40 h-40 rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-500 overflow-hidden flex-shrink-0 cursor-pointer hover:border-brand"
          >
            <img :src="featured.thumbnail" :alt="featured.title" class="w-full h-full object-cover" />
          </div>
          <!-- title, artist, genre and play button -->
          <div class="text-center sm:text-left">
            <h3 class="text-2xl font-bold leading-tight">{{ featured.title }}</h3>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              {{ featured.artist }} · {{ featured.genre }}
            </p>
            <button
              @click="goToMV(featured)"
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

    <!-- grid of videos filtered by 'repeat' category -->
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Watch Again, and Again</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <MediaCard
          v-for="mv in repeatMVs"
          :key="mv.id"
          :item="mv"
          variant="mv"
          @click="goToMV(mv)"
        />
      </div>
    </section>

    <!-- grid of videos filtered by 'pop' category -->
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Pop MV</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <MediaCard
          v-for="mv in popMVs"
          :key="mv.id"
          :item="mv"
          variant="mv"
          @click="goToMV(mv)"
        />
      </div>
    </section>

  </div>
</template>

<script>
import MediaCard from '../components/MediaCard.vue'
import { musicVideos } from '../data/media'

export default {
  name: 'MusicVideoPage',
  components: { MediaCard },
  data() {
    return {
      musicVideos //all videos from media.js
    }
  },
  computed: {
    featured() {
      return this.musicVideos[0] //first video is the featured one
    },
    repeatMVs() {
      return this.musicVideos.filter(v => v.category === 'repeat') //only 'repeat' category
    },
    popMVs() {
      return this.musicVideos.filter(v => v.category === 'pop') //only 'pop' category
    }
  },
  methods: {
    goToMV(mv) {
      this.$router.push({ name: 'mv-detail', params: { id: mv.id } }) //navigate to video detail page
    }
  }
}
</script>
