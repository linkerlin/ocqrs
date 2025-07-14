import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { pagesApi } from '../../services/api';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  createdAt: string;
}

const PagesList: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const response = await pagesApi.getAll();
        setPages(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching pages:', err);
        setError('Failed to load pages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await pagesApi.delete(id);
        setPages(pages.filter(page => page.id !== id));
      } catch (err) {
        console.error('Error deleting page:', err);
        setError('Failed to delete page. Please try again later.');
      }
    }
  };

  if (loading) {
    return <Typography>Loading pages...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Pages</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={RouterLink} 
          to="/pages/new"
        >
          Create New Page
        </Button>
      </Box>

      {pages.length === 0 ? (
        <Typography>No pages found. Create your first page!</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>{page.title}</TableCell>
                  <TableCell>{page.slug}</TableCell>
                  <TableCell>
                    <Chip 
                      label={page.status} 
                      color={page.status === 'published' ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{new Date(page.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton 
                      component={RouterLink} 
                      to={`/pages/edit/${page.id}`}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(page.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PagesList;