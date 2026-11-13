export interface Lyric {
    time: number;
    text: string;
}

export interface Song {
    _id: string;
    title: string;
    artist: string;
    coverArtUrl: string;
    audioUrl: string;
    lyrics: Lyric[];
    createdAt: string;
}

export interface CreateSongData {
    title: string;
    artist: string;
    coverArtUrl?: string;
    audioUrl: string;
    lyrics?: Lyric[];
}
