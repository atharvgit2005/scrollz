import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Song } from '../../types/Song';
import { api } from '../../services/api';
import styles from './PlayerView.module.css';

function PlayerView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const audioRef = useRef<HTMLAudioElement>(null);
    const lyricsContainerRef = useRef<HTMLDivElement>(null);

    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeLyricIndex, setActiveLyricIndex] = useState<number>(-1);

    useEffect(() => {
        if (id) {
            loadSong(id);
        }
    }, [id]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !song) return;

        const handleTimeUpdate = () => {
            const currentTime = audio.currentTime;

            // Find the active lyric based on current time
            const activeIndex = song.lyrics.findIndex((lyric, i) => {
                const nextLyric = song.lyrics[i + 1];
                return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
            });

            if (activeIndex !== activeLyricIndex) {
                setActiveLyricIndex(activeIndex);
                scrollToActiveLyric(activeIndex);
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [song, activeLyricIndex]);

    const loadSong = async (songId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.fetchSongById(songId);
            setSong(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load song');
            console.error('Error loading song:', err);
        } finally {
            setLoading(false);
        }
    };

    const scrollToActiveLyric = (index: number) => {
        if (index < 0 || !lyricsContainerRef.current) return;

        const activeLyricElement = lyricsContainerRef.current.querySelector(
            `[data-lyric-index="${index}"]`
        ) as HTMLElement;

        if (activeLyricElement) {
            activeLyricElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className="spinner"></div>
                    <p>Loading song...</p>
                </div>
            </div>
        );
    }

    if (error || !song) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>⚠️ Error</h2>
                    <p>{error || 'Song not found'}</p>
                    <button onClick={() => navigate('/')} className={styles.backButton}>
                        ← Back to Feed
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <button onClick={() => navigate('/')} className={styles.backButton}>
                ← Back to Feed
            </button>

            <div className={styles.player}>
                <div className={styles.coverSection}>
                    <img src={song.coverArtUrl} alt={`${song.title} cover`} className={styles.coverArt} />
                    <div className={styles.songInfo}>
                        <h1 className={styles.title}>{song.title}</h1>
                        <p className={styles.artist}>{song.artist}</p>
                    </div>
                </div>

                <div className={styles.audioSection}>
                    <audio
                        ref={audioRef}
                        src={song.audioUrl}
                        controls
                        className={styles.audioPlayer}
                    >
                        Your browser does not support the audio element.
                    </audio>
                </div>

                <div className={styles.lyricsSection}>
                    <h2 className={styles.lyricsTitle}>Lyrics</h2>
                    <div ref={lyricsContainerRef} className={styles.lyricsContainer}>
                        {song.lyrics.length === 0 ? (
                            <p className={styles.noLyrics}>No lyrics available for this song.</p>
                        ) : (
                            song.lyrics.map((lyric, index) => (
                                <div
                                    key={index}
                                    data-lyric-index={index}
                                    className={`${styles.lyricLine} ${index === activeLyricIndex ? styles.active : ''
                                        }`}
                                >
                                    {lyric.text}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerView;
