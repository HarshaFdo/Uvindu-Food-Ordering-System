import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Switch,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const NotificationTable = ({ notifications, onEdit, onDelete, onToggleActive }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Message</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {notifications.map((note) => (
          <TableRow key={note.id}>
            <TableCell>{note.title}</TableCell>
            <TableCell>{note.content}</TableCell>
            <TableCell>
              <Switch
                checked={note.is_active}
                onChange={() => onToggleActive(note)}
                color="primary"
              />
            </TableCell>
            <TableCell align="right">
              <Tooltip title="Edit">
                <IconButton onClick={() => onEdit(note)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => onDelete(note.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default NotificationTable;
