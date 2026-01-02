// Soundtrack service for managing music data and playlist integration
import API_BASE from '../config.js';

class SoundtrackService {
  constructor() {
    this.soundtracks = []
    this.playlists = []
    this.loaded = false
  }

  // Load soundtrack data from backend API
  async loadSoundtracks() {
    try {
      console.log('🎵 Fetching soundtracks from:', `${API_BASE}/api/soundtracks`)
      // Fetch soundtracks from backend API
      const response = await fetch(`${API_BASE}/api/soundtracks`);
      console.log('🎵 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('🎵 API response data:', data)
      console.log('🎵 Loaded soundtracks from API:', data.soundtracks?.length || 0)
      
      if (!data.soundtracks || data.soundtracks.length === 0) {
        console.warn('⚠️ No soundtracks returned from API, using fallback data')
        const fallback = this.getFallbackData()
        this.soundtracks = fallback
        this.loaded = true
        return fallback
      }
      
      // Transform the data to match our component's format
      this.soundtracks = data.soundtracks.map(song => ({
        id: song.song_id,
        title: song.song_title,
        mood: song.mood_tag,
        playlist: song.playlist_tag,
        lyrics: song.lyrics_snippet,
        featured: song.featured,
        featuredOrder: song.featured_order || 0,
        fileUrl: song.file_url
      }))
      
      console.log('🎵 Transformed soundtracks:', this.soundtracks.length)
      
      // Load playlists from API
      await this.loadPlaylists()
      
      this.loaded = true
      return this.soundtracks
    } catch (error) {
      console.error('❌ Error loading soundtracks from API:', error)
      console.error('❌ Error details:', error.message, error.stack)
      // Fallback to minimal data if API fails
      const fallback = this.getFallbackData()
      this.soundtracks = fallback
      this.loaded = true
      return fallback
    }
  }
  
  // Load playlists from backend API
  async loadPlaylists() {
    try {
      console.log('🎵 Fetching playlists from:', `${API_BASE}/api/soundtracks/playlists`)
      const response = await fetch(`${API_BASE}/api/soundtracks/playlists`);
      console.log('🎵 Playlists response status:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🎵 Playlists API response data:', data)
      this.playlists = [];

      // Normalize: split comma-separated items and trim
      if (data.playlists && Array.isArray(data.playlists)) {
        data.playlists.forEach(item => {
          if (item) {
            item.split(',').map(p => p.trim()).forEach(playlist => {
              if (playlist && !this.playlists.includes(playlist)) {
                this.playlists.push(playlist);
              }
            });
          }
        });
      }

      console.log('🎵 Extracted playlists:', this.playlists)

    } catch (error) {
      console.error('❌ Error loading playlists from API:', error);
      console.error('❌ Error details:', error.message, error.stack)

      // Fallback: extract from soundtracks
      this.playlists = ['All Songs'];
      if (this.soundtracks && this.soundtracks.length > 0) {
        this.soundtracks.forEach(song => {
          if (song.playlist) {
            const songPlaylists = song.playlist.split(',').map(p => p.trim());
            songPlaylists.forEach(playlist => {
              if (playlist && !this.playlists.includes(playlist)) {
                this.playlists.push(playlist);
              }
            });
          }
        });
      }
      console.log('🎵 Fallback playlists:', this.playlists)
    }

    // ✅ Keep "All Songs" at the top, sort the rest alphabetically
    const hasAllSongs = this.playlists.includes('All Songs');
    const sorted = this.playlists.filter(p => p !== 'All Songs').sort((a, b) => a.localeCompare(b));
    this.playlists = hasAllSongs ? ['All Songs', ...sorted] : sorted;
    console.log('🎵 Final playlists:', this.playlists)
  }

  
  // Fallback data if CSV loading fails
  getFallbackData() {
    return [
      {
        id: "STR_01",
        title: "Spark Still Rise (Male Rap)",
        mood: "bitter, believing",
        playlist: "Spiral, Believe, Lowkey",
        lyrics: "You ain't gotta fake the fire. Even sparks can light the sky.",
        featured: true,
        featuredOrder: 1,
        fileUrl: "https://myworld-soundtrack.s3.us-east-2.amazonaws.com/myworld_soundtrack/sparks-still-rise.mp3"
      }
    ]
  }

  // Get all soundtracks
  getSoundtracks() {
    return this.soundtracks
  }

  // Get all playlists
  getPlaylists() {
    return this.playlists
  }

  // Get songs by playlist
  getSongsByPlaylist(playlist) {
    if (playlist === 'All Songs') {
      return this.soundtracks
    }
    return this.soundtracks.filter(song => 
      song.playlist.includes(playlist)
    )
  }

  // Get songs by mood
  getSongsByMood(mood) {
    return this.soundtracks.filter(song => 
      song.mood.toLowerCase().includes(mood.toLowerCase())
    )
  }

  // Get featured songs
  getFeaturedSongs() {
    return this.soundtracks
      .filter(song => song.featured)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
  }

  // Get song by ID
  getSongById(id) {
    return this.soundtracks.find(song => song.id === id)
  }

  // Search songs by text
  searchSongs(query) {
    const lowerQuery = query.toLowerCase()
    return this.soundtracks.filter(song => 
      song.title.toLowerCase().includes(lowerQuery) ||
      song.lyrics.toLowerCase().includes(lowerQuery) ||
      song.mood.toLowerCase().includes(lowerQuery) ||
      song.playlist.toLowerCase().includes(lowerQuery)
    )
  }

  // Get smart song recommendation based on question text and block code
  getSmartSongRecommendation(questionText, _blockCode) {
    if (!this.soundtracks.length) return null
    
    // Simple recommendation logic - can be enhanced later
    const _questionLower = questionText.toLowerCase()
    
    // Look for mood matches
    const moodMatches = this.soundtracks.filter(song => 
      song.mood && song.mood.toLowerCase().includes('believing') ||
      song.mood && song.mood.toLowerCase().includes('inspiring')
    )
    
    if (moodMatches.length > 0) {
      // Return a random mood-matching song
      return moodMatches[Math.floor(Math.random() * moodMatches.length)]
    }
    
    // Fallback to a random featured song
    const featuredSongs = this.getFeaturedSongs()
    if (featuredSongs.length > 0) {
      return featuredSongs[0]
    }
    
    // Last resort - return first available song
    return this.soundtracks[0]
  }
}

export default SoundtrackService
