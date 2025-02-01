import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NoteEditor from './pages/NoteEditor';
import { UserProvider } from './context/UserContext';
import EditHistory from './pages/EditHistory';
import Layout from './components/Layout';
import NoPage from './pages/NoPage'; // Ensure this component exists
import CreateNote from './pages/CreateNote';
import Home from './pages/Home';
import { NoteProvider } from './context/NoteContext'; // Import NoteProvider
import UserProfile from './pages/UserProfile';
import ShareNote from './components/ShareNote';
// import './App.css';
// import ShareModal from './components/ShareModal';


function App() {
  return (
    <Router>
      {/* Wrap both UserProvider and NoteProvider */}
      <UserProvider>
        <NoteProvider>
        <React.StrictMode>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route index element={<Dashboard />} /> {/* Protected route */}
              <Route path="/notes/:id" element={<NoteEditor />} /> {/* Protected route */}
              <Route path="/history" element={<EditHistory />} />
              <Route path="*" element={<NoPage />} />
              <Route path="/create" element={<CreateNote />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/notes/:id/share" element={<ShareNote />} />
              {/* <Route path="/share" element={<ShareModal />} /> */}
            </Route>
          </Routes>
          </React.StrictMode>
        </NoteProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
