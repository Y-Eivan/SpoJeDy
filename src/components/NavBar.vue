<template>
  <nav class="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
      <router-link to="/" class="text-2xl font-bold text-brand">
        SpoJeDy
      </router-link>

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

      <div class="flex-1"></div>

      <div class="hidden md:flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 w-72">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          v-model="searchQuery"
          @keyup.enter="onSearch"
          type="text"
          placeholder="Search..."
          class="ml-2 bg-transparent outline-none text-sm flex-1 placeholder-gray-400"
        />
      </div>

      <router-link to="/profile" class="flex items-center gap-3">
        <span class="text-base hidden sm:inline">{{ username }}</span>
        <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-300 dark:border-gray-600">
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
export default {
  name: 'NavBar',
  props: {
    username: { type: String, default: 'user123' },
    profileImage: { type: String, default: '' }
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    initials() {
      if (!this.username) return 'U'
      return this.username.slice(0, 2).toUpperCase()
    }
  },
  methods: {
    onSearch() {
      this.$emit('search', this.searchQuery)
    }
  }
}
</script>
