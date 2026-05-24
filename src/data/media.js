const VIDEO_BASE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample'

const COVERS = {
  whereIsMyHusband: 'https://upload.wikimedia.org/wikipedia/en/0/09/Where_Is_My_Husband%21_-_Raye.png',
  howIGet: 'https://i.scdn.co/image/ab67616d0000b273fd23708303dca437cde66dd7',
  sprinter: 'https://upload.wikimedia.org/wikipedia/en/a/a0/Dave_and_Central_Cee_-_Sprinter.png',
  stateside: 'https://upload.wikimedia.org/wikipedia/en/1/18/Pinkpatheress_-_Stateside_Single_Artwork.jpeg',
  tickingAway: 'https://i.scdn.co/image/ab67616d0000b2735eb2199eddeefec51dd17a0a',
  toughLuck: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Laufey_-_A_Matter_of_Time.png'
}

const PREVIEWS = {
  whereIsMyHusband: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fc/f5/24/fcf52459-e6a3-c728-c472-58766d300ef7/mzaf_12031297918382153127.plus.aac.p.m4a',
  howIGet: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/16/b9/ae/16b9aeed-cf5e-4f55-ea1f-6ae64ca39647/mzaf_694859355810114488.plus.aac.p.m4a',
  sprinter: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7f/9f/7a/7f9f7a15-196f-ce1d-d57c-af458fd06f83/mzaf_9769049475249158797.plus.aac.p.m4a',
  stateside: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bc/6a/bc/bc6abce9-98f0-2b5d-fae2-cc10a0cdf151/mzaf_6218412372941676800.plus.aac.p.m4a',
  tickingAway: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/68/f0/2c/68f02ca9-84ba-a394-c80d-f7547b3c68e2/mzaf_8491102432953803025.plus.aac.p.m4a',
  toughLuck: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4e/2a/7e/4e2a7e7f-0e3b-b55e-33da-c22adb9f7130/mzaf_3763930629220642001.plus.aac.p.m4a'
}

const YOUTUBE = {
  whereIsMyHusband: 'rK5TyISxZ_M',
  howIGet: 'ZtRNT-JYg1w',
  sprinter: 'pSY3i5XHHXo',
  stateside: 'lIxQe1R5hs0',
  tickingAway: 'CdZN8PI3MqM',
  toughLuck: '9q71ywEqJjA'
}

export const songs = [
  {
    id: 1,
    title: 'Where Is My Husband!',
    artist: 'RAYE',
    genre: 'R&B / Pop',
    cover: COVERS.whereIsMyHusband,
    audio: PREVIEWS.whereIsMyHusband,
    youtubeId: YOUTUBE.whereIsMyHusband,
    spotifyId: '55lijDD6OAjLFFUHU9tcDm',
    duration: '3:42',
    musicVideoId: 1,
    category: 'repeat'
  },
  {
    id: 2,
    title: 'How I Get',
    artist: 'Laufey',
    genre: 'Jazz Pop',
    cover: COVERS.howIGet,
    audio: PREVIEWS.howIGet,
    youtubeId: YOUTUBE.howIGet,
    spotifyId: '1gjrb6iiP6KIrQnDBIqqDi',
    duration: '4:10',
    musicVideoId: 2,
    category: 'repeat'
  },
  {
    id: 3,
    title: 'Sprinter',
    artist: 'Dave & Central Cee',
    genre: 'UK Hip-Hop',
    cover: COVERS.sprinter,
    audio: PREVIEWS.sprinter,
    youtubeId: YOUTUBE.sprinter,
    spotifyId: '2FDTHlrBguDzQkp7PVj16Q',
    duration: '3:48',
    musicVideoId: 3,
    category: 'repeat'
  },
  {
    id: 4,
    title: 'Stateside (Remix)',
    artist: 'PinkPantheress & Zara Larsson',
    genre: 'Bedroom Pop',
    cover: COVERS.stateside,
    audio: PREVIEWS.stateside,
    youtubeId: YOUTUBE.stateside,
    spotifyId: '1DwscornXpj8fmOmYVlqZt',
    duration: '2:18',
    musicVideoId: 4,
    category: 'repeat'
  },
  {
    id: 5,
    title: 'Ticking Away',
    artist: 'Grabbitz, Forts & Riot Music Team',
    genre: 'Electronic / Soundtrack',
    cover: COVERS.tickingAway,
    audio: PREVIEWS.tickingAway,
    youtubeId: YOUTUBE.tickingAway,
    spotifyId: '7cmFEZ81b4S2u6MIHiCIba',
    duration: '3:21',
    musicVideoId: 5,
    category: 'pop'
  },
  {
    id: 6,
    title: 'Tough Luck',
    artist: 'Laufey',
    genre: 'Jazz Pop',
    cover: COVERS.toughLuck,
    audio: PREVIEWS.toughLuck,
    youtubeId: YOUTUBE.toughLuck,
    spotifyId: '7DUX29TUEAE39Ph0QlRFME',
    duration: '2:54',
    musicVideoId: 6,
    category: 'pop'
  }
]

export const musicVideos = [
  {
    id: 1,
    title: 'Where Is My Husband! - MV',
    artist: 'RAYE',
    genre: 'R&B / Pop',
    thumbnail: COVERS.whereIsMyHusband,
    youtubeId: YOUTUBE.whereIsMyHusband,
    video: `${VIDEO_BASE}/BigBuckBunny.mp4`,
    duration: '4:01',
    songId: 1,
    category: 'repeat'
  },
  {
    id: 2,
    title: 'How I Get - MV',
    artist: 'Laufey',
    genre: 'Jazz Pop',
    thumbnail: COVERS.howIGet,
    youtubeId: YOUTUBE.howIGet,
    video: `${VIDEO_BASE}/ElephantsDream.mp4`,
    duration: '4:22',
    songId: 2,
    category: 'repeat'
  },
  {
    id: 3,
    title: 'Sprinter - MV',
    artist: 'Dave & Central Cee',
    genre: 'UK Hip-Hop',
    thumbnail: COVERS.sprinter,
    youtubeId: YOUTUBE.sprinter,
    video: `${VIDEO_BASE}/ForBiggerBlazes.mp4`,
    duration: '4:08',
    songId: 3,
    category: 'repeat'
  },
  {
    id: 4,
    title: 'Stateside (Remix) - MV',
    artist: 'PinkPantheress & Zara Larsson',
    genre: 'Bedroom Pop',
    thumbnail: COVERS.stateside,
    youtubeId: YOUTUBE.stateside,
    video: `${VIDEO_BASE}/ForBiggerEscapes.mp4`,
    duration: '2:30',
    songId: 4,
    category: 'repeat'
  },
  {
    id: 5,
    title: 'Ticking Away - MV',
    artist: 'Grabbitz, Forts & Riot Music Team',
    genre: 'Electronic / Soundtrack',
    thumbnail: COVERS.tickingAway,
    youtubeId: YOUTUBE.tickingAway,
    video: `${VIDEO_BASE}/ForBiggerFun.mp4`,
    duration: '3:35',
    songId: 5,
    category: 'pop'
  },
  {
    id: 6,
    title: 'Tough Luck - MV',
    artist: 'Laufey',
    genre: 'Jazz Pop',
    thumbnail: COVERS.toughLuck,
    youtubeId: YOUTUBE.toughLuck,
    video: `${VIDEO_BASE}/ForBiggerJoyrides.mp4`,
    duration: '3:05',
    songId: 6,
    category: 'pop'
  }
]

export function findSong(id) {
  return songs.find(s => s.id === Number(id))
}

export function findMusicVideo(id) {
  return musicVideos.find(v => v.id === Number(id))
}
