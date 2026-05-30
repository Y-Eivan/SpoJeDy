//Variables for songs
const COVERS = {
  whereIsMyHusband: 'https://ik.imagekit.io/yeivanr/imagescobaslt/raye.jpg',
  howIGet: 'https://ik.imagekit.io/yeivanr/imagescobaslt/howiget.jpg',
  sprinter: 'https://ik.imagekit.io/yeivanr/imagescobaslt/cenralcee.png',
  stateside: 'https://ik.imagekit.io/yeivanr/imagescobaslt/stateside%20pink.jpg',
  tickingAway: 'https://ik.imagekit.io/yeivanr/imagescobaslt/tickingaway.jpg',
  toughLuck: 'https://ik.imagekit.io/yeivanr/imagescobaslt/toughluck.jpg'
}

const AUDIO = {
  whereIsMyHusband: 'https://ik.imagekit.io/yeivanr/cobalt/RAYE%20-%20WHERE%20IS%20MY%20HUSBAND!%20(Official%20Music%20Video)%20-%20RAYE.mp3',
  howIGet: 'https://ik.imagekit.io/yeivanr/cobalt/Laufey%20-%20How%20I%20Get%20(Official%20Lyric%20Video%20With%20Chords)%20-%20Laufey.mp3',
  sprinter: 'https://ik.imagekit.io/yeivanr/cobalt/Central%20Cee%20x%20Dave%20-%20Sprinter%20_Music%20Video_.mp3',
  stateside: 'https://ik.imagekit.io/yeivanr/cobalt/PinkPantheress%20-%20Stateside%20Zara%20Larsson%20(Official%20Video).mp3',
  tickingAway: 'https://ik.imagekit.io/yeivanr/cobalt/Ticking%20Away%20ft.%20Grabbitz%20&%20bbno$%20(Official%20Music%20Video)%20VALORANT%20Champions%202023%20Anthem.mp3',
  toughLuck: 'https://ik.imagekit.io/yeivanr/cobalt/Laufey%20-%20Tough%20Luck%20(Official%20Lyric%20Video%20with%20Chords).mp3'
}

const VIDEO = {
  whereIsMyHusband: 'https://ik.imagekit.io/yeivanr/cobalt/RAYE%20-%20WHERE%20IS%20MY%20HUSBAND!%20(Official%20Music%20Video)%20-%20RAYE%20(360p,%20h264).mp4',
  howIGet: 'https://ik.imagekit.io/yeivanr/cobalt/Laufey%20-%20How%20I%20Get%20(Official%20Lyric%20Video%20With%20Chords)%20-%20Laufey%20(360p,%20h264).mp4',
  sprinter: 'https://ik.imagekit.io/yeivanr/cobalt/Central%20Cee%20x%20Dave%20-%20Sprinter%20_Music%20Video_.mp4',
  stateside: 'https://ik.imagekit.io/yeivanr/cobalt/PinkPantheress%20-%20Stateside%20Zara%20Larsson%20(Official%20Video).mp4',
  tickingAway: 'https://ik.imagekit.io/yeivanr/cobalt/Ticking%20Away%20ft.%20Grabbitz%20&%20bbno$%20(Official%20Music%20Video)%20VALORANT%20Champions%202023%20Anthem.mp4',
  toughLuck: 'https://ik.imagekit.io/yeivanr/cobalt/Laufey%20-%20Tough%20Luck%20(Official%20Lyric%20Video%20with%20Chords).mp4'
}

//Songs
export const songs = [
  {
    id: 1,
    title: 'Where Is My Husband!',
    artist: 'RAYE',
    genre: 'R&B / Pop',
    cover: COVERS.whereIsMyHusband,
    audioUrl: AUDIO.whereIsMyHusband,
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
    audioUrl: AUDIO.howIGet,
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
    audioUrl: AUDIO.sprinter,
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
    audioUrl: AUDIO.stateside,
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
    audioUrl: AUDIO.tickingAway,
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
    audioUrl: AUDIO.toughLuck,
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
    videoUrl: VIDEO.whereIsMyHusband,
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
    videoUrl: VIDEO.howIGet,
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
    videoUrl: VIDEO.sprinter,
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
    videoUrl: VIDEO.stateside,
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
    videoUrl: VIDEO.tickingAway,
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
    videoUrl: VIDEO.toughLuck,
    duration: '3:05',
    songId: 6,
    category: 'pop'
  }
]


//look up a song/mv from the array with ID
//id arrives as strings, so convert string -> int and then finds object with the int id)
//returns the song with its attributes (title, artist, genre, etc..)
export function findSong(id) {
  return songs.find(s => s.id === Number(id))
  
}

export function findMusicVideo(id) {
  return musicVideos.find(v => v.id === Number(id))
}
