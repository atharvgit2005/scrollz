import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SongFeed from './components/SongFeed/SongFeed';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1 className="app-logo">Scrollz</h1>
          <nav className="app-nav">
            <Link to="/">Feed</Link>
            <Link to="/admin">Upload</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<SongFeed />} />
            <Route path="/admin" element={
              <div style={{ color: 'white', padding: '50px' }}>
                <h2>Upload Form Coming Soon</h2>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
