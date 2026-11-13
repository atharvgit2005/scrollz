import express from 'express';
import Song from '../models/Song.js';

const router = express.Router();

// GET /api/songs - Fetch all songs sorted by newest
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.json(songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({
            error: 'Failed to fetch songs',
            message: error.message
        });
    }
});

// GET /api/songs/:id - Get a single song by ID
router.get('/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({
                error: 'Song not found',
                message: `No song found with ID: ${req.params.id}`
            });
        }

        res.json(song);
    } catch (error) {
        console.error('Error fetching song:', error);

        // Handle invalid ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({
                error: 'Invalid song ID format',
                message: error.message
            });
        }

        res.status(500).json({
            error: 'Failed to fetch song',
            message: error.message
        });
    }
});

// POST /api/songs - Create a new song
router.post('/', async (req, res) => {
    try {
        const { title, artist, coverArtUrl, audioUrl, lyrics } = req.body;

        // Validate required fields
        if (!title || !artist || !audioUrl) {
            return res.status(400).json({
                error: 'Validation failed',
                message: 'Title, artist, and audioUrl are required fields'
            });
        }

        // Validate lyrics format if provided
        if (lyrics && Array.isArray(lyrics)) {
            const invalidLyrics = lyrics.some(
                lyric => typeof lyric.time !== 'number' || typeof lyric.text !== 'string'
            );

            if (invalidLyrics) {
                return res.status(400).json({
                    error: 'Validation failed',
                    message: 'Each lyric must have a numeric "time" and string "text" property'
                });
            }
        }

        const newSong = new Song({
            title,
            artist,
            coverArtUrl,
            audioUrl,
            lyrics: lyrics || []
        });

        const savedSong = await newSong.save();
        res.status(201).json(savedSong);
    } catch (error) {
        console.error('Error creating song:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validation failed',
                message: error.message
            });
        }

        res.status(500).json({
            error: 'Failed to create song',
            message: error.message
        });
    }
});

export default router;
