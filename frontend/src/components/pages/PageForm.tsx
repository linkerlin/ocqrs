import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { pagesApi } from '../../services/api';

interface PageFormData {
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'published';
}

const initialFormData: PageFormData = {
  title: '',
  content: '',
  slug: '',
  status: 'draft',
};

const PageForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<PageFormData>(initialFormData);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchPage = async () => {
        try {
          setLoading(true);
          const response = await pagesApi.getById(id!);
          setFormData(response.data);
          setError(null);
        } catch (err) {
          console.error('Error fetching page:', err);
          setError('Failed to load page. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchPage();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      // Auto-generate slug from title if slug is empty or hasn't been manually edited
      slug: formData.slug === '' ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : formData.slug,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditMode) {
        await pagesApi.update(id!, formData);
      } else {
        await pagesApi.create(formData);
      }
      
      navigate('/pages');
    } catch (err) {
      console.error('Error saving page:', err);
      setError('Failed to save page. Please try again later.');
    }
  };

  if (loading) {
    return <Typography>Loading page...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        {isEditMode ? 'Edit Page' : 'Create New Page'}
      </Typography>
      
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="slug"
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            helperText="URL-friendly version of the title"
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={10}
            id="content"
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {isEditMode ? 'Update Page' : 'Create Page'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/pages')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PageForm;