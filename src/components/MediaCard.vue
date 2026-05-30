<template>
  <!-- clickable card that emits a click event with the item data -->
  <div
    @click="$emit('click', item)"
    class="cursor-pointer rounded-2xl border-2 border-gray-300 dark:border-gray-600 p-3 hover:border-brand hover:shadow-lg transition-all bg-white dark:bg-gray-800"
    :class="variant === 'mv' ? 'w-full' : 'w-56 flex-shrink-0'"
  >
    <!-- image container — aspect ratio changes depending on song or music video -->
    <div
      class="rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden border border-dashed border-gray-300 dark:border-gray-500 relative"
      :class="variant === 'mv' ? 'aspect-video' : 'aspect-square'"
    >
      <!-- cover image with blur-up loading and lazy load -->
      <img
        :src="imageSrc"
        :alt="item.title"
        class="w-full h-full object-cover"
        :class="imgLoaded ? 'img-loaded' : 'img-loading'"
        loading="lazy"
        @load="imgLoaded = true"
      />
      <!-- play button overlay that appears on hover -->
      <div class="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
        <div class="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- title and artist text below the image -->
    <div class="mt-3 px-1">
      <p class="font-semibold truncate">{{ item.title }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ item.artist }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaCard',
  props: {
    item: { type: Object, required: true }, //the song or video object
    variant: { type: String, default: 'song' } //either 'song' or 'mv' — controls layout
  },
  emits: ['click'],
  data() {
    return {
      imgLoaded: false //tracks if the image has finished loading
    }
  },
  computed: {
    //picks the right image field depending on the variant
    imageSrc() {
      return this.variant === 'mv' ? this.item.thumbnail : this.item.cover
    }
  }
}
</script>
