// ============================
// Modern Music Player Script
// ============================

// Sample Playlist Data
const playlist = [
    {
        id: 1,
        title: "jo tere sang",
        artist: "Mustafa Zahid",
        src: "jo Tere Sang Blood Money 128 Kbps.mp3",
        duration: "05:06",
    },
    {
        id: 2,
        title: "bairan",
        artist: "Banjaare",
        src: "stream.mp3",
        duration: "02:30",
        albumArt: "https://via.placeholder.com/180?text=Neon+Dreams"
    },
];

// Player State
let currentTrackIndex = 0;
let isPlaying = false;
let repeatMode = 'off'; // off, one, all
let isShuffle = false;
let shuffledIndices = [];

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const repeatBtn = document.getElementById('repeatBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const albumArt = document.getElementById('albumArt');
const playlistToggle = document.getElementById('playlistToggle');
const playlistSidebar = document.getElementById('playlistSidebar');
const playlistContainer = document.getElementById('playlistContainer');
const overlay = document.getElementById('overlay');
const closePlaylist = document.getElementById('closePlaylist');
const playingIndicator = document.getElementById('playingIndicator');

// Initialize Player
function init() {
    loadPlaylist();
    loadTrack(currentTrackIndex);
    setupEventListeners();
    createShuffledIndices();
}

// Load Playlist
function loadPlaylist() {
    playlistContainer.innerHTML = '';
    playlist.forEach((song, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;
        playlistItem.innerHTML = `
            <div class="playlist-item-title">${song.title}</div>
            <div class="playlist-item-artist">${song.artist}</div>
        `;
        playlistItem.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            play();
            closePlaylistMenu();
        });
        playlistContainer.appendChild(playlistItem);
    });
}

// Load Track
function loadTrack(index) {
    const track = playlist[index];
    audioPlayer.src = track.src;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    albumArt.src = track.albumArt;
    updatePlaylistUI();
    updatePlayBtn();
}

// Update Playlist UI
function updatePlaylistUI() {
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentTrackIndex);
    });
}

// Play Track
function play() {
    audioPlayer.play();
    isPlaying = true;
    updatePlayBtn();
    playingIndicator.style.display = 'flex';
}

// Pause Track
function pause() {
    audioPlayer.pause();
    isPlaying = false;
    updatePlayBtn();
    playingIndicator.style.display = 'none';
}

// Toggle Play/Pause
function togglePlayPause() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

// Update Play Button Icon
function updatePlayBtn() {
    playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

// Next Track
function nextTrack() {
    if (isShuffle) {
        currentTrackIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    }
    loadTrack(currentTrackIndex);
    play();
}

// Previous Track
function prevTrack() {
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
    } else {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
    }
    play();
}

// Toggle Repeat Mode
function toggleRepeat() {
    const modes = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    repeatMode = modes[(currentIndex + 1) % modes.length];
    
    const repeatIcon = repeatBtn.querySelector('i');
    if (repeatMode === 'off') {
        repeatBtn.classList.remove('active');
        repeatIcon.classList.remove('fa-redo-alt');
        repeatIcon.classList.add('fa-redo');
    } else if (repeatMode === 'one') {
        repeatBtn.classList.add('active');
        repeatIcon.classList.add('fa-redo-alt');
        repeatIcon.innerHTML = '<i class="fas fa-redo"></i><span style="position: absolute; font-size: 8px;">1</span>';
    } else {
        repeatBtn.classList.add('active');
        repeatIcon.classList.remove('fa-redo-alt');
        repeatIcon.classList.add('fa-redo');
    }
}

// Toggle Shuffle
function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active');
    createShuffledIndices();
}

// Create Shuffled Indices
function createShuffledIndices() {
    shuffledIndices = [...Array(playlist.length).keys()];
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
}

// Format Time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update Progress Bar
function updateProgress() {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = percent + '%';
        progressHandle.style.left = percent + '%';
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        durationEl.textContent = formatTime(audioPlayer.duration);
    }
}

// Seek Track
function seekTrack(e) {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

// Handle Track End (Auto-play)
function handleTrackEnd() {
    if (repeatMode === 'one') {
        audioPlayer.currentTime = 0;
        play();
    } else if (repeatMode === 'all' || currentTrackIndex < playlist.length - 1) {
        nextTrack();
    } else {
        pause();
    }
}

// Toggle Playlist Menu
function togglePlaylistMenu() {
    playlistSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Close Playlist Menu
function closePlaylistMenu() {
    playlistSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Volume Control
function setVolume(value) {
    audioPlayer.volume = value / 100;
}

// Setup Event Listeners
function setupEventListeners() {
    // Play/Pause
    playBtn.addEventListener('click', togglePlayPause);

    // Next/Previous
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);

    // Repeat/Shuffle
    repeatBtn.addEventListener('click', toggleRepeat);
    shuffleBtn.addEventListener('click', toggleShuffle);

    // Progress Bar
    progressBar.addEventListener('click', seekTrack);
    
    // Drag Progress Handle
    let isDragging = false;
    progressHandle.addEventListener('mousedown', () => {
        isDragging = true;
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const rect = progressBar.getBoundingClientRect();
            let percent = (e.clientX - rect.left) / rect.width;
            percent = Math.max(0, Math.min(1, percent));
            audioPlayer.currentTime = percent * audioPlayer.duration;
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Volume Control
    volumeSlider.addEventListener('input', (e) => {
        setVolume(e.target.value);
    });

    // Audio Events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', handleTrackEnd);
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audioPlayer.duration);
    });

    // Playlist Toggle
    playlistToggle.addEventListener('click', togglePlaylistMenu);
    closePlaylist.addEventListener('click', closePlaylistMenu);
    overlay.addEventListener('click', closePlaylistMenu);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        } else if (e.code === 'ArrowRight') {
            nextTrack();
        } else if (e.code === 'ArrowLeft') {
            prevTrack();
        }
    });
}

// Initialize on Load
window.addEventListener('load', init);
