// components/AlertModal.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  Alert,
  AlertTitle,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AlertModal = ({ open, onClose, type, title, message }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Alert
          severity={type}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </Alert>
      </DialogContent>
    </Dialog>
  );
};

export default AlertModal;
