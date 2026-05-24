const COVERS = {
  whereIsMyHusband: 'https://upload.wikimedia.org/wikipedia/en/0/09/Where_Is_My_Husband%21_-_Raye.png',
  howIGet: 'https://i.scdn.co/image/ab67616d0000b273fd23708303dca437cde66dd7',
  sprinter: 'https://upload.wikimedia.org/wikipedia/en/a/a0/Dave_and_Central_Cee_-_Sprinter.png',
  stateside: 'https://upload.wikimedia.org/wikipedia/en/1/18/Pinkpatheress_-_Stateside_Single_Artwork.jpeg',
  tickingAway: 'https://i.scdn.co/image/ab67616d0000b2735eb2199eddeefec51dd17a0a',
  toughLuck: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Laufey_-_A_Matter_of_Time.png'
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
    youtubeId: YOUTUBE.whereIsMyHusband,
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
    youtubeId: YOUTUBE.howIGet,
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
    youtubeId: YOUTUBE.sprinter,
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
    youtubeId: YOUTUBE.stateside,
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
    youtubeId: YOUTUBE.tickingAway,
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
    youtubeId: YOUTUBE.toughLuck,
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
