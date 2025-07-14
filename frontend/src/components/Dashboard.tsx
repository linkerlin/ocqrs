import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { postsApi, pagesApi, usersApi } from '../services/api';

interface DashboardStats {
  posts: number;
  pages: number;
  users: number;
  recentPosts: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    posts: 0,
    pages: 0,
    users: 0,
    recentPosts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // In a real application, you might have a dedicated endpoint for dashboard stats
        // Here we're simulating by fetching from multiple endpoints
        try {
          const [postsRes, pagesRes, usersRes] = await Promise.all([
            postsApi.getAll(),
            pagesApi.getAll(),
            usersApi.getAll(),
          ]);
          
          setStats({
            posts: postsRes.data.length,
            pages: pagesRes.data.length,
            users: usersRes.data.length,
            recentPosts: postsRes.data.slice(0, 5), // Get 5 most recent posts
          });
        } catch (apiError) {
          console.error('API error, using mock data:', apiError);
          // Use mock data for demonstration
          setStats({
            posts: 5,
            pages: 3,
            users: 2,
            recentPosts: [
              {
                id: 'post-1',
                title: 'Getting Started with CQRS',
                content: 'This is a guide to implementing CQRS...',
                author: 'John Doe',
                status: 'published',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: ['CQRS', 'Architecture']
              },
              {
                id: 'post-2',
                title: 'Redis as a Message Queue',
                content: 'Learn how to use Redis lists as a message queue...',
                author: 'Jane Smith',
                status: 'draft',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: ['Redis', 'Queue']
              }
            ]
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Typography variant="h3" color="primary">
              {stats.posts}
            </Typography>
            <Typography variant="h6">
              Posts
            </Typography>
            <Button 
              component={RouterLink} 
              to="/posts" 
              variant="outlined" 
              sx={{ mt: 2 }}
            >
              Manage Posts
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Typography variant="h3" color="primary">
              {stats.pages}
            </Typography>
            <Typography variant="h6">
              Pages
            </Typography>
            <Button 
              component={RouterLink} 
              to="/pages" 
              variant="outlined" 
              sx={{ mt: 2 }}
            >
              Manage Pages
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Typography variant="h3" color="primary">
              {stats.users}
            </Typography>
            <Typography variant="h6">
              Users
            </Typography>
            <Button 
              component={RouterLink} 
              to="/users" 
              variant="outlined" 
              sx={{ mt: 2 }}
            >
              Manage Users
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Recent Posts
              </Typography>
              
              {stats.recentPosts.length === 0 ? (
                <Typography>No posts yet.</Typography>
              ) : (
                <List>
                  {stats.recentPosts.map((post, index) => (
                    <React.Fragment key={post.id}>
                      <ListItem>
                        <ListItemText 
                          primary={post.title} 
                          secondary={`By ${post.author} on ${new Date(post.createdAt).toLocaleDateString()}`} 
                        />
                      </ListItem>
                      {index < stats.recentPosts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
            <CardActions>
              <Button 
                component={RouterLink} 
                to="/posts" 
                size="small" 
                color="primary"
              >
                View All Posts
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to="/posts/new"
                >
                  Create New Post
                </Button>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to="/pages/new"
                >
                  Create New Page
                </Button>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to="/users/new"
                >
                  Create New User
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;