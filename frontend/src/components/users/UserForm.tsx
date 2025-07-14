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
  Avatar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { usersApi } from '../../services/api';

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'author';
}

const initialFormData: UserFormData = {
  username: '',
  email: '',
  password: '',
  role: 'author',
};

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await usersApi.getById(id!);
          // Don't include password in edit mode
          setFormData({
            ...response.data,
            password: '', // Clear password for security
          });
          setError(null);
        } catch (err) {
          console.error('Error fetching user:', err);
          setError('Failed to load user. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // If editing and password is empty, remove it from the payload
      const payload = { ...formData };
      if (isEditMode && !payload.password) {
        delete payload.password;
      }
      
      if (isEditMode) {
        await usersApi.update(id!, payload);
      } else {
        await usersApi.create(payload);
      }
      
      navigate('/users');
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Failed to save user. Please try again later.');
    }
  };

  if (loading) {
    return <Typography>Loading user...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        {isEditMode ? 'Edit User' : 'Create New User'}
      </Typography>
      
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      
      <Paper sx={{ p: 3 }}>
        {isEditMode && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, fontSize: 40 }}>
              {formData.username.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="password"
            label={isEditMode ? "Password (leave empty to keep current)" : "Password"}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!isEditMode}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
              <MenuItem value="author">Author</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {isEditMode ? 'Update User' : 'Create User'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/users')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserForm;