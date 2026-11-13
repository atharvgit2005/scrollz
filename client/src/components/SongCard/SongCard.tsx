import type { Song } from '../../types/Song';
import styles from './SongCard.module.css';

interface SongCardProps {
    song: Song;
    onClick: () => void;
}

function SongCard({ song, onClick }: SongCardProps) {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.coverArt}>
                <img src={song.coverArtUrl} alt={`${song.title} cover`} />
                <div className={styles.playOverlay}>
                    <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>
            <div className={styles.info}>
                <h3 className={styles.title}>{song.title}</h3>
                <p className={styles.artist}>{song.artist}</p>
            </div>
        </div>
    );
}

export default SongCard;
