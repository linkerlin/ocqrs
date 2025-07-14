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
  Paper,
  Chip,
  Stack
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { postsApi } from '../../services/api';

interface PostFormData {
  title: string;
  content: string;
  author: string;
  status: 'draft' | 'published';
  tags: string[];
}

const initialFormData: PostFormData = {
  title: '',
  content: '',
  author: '',
  status: 'draft',
  tags: [],
};

const PostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<PostFormData>(initialFormData);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await postsApi.getById(id!);
          setFormData(response.data);
          setError(null);
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Failed to load post. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToDelete),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditMode) {
        await postsApi.update(id!, formData);
      } else {
        await postsApi.create(formData);
      }
      
      navigate('/posts');
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post. Please try again later.');
    }
  };

  if (loading) {
    return <Typography>Loading post...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        {isEditMode ? 'Edit Post' : 'Create New Post'}
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
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="author"
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={6}
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
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', mb: 1 }}>
              <TextField
                size="small"
                label="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button 
                variant="contained" 
                onClick={handleAddTag}
                sx={{ ml: 1 }}
              >
                Add
              </Button>
            </Box>
            
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                />
              ))}
            </Stack>
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {isEditMode ? 'Update Post' : 'Create Post'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/posts')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostForm;