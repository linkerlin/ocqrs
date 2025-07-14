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
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            {/* Posts routes */}
            <Route path="/posts" element={<PostsList />} />
            <Route path="/posts/new" element={<PostForm />} />
            <Route path="/posts/edit/:id" element={<PostForm />} />
            
            {/* Pages routes */}
            <Route path="/pages" element={<PagesList />} />
            <Route path="/pages/new" element={<PageForm />} />
            <Route path="/pages/edit/:id" element={<PageForm />} />
            
            {/* Users routes */}
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/edit/:id" element={<UserForm />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
