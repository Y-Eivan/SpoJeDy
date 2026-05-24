let loadPromise = null

export function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const existing = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof existing === 'function') existing()
      resolve(window.YT)
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.async = true
    tag.onerror = () => reject(new Error('Failed to load YouTube IFrame API'))
    document.head.appendChild(tag)
  })

  return loadPromise
}
