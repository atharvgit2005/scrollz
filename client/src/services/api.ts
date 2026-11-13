import type { Song, CreateSongData } from '../types/Song';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const api = {
    // Fetch all songs
    async fetchSongs(): Promise<Song[]> {
        const response = await fetch(`${API_BASE_URL}/songs`);
        if (!response.ok) {
            throw new Error(`Failed to fetch songs: ${response.statusText}`);
        }
        return response.json();
    },

    // Fetch a single song by ID
    async fetchSongById(id: string): Promise<Song> {
        const response = await fetch(`${API_BASE_URL}/songs/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Song not found');
            }
            throw new Error(`Failed to fetch song: ${response.statusText}`);
        }
        return response.json();
    },

    // Create a new song
    async createSong(data: CreateSongData): Promise<Song> {
        const response = await fetch(`${API_BASE_URL}/songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create song');
        }

        return response.json();
    },
};
