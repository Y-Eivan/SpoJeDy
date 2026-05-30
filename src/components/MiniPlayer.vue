<template>
  <!-- fixed bar at the bottom of every page -->
  <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 z-30">
    <div class="max-w-7xl mx-auto flex items-center gap-4">

      <!-- small album art thumbnail -->
      <div class="w-14 h-14 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0">
        <img v-if="song.cover" :src="song.cover" :alt="song.title" class="w-full h-full object-cover" />
      </div>

      <!-- song title and artist -->
      <div class="min-w-0 flex-1 sm:flex-none sm:w-56">
        <p class="text-sm font-semibold truncate">{{ song.title }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ song.artist }}</p>
      </div>

      <!-- prev, play/pause, next buttons -->
      <div class="flex-1 flex items-center justify-center gap-4">
        <button @click="$emit('prev')" class="p-2 hover:text-brand transition" aria-label="Previous">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        <!-- play/pause icon swaps based on isPlaying prop -->
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

      <!-- loop, mute, volume — hidden on mobile -->
      <div class="hidden md:flex items-center gap-2 w-52">
        <!-- loop toggle — turns brand color when active -->
        <button
          @click="$emit('toggle-loop')"
          class="p-1 flex-shrink-0 transition"
          :class="loop ? 'text-brand' : 'text-gray-400 hover:text-brand'"
          aria-label="Loop"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
          </svg>
        </button>
        <!-- mute toggle — red icon when muted -->
        <button
          @click="$emit('toggle-mute')"
          class="p-1 flex-shrink-0 hover:text-brand transition"
          aria-label="Toggle mute"
        >
          <svg v-if="!muted" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM11 4L7.73 9H3v6h4l5 5v-6.73L11 4z"/>
          </svg>
        </button>
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

    <!-- draggable seek bar at the very bottom of the player -->
    <div
      ref="bar"
      @pointerdown="onPointerDown"
      class="max-w-7xl mx-auto mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden cursor-pointer group relative"
    >
      <!-- filled portion represents playback progress -->
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
    progress: { type: Number, default: 0 }, //0-100, drives the seek bar width
    muted: { type: Boolean, default: false },
    loop: { type: Boolean, default: false }
  },
  emits: ['toggle-play', 'next', 'prev', 'set-volume', 'seek', 'toggle-mute', 'toggle-loop'],
  data() {
    return { dragging: false } //true while user is dragging the seek bar
  },
  beforeUnmount() {
    //clean up listeners in case the component unmounts mid-drag
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerup', this.onPointerUp)
  },
  methods: {
    seekAt(clientX) {
      //convert the x position of the click/drag to a 0-1 ratio and emit it
      const el = this.$refs.bar
      if (!el) return
      const rect = el.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      this.$emit('seek', ratio)
    },
    onPointerDown(e) {
      this.dragging = true
      this.seekAt(e.clientX)
      //attach move and up listeners globally so drag works even outside the bar
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
