import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SongDetailPage from '../views/SongDetailPage.vue'
import MusicVideoPage from '../views/MusicVideoPage.vue'
import MusicVideoDetailPage from '../views/MusicVideoDetailPage.vue'
import ProfilePage from '../views/ProfilePage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/song/:id', name: 'song-detail', component: SongDetailPage, props: true },
  //props: true -> allows router to pass the URL params as props to the component
  //like a parent passing data down
  //so the component doesn't need to reach into the router to get the params
  { path: '/music-videos', name: 'music-videos', component: MusicVideoPage },
  { path: '/music-video/:id', name: 'mv-detail', component: MusicVideoDetailPage, props: true },
  { path: '/profile', name: 'profile', component: ProfilePage }
]

const router = createRouter({
  history: createWebHistory(), 
  //tells vue router to use real URLs, not hash-based
  routes,
  //passes the routes array above
  scrollBehavior() {
    return { top: 0 } 
    //browser scroll back to the top when navigaating to a new page
  }
})

export default router
