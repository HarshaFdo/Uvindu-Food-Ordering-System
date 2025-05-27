import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  DialogActions,
} from "@mui/material";

function NotificationForm({ open, onClose, onSubmit, notification }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_active: true,
  });

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title || "",
        content: notification.content || "",
        is_active: notification.is_active ?? true,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        is_active: true,
      });
    }
  }, [notification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      is_active: e.target.checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Please fill in both Title and Content fields.");
      return;
    }

    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{notification ? "Edit" : "Create"} Notification</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          multiline
          rows={4}
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Switch
              checked={formData.is_active}
              onChange={handleSwitchChange}
              name="is_active"
              color="primary"
            />
          }
          label="Active"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {notification ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NotificationForm;
