import React, { useState } from 'react';
import { Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const FileContextMenu = ({ contextMenu, handleClose, handleDelete, handleRename, isDirectory }) => {
  const [renameDialog, setRenameDialog] = useState(false);
  const [newName, setNewName] = useState('');

  const openRenameDialog = () => {
    setRenameDialog(true);
    handleClose();
  };

  const closeRenameDialog = () => {
    setRenameDialog(false);
    setNewName('');
  };

  const submitRename = () => {
    handleRename(newName);
    closeRenameDialog();
  };

  return (
    <>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={openRenameDialog}>Rename</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      {/* Rename Dialog */}
      <Dialog open={renameDialog} onClose={closeRenameDialog}>
        <DialogTitle>Rename {isDirectory ? 'Folder' : 'File'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRenameDialog}>Cancel</Button>
          <Button onClick={submitRename}>Rename</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileContextMenu;
