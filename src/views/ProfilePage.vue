<template>
  <div class="max-w-3xl mx-auto px-6 py-6">
    <h1 class="text-2xl font-bold mb-4">Profile</h1>

    <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 flex flex-col items-center">
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

    <div v-if="uploadProgress > 0 || uploading" class="mt-2 flex items-center gap-3">
      <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
        <div class="h-full bg-brand transition-all" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <span class="text-sm text-brand w-12 text-right">{{ uploadProgress }}%</span>
    </div>

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
      <transition name="fade">
        <p v-if="savedMessage" class="mt-2 text-sm text-green-600 dark:text-green-400">{{ savedMessage }}</p>
      </transition>
    </div>

    <div class="mt-8">
      <h2 class="text-lg font-semibold mb-3">Theme Preference</h2>
      <div class="grid grid-cols-2 gap-3">
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
      profileImage: '',
      theme: 'light',
      uploading: false,
      uploadProgress: 0,
      imgReady: false,
      savedMessage: ''
    }
  },
  async mounted() {
    await this.loadProfile()
    this.theme = localStorage.getItem('spojedy-theme') || 'light'
  },
  beforeUnmount() {
    // Free the object URL we created so it doesn't leak memory.
    if (this.profileImage && this.profileImage.startsWith('blob:')) {
      URL.revokeObjectURL(this.profileImage)
    }
  },
  methods: {
    async loadProfile() {
      // Username is a plain string — fine for localStorage.
      const raw = localStorage.getItem('spojedy-profile')
      if (raw) {
        try {
          const data = JSON.parse(raw)
          this.username = data.username || 'user123'
        } catch (e) {
          // noop
        }
      }
      // Profile image is a Blob — load from IndexedDB and expose as object URL.
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
      // Only the username goes to localStorage; the Blob lives in IndexedDB.
      localStorage.setItem('spojedy-profile', JSON.stringify({ username: this.username }))
      window.dispatchEvent(new Event('spojedy-profile-updated'))
      this.savedMessage = 'Profile saved!'
      setTimeout(() => { this.savedMessage = '' }, 2000)
    },
    onFileChange(e) {
      const file = e.target.files && e.target.files[0]
      if (!file) return
      this.uploading = true
      this.uploadProgress = 0
      this.imgReady = false

      // First half of progress: reading the source file.
      const reader = new FileReader()
      reader.onprogress = (ev) => {
        if (ev.lengthComputable) {
          this.uploadProgress = Math.round((ev.loaded / ev.total) * 50)
        }
      }
      reader.onload = (ev) => {
        this.compressImage(ev.target.result)
      }
      reader.readAsDataURL(file)
    },
    compressImage(dataUrl) {
      // Resize via canvas, then export as a JPEG Blob under 1 MB.
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

        // First pass at 0.85 quality; if still over 1 MB, re-encode at 0.6.
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
      // Persist the actual Blob to IndexedDB — this is the "stored as blob" part.
      try {
        await saveBlob('avatar', blob)
      } catch (e) {
        console.error('Failed to save avatar blob', e)
      }
      // Release the previous object URL before swapping in a new one.
      if (this.profileImage && this.profileImage.startsWith('blob:')) {
        URL.revokeObjectURL(this.profileImage)
      }
      // Second half of progress: applying the result.
      this.uploadProgress = 100
      this.profileImage = URL.createObjectURL(blob)
      // Persist username alongside; tell other components to reload the avatar.
      localStorage.setItem('spojedy-profile', JSON.stringify({ username: this.username }))
      window.dispatchEvent(new Event('spojedy-profile-updated'))
      setTimeout(() => {
        this.uploading = false
        this.uploadProgress = 0
      }, 500)
    },
    setTheme(t) {
      this.theme = t
      if (t === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('spojedy-theme', t)
    }
  }
}
</script>
