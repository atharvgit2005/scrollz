import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateSongData, Lyric } from '../../types/Song';
import { api } from '../../services/api';
import styles from './UploadForm.module.css';

function UploadForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        audioUrl: '',
        coverArtUrl: '',
        lyricsInput: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const parseLRC = (lrcText: string): Lyric[] => {
        const lines = lrcText.trim().split('\n');
        const lyrics: Lyric[] = [];

        lines.forEach((line) => {
            // Match LRC format: [mm:ss.xx] text or [mm:ss] text
            const match = line.match(/\[(\d{1,2}):(\d{2})(?:\.(\d{2}))?\]\s*(.+)/);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseInt(match[2]);
                const centiseconds = match[3] ? parseInt(match[3]) : 0;
                const time = minutes * 60 + seconds + centiseconds / 100;
                const text = match[4].trim();

                if (text) {
                    lyrics.push({ time, text });
                }
            }
        });

        return lyrics.sort((a, b) => a.time - b.time);
    };

    const parseJSON = (jsonText: string): Lyric[] => {
        try {
            const parsed = JSON.parse(jsonText);
            if (Array.isArray(parsed)) {
                return parsed.filter(
                    (item) => typeof item.time === 'number' && typeof item.text === 'string'
                );
            }
        } catch (e) {
            console.error('Failed to parse JSON:', e);
        }
        return [];
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validate required fields
        if (!formData.title || !formData.artist || !formData.audioUrl) {
            setError('Title, Artist, and Audio URL are required fields');
            return;
        }

        setLoading(true);

        try {
            // Parse lyrics
            let lyrics: Lyric[] = [];
            if (formData.lyricsInput.trim()) {
                // Try LRC format first
                lyrics = parseLRC(formData.lyricsInput);

                // If no lyrics parsed, try JSON format
                if (lyrics.length === 0) {
                    lyrics = parseJSON(formData.lyricsInput);
                }
            }

            const songData: CreateSongData = {
                title: formData.title,
                artist: formData.artist,
                audioUrl: formData.audioUrl,
                coverArtUrl: formData.coverArtUrl || undefined,
                lyrics: lyrics.length > 0 ? lyrics : undefined,
            };

            await api.createSong(songData);
            setSuccess(true);

            // Reset form
            setFormData({
                title: '',
                artist: '',
                audioUrl: '',
                coverArtUrl: '',
                lyricsInput: '',
            });

            // Navigate to feed after 2 seconds
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload song');
            console.error('Error uploading song:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h2 className={styles.title}>Upload a New Song</h2>
                <p className={styles.subtitle}>Add a song to the Scrollz library</p>

                {error && (
                    <div className={styles.errorBanner}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {success && (
                    <div className={styles.successBanner}>
                        <strong>Success!</strong> Song uploaded successfully. Redirecting...
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.label}>
                            Title <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={styles.input}
                            placeholder="Enter song title"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="artist" className={styles.label}>
                            Artist <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="artist"
                            value={formData.artist}
                            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                            className={styles.input}
                            placeholder="Enter artist name"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="audioUrl" className={styles.label}>
                            Audio URL <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="url"
                            id="audioUrl"
                            value={formData.audioUrl}
                            onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                            className={styles.input}
                            placeholder="https://example.com/song.mp3"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="coverArtUrl" className={styles.label}>
                            Cover Art URL
                        </label>
                        <input
                            type="url"
                            id="coverArtUrl"
                            value={formData.coverArtUrl}
                            onChange={(e) => setFormData({ ...formData, coverArtUrl: e.target.value })}
                            className={styles.input}
                            placeholder="https://example.com/cover.jpg"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="lyricsInput" className={styles.label}>
                            Lyrics (LRC or JSON format)
                        </label>
                        <textarea
                            id="lyricsInput"
                            value={formData.lyricsInput}
                            onChange={(e) => setFormData({ ...formData, lyricsInput: e.target.value })}
                            className={styles.textarea}
                            placeholder="LRC format: [00:12.00] First line&#10;[00:18.50] Second line&#10;&#10;OR&#10;&#10;JSON format: [{&quot;time&quot;: 12, &quot;text&quot;: &quot;First line&quot;}, {&quot;time&quot;: 18.5, &quot;text&quot;: &quot;Second line&quot;}]"
                            rows={10}
                        />
                        <p className={styles.hint}>
                            Use LRC format ([mm:ss.xx] text) or JSON format ([&#123;"time": 12, "text": "lyric"&#125;])
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className={styles.cancelButton}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Upload Song'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UploadForm;
