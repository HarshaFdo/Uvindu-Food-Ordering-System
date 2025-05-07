import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Switch
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

const MealTable = ({ meals, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Image</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Half Price</TableCell>
          <TableCell>Full Price</TableCell>
          <TableCell>Available</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {meals && meals.length > 0 ? (
          meals.map((meal) => (
            <TableRow key={meal.id}>
              <TableCell>
                {meal.image && (
                  <img src={meal.image} alt={meal.name} style={{ width: 50, height: 50 }} />
                )}
              </TableCell>
              <TableCell>{meal.name}</TableCell>
              <TableCell>{meal.half_price}</TableCell>
              <TableCell>{meal.full_price}</TableCell>
              <TableCell>
                <Switch checked={meal.availability} disabled />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(meal)}><Edit /></IconButton>
                <IconButton onClick={() => onDelete(meal.id)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6}>No meals found.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MealTable;
