<template>
  <!-- sticky top nav bar -->
  <nav class="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">

      <!-- logo links back to home -->
      <router-link to="/" class="text-2xl font-bold text-brand">
        SpoJeDy
      </router-link>

      <!-- page navigation links — active link gets brand color -->
      <div class="flex items-center gap-6 ml-4">
        <router-link
          to="/"
          class="text-base hover:text-brand transition-colors"
          active-class="text-brand font-medium"
          exact-active-class="text-brand font-medium"
        >Home</router-link>
        <router-link
          to="/music-videos"
          class="text-base hover:text-brand transition-colors"
          active-class="text-brand font-medium underline"
        >Music Videos</router-link>
        <router-link
          to="/profile"
          class="text-base hover:text-brand transition-colors"
          active-class="text-brand font-medium underline"
        >Profile</router-link>
      </div>

      <!-- spacer pushes search and avatar to the right -->
      <div class="flex-1"></div>

      <!-- search bar with dropdown results — hidden on mobile -->
      <div class="relative hidden md:flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 w-72" ref="searchWrapper">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          v-model="searchQuery"
          @input="onInput"
          @focus="onFocus"
          @keydown.escape="closeDropdown"
          @keydown.enter="goToFirst"
          type="text"
          placeholder="Search songs..."
          class="ml-2 bg-transparent outline-none text-sm flex-1 placeholder-gray-400"
        />

        <!-- dropdown appears when there's a query and results exist -->
        <div
          v-if="showDropdown && searchQuery.trim()"
          class="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
        >
          <template v-if="filteredResults.length">
            <!-- each result row navigates to that song on click -->
            <div
              v-for="result in filteredResults"
              :key="result.id"
              @click="goTo(result)"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <img :src="result.cover" :alt="result.title" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ result.title }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ result.artist }}</div>
              </div>
              <span class="text-xs text-gray-400 flex-shrink-0 ml-2">{{ result.duration }}</span>
            </div>
          </template>
          <!-- shown when no songs match the query -->
          <div v-else class="px-4 py-4 text-sm text-gray-400 text-center">
            No results for "{{ searchQuery }}"
          </div>
        </div>
      </div>

      <!-- profile avatar — links to profile page -->
      <router-link to="/profile" class="flex items-center gap-3">
        <span class="text-base hidden sm:inline">{{ username }}</span>
        <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-300 dark:border-gray-600">
          <!-- shows avatar image if one is saved, otherwise shows initials -->
          <img
            v-if="profileImage"
            :src="profileImage"
            alt="Profile"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            {{ initials }}
          </div>
        </div>
      </router-link>

    </div>
  </nav>
</template>

<script>
import { songs } from '../data/media.js'

export default {
  name: 'NavBar',
  props: {
    username: { type: String, default: 'user123' },
    profileImage: { type: String, default: '' } //blob:// url or empty string
  },
  data() {
    return {
      searchQuery: '',
      showDropdown: false
    }
  },
  computed: {
    initials() {
      if (!this.username) return 'U'
      return this.username.slice(0, 2).toUpperCase() //first two letters of username
    },
    filteredResults() {
      //filter songs where title or artist contains the search query
      const q = this.searchQuery.trim().toLowerCase()
      if (!q) return []
      return songs.filter(s =>
        s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
      )
    }
  },
  methods: {
    onInput() {
      this.showDropdown = true //show dropdown whenever user types
    },
    onFocus() {
      if (this.searchQuery.trim()) this.showDropdown = true //re-show if there's already a query
    },
    closeDropdown() {
      this.showDropdown = false
    },
    goTo(song) {
      //navigate to the song and clear the search
      this.showDropdown = false
      this.searchQuery = ''
      this.$router.push({ name: 'song-detail', params: { id: song.id } })
    },
    goToFirst() {
      if (this.filteredResults.length) this.goTo(this.filteredResults[0]) //enter key picks the first result
    },
    handleClickOutside(e) {
      //close dropdown when clicking anywhere outside the search bar
      if (this.$refs.searchWrapper && !this.$refs.searchWrapper.contains(e.target)) {
        this.showDropdown = false
      }
    }
  },
  mounted() {
    document.addEventListener('mousedown', this.handleClickOutside)
  },
  unmounted() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }
}
</script>
