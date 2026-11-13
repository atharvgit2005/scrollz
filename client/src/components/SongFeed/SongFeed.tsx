import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Song } from '../../types/Song';
import { api } from '../../services/api';
import SongCard from '../SongCard/SongCard';
import styles from './SongFeed.module.css';

function SongFeed() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadSongs();
    }, []);

    const loadSongs = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.fetchSongs();
            setSongs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load songs');
            console.error('Error loading songs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSongClick = (songId: string) => {
        navigate(`/player/${songId}`);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className="spinner"></div>
                    <p>Loading songs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button onClick={loadSongs} className={styles.retryButton}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (songs.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.empty}>
                    <h2>🎵 No Songs Yet</h2>
                    <p>Be the first to add a song!</p>
                    <button onClick={() => navigate('/admin')} className={styles.uploadButton}>
                        Upload a Song
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Your Music Feed</h2>
                <p className={styles.subtitle}>{songs.length} song{songs.length !== 1 ? 's' : ''} available</p>
            </div>

            <div className={styles.grid}>
                {songs.map((song) => (
                    <SongCard
                        key={song._id}
                        song={song}
                        onClick={() => handleSongClick(song._id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default SongFeed;
