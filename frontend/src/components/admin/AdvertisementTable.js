import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper, CircularProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function AdvertisementTable({ advertisements, onEdit, onDelete, loading }) {
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {advertisements.map((ad) => (
            <TableRow key={ad.id}>
              <TableCell>{ad.title}</TableCell>
              <TableCell>
                <a href={ad.price} target="_blank" rel="noopener noreferrer">{ad.price}</a>
              </TableCell>
              <TableCell>
                <div className='relative w-14 h-14 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-200'>
                {ad.image && <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />}</div>
              </TableCell>
              <TableCell>{ad.is_active ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(ad)}><Edit /></IconButton>
                <IconButton onClick={() => onDelete(ad.id)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AdvertisementTable;
