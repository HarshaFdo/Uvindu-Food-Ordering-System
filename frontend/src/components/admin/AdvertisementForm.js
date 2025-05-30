import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';

function AdvertisementForm({ advertisement, onSubmit, onClose }) {
  const [title, setTitle] = useState(advertisement?.title || '');
  const [subtitle, setSubtitle] = useState(advertisement?.subtitle || ''); // ✅ New
  const [description, setDescription] = useState(advertisement?.description || ''); // ✅ New
  const [price, setPrice] = useState(advertisement?.price || '');
  const [isActive, setIsActive] = useState(advertisement?.is_active ?? true);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('subtitle', subtitle.trim()); 
    formData.append('description', description.trim()); 
    formData.append('price', price.trim());
    formData.append('is_active', isActive.toString());

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (advertisement?.image) {
      formData.append('image', advertisement.image);
    }

    onSubmit(formData);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{advertisement ? 'Edit Advertisement' : 'New Advertisement'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            label="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label="Active"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            style={{ marginTop: '1rem' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {advertisement ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AdvertisementForm;
