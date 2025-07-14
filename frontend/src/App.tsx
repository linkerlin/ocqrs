import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './components/Dashboard';
import PostsList from './components/posts/PostsList';
import PostForm from './components/posts/PostForm';
import PagesList from './components/pages/PagesList';
import PageForm from './components/pages/PageForm';
import UsersList from './components/users/UsersList';
import UserForm from './components/users/UserForm';

// Create a theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          
          {/* Posts routes */}
          <Route path="/posts" element={<Layout><PostsList /></Layout>} />
          <Route path="/posts/new" element={<Layout><PostForm /></Layout>} />
          <Route path="/posts/edit/:id" element={<Layout><PostForm /></Layout>} />
          
          {/* Pages routes */}
          <Route path="/pages" element={<Layout><PagesList /></Layout>} />
          <Route path="/pages/new" element={<Layout><PageForm /></Layout>} />
          <Route path="/pages/edit/:id" element={<Layout><PageForm /></Layout>} />
          
          {/* Users routes */}
          <Route path="/users" element={<Layout><UsersList /></Layout>} />
          <Route path="/users/new" element={<Layout><UserForm /></Layout>} />
          <Route path="/users/edit/:id" element={<Layout><UserForm /></Layout>} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
