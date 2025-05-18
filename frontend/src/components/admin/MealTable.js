import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Switch, Button
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

const MealTable = ({ meals, onEdit, onDelete, onToggleAvailability }) => {
  return (
    <Table sx={{ minWidth: 650, backgroundColor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#1976d2' }}>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Image</TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Half Price</TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Full Price</TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Available</TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {meals && meals.length > 0 ? (
          meals.map((meal) => (
            <TableRow key={meal.id} hover>
              <TableCell>
                {meal.image && (
                  <img
                    src={meal.image}
                    alt={meal.name}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: 'cover',
                      borderRadius: 8,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                    }}
                  />
                )}
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>{meal.name}</TableCell>
              <TableCell>Rs. {meal.half_price}</TableCell>
              <TableCell>Rs. {meal.full_price}</TableCell>
              <TableCell>
                <Switch
                  checked={meal.availability}
                  onChange={() => onToggleAvailability(meal)}
                  color="success"
                />
              </TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => onEdit(meal)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(meal.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} align="center" sx={{ padding: 4, color: '#999' }}>
              No meals found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>

  );
};

export default MealTable;
