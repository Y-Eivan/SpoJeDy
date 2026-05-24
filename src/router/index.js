import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SongDetailPage from '../views/SongDetailPage.vue'
import MusicVideoPage from '../views/MusicVideoPage.vue'
import MusicVideoDetailPage from '../views/MusicVideoDetailPage.vue'
import ProfilePage from '../views/ProfilePage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/song/:id', name: 'song-detail', component: SongDetailPage, props: true },
  { path: '/music-videos', name: 'music-videos', component: MusicVideoPage },
  { path: '/music-video/:id', name: 'mv-detail', component: MusicVideoDetailPage, props: true },
  { path: '/profile', name: 'profile', component: ProfilePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
