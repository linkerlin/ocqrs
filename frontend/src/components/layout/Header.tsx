import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          OCQRS CMS
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/posts">
            Posts
          </Button>
          <Button color="inherit" component={RouterLink} to="/pages">
            Pages
          </Button>
          <Button color="inherit" component={RouterLink} to="/users">
            Users
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;