<template>
  <div class="max-w-3xl mx-auto px-6 py-6">
    <h1 class="text-2xl font-bold mb-4">Profile</h1>

    <!-- profile image upload section -->
    <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 flex flex-col items-center">

      <!-- shows the image if one is saved, otherwise shows placeholder text -->
      <div class="w-36 h-36 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-500 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700 relative">
        <img
          v-if="profileImage"
          :src="profileImage"
          alt="Profile"
          class="w-full h-full object-cover"
          :class="imgReady ? 'img-loaded' : 'img-loading'"
          @load="imgReady = true"
        />
        <span v-else class="text-gray-500 text-sm text-center px-4">Profile Image</span>
      </div>

      <!-- label wraps the hidden file input so clicking the button opens the file picker -->
      <label class="mt-4 px-6 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-brand hover:text-brand transition">
        <span>{{ uploading ? 'Compressing...' : 'Upload Image' }}</span>
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange"
        />
      </label>
    </div>

    <!-- progress bar — only visible while uploading/compressing -->
    <div v-if="uploadProgress > 0 || uploading" class="mt-2 flex items-center gap-3">
      <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
        <div class="h-full bg-brand transition-all" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <span class="text-sm text-brand w-12 text-right">{{ uploadProgress }}%</span>
    </div>

    <!-- username input and save button -->
    <div class="mt-8">
      <h2 class="text-lg font-semibold mb-3">Username</h2>
      <div class="flex gap-3">
        <input
          v-model="username"
          type="text"
          class="flex-1 border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 outline-none focus:border-brand"
          placeholder="user123"
        />
        <button
          @click="saveProfile"
          class="px-8 py-3 border-2 border-brand text-brand rounded-xl hover:bg-brand hover:text-white transition font-medium"
        >
          Save
        </button>
      </div>
      <!-- success message that fades in and out after saving -->
      <transition name="fade">
        <p v-if="savedMessage" class="mt-2 text-sm text-green-600 dark:text-green-400">{{ savedMessage }}</p>
      </transition>
    </div>

    <!-- dark/light theme toggle buttons -->
    <div class="mt-8">
      <h2 class="text-lg font-semibold mb-3">Theme Preference</h2>
      <div class="grid grid-cols-2 gap-3">
        <!-- active button gets brand color, inactive gets gray -->
        <button
          @click="setTheme('dark')"
          class="py-3 rounded-xl border-2 transition"
          :class="theme === 'dark' ? 'border-brand text-brand font-medium' : 'border-gray-300 dark:border-gray-600 text-gray-500'"
        >
          Dark
        </button>
        <button
          @click="setTheme('light')"
          class="py-3 rounded-xl border-2 transition"
          :class="theme === 'light' ? 'border-brand text-brand font-medium' : 'border-gray-300 dark:border-gray-600 text-gray-500'"
        >
          Light
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { saveBlob, loadBlob } from '../utils/blobStore'

export default {
  name: 'ProfilePage',
  data() {
    return {
      username: 'user123',
      profileImage: '', //blob:// url of the avatar, empty if none saved
      theme: 'light',
      uploading: false,
      uploadProgress: 0, //0-100, drives the progress bar
      imgReady: false, //triggers blur-up once image finishes loading
      savedMessage: ''
    }
  },
  async mounted() {
    await this.loadProfile()
    this.theme = localStorage.getItem('spojedy-theme') || 'light' //read saved theme on load
  },
  beforeUnmount() {
    //free the blob url from memory when leaving the page
    if (this.profileImage && this.profileImage.startsWith('blob:')) {
      URL.revokeObjectURL(this.profileImage)
    }
  },
  methods: {
    async loadProfile() {
      //username is plain text so it comes from localStorage
      const raw = localStorage.getItem('spojedy-profile')
      if (raw) {
        try {
          const data = JSON.parse(raw)
          this.username = data.username || 'user123'
        } catch (e) {
          // noop
        }
      }
      //avatar is binary so it comes from IndexedDB, then converted to a displayable url
      try {
        const blob = await loadBlob('avatar')
        if (blob) {
          this.profileImage = URL.createObjectURL(blob)
        }
      } catch (e) {
        console.warn('Failed to load profile image from IndexedDB', e)
      }
    },
    saveProfile() {
      //only save username here, the avatar blob is handled separately in applyBlob
      localStorage.setItem('spojedy-profile', JSON.stringify({ username: this.username }))
      window.dispatchEvent(new Event('spojedy-profile-updated')) //tell NavBar to refresh the avatar
      this.savedMessage = 'Profile saved!'
      setTimeout(() => { this.savedMessage = '' }, 2000) //hide message after 2 seconds
    },
    onFileChange(e) {
      const file = e.target.files && e.target.files[0]
      if (!file) return
      this.uploading = true
      this.uploadProgress = 0
      this.imgReady = false

      //read the file as a data url — progress fills the first 50%
      const reader = new FileReader()
      reader.onprogress = (ev) => {
        if (ev.lengthComputable) {
          this.uploadProgress = Math.round((ev.loaded / ev.total) * 50)
        }
      }
      reader.onload = (ev) => {
        this.compressImage(ev.target.result) //once read, compress it
      }
      reader.readAsDataURL(file)
    },
    compressImage(dataUrl) {
      //draw the image on a canvas, resize it to max 512px, then export as jpeg
      const img = new Image()
      img.onload = () => {
        const MAX = 512
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) {
            height = (height * MAX) / width
            width = MAX
          } else {
            width = (width * MAX) / height
            height = MAX
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        //first try quality 0.85, if still over 1mb then re-encode at 0.6
        canvas.toBlob((blob) => {
          if (!blob) {
            this.uploading = false
            return
          }
          if (blob.size > 1024 * 1024) {
            canvas.toBlob((smaller) => {
              this.applyBlob(smaller)
            }, 'image/jpeg', 0.6)
          } else {
            this.applyBlob(blob)
          }
        }, 'image/jpeg', 0.85)
      }
      img.src = dataUrl
    },
    async applyBlob(blob) {
      if (!blob) {
        this.uploading = false
        return
      }
      //save the compressed blob to IndexedDB
      try {
        await saveBlob('avatar', blob)
      } catch (e) {
        console.error('Failed to save avatar blob', e)
      }
      //free old blob url before creating a new one
      if (this.profileImage && this.profileImage.startsWith('blob:')) {
        URL.revokeObjectURL(this.profileImage)
      }
      this.uploadProgress = 100
      this.profileImage = URL.createObjectURL(blob) //display the new image
      localStorage.setItem('spojedy-profile', JSON.stringify({ username: this.username }))
      window.dispatchEvent(new Event('spojedy-profile-updated'))
      setTimeout(() => {
        this.uploading = false
        this.uploadProgress = 0
      }, 500)
    },
    setTheme(t) {
      this.theme = t
      //toggle the 'dark' class on <html> — tailwind uses this to switch themes
      if (t === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('spojedy-theme', t) //remember the choice across refreshes
    }
  }
}
</script>
