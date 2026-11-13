import mongoose from 'mongoose';

const lyricSchema = new mongoose.Schema({
    time: {
        type: Number,
        required: true,
        min: 0
    },
    text: {
        type: String,
        required: true
    }
}, { _id: false });

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Song title is required'],
        trim: true
    },
    artist: {
        type: String,
        required: [true, 'Artist name is required'],
        trim: true
    },
    coverArtUrl: {
        type: String,
        trim: true,
        default: 'https://via.placeholder.com/400x400?text=No+Cover'
    },
    audioUrl: {
        type: String,
        required: [true, 'Audio URL is required'],
        trim: true
    },
    lyrics: {
        type: [lyricSchema],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient sorting by creation date
songSchema.index({ createdAt: -1 });

const Song = mongoose.model('Song', songSchema);

export default Song;
