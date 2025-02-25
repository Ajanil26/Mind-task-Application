import React from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleStatusChange = () => {
    console.log('Toggling status for todo:', todo._id);
    onUpdate(todo._id, {
      status: todo.status === 'completed' ? 'pending' : 'completed'
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ListItem
      sx={{
        mb: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Checkbox
        checked={todo.status === 'completed'}
        onChange={handleStatusChange}
        color="primary"
      />
      <ListItemText
        primary={
          <Typography
            variant="h6"
            sx={{
              textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
              color: todo.status === 'completed' ? 'text.secondary' : 'text.primary',
            }}
          >
            {todo.title}
          </Typography>
        }
        secondary={
          <Box sx={{ mt: 1 }}>
            {todo.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {todo.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={todo.priority}
                size="small"
                color={getPriorityColor(todo.priority)}
              />
              {todo.dueDate && (
                <Chip
                  label={formatDate(todo.dueDate)}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        }
      />
      <IconButton 
        onClick={() => onDelete(todo._id)}
        color="error"
        size="small"
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};

export default TodoItem; 