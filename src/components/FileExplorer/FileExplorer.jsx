import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileTree from './FileTree';
import { FileSystemContext } from '../../contexts/FileSystemContext';

const FileExplorer = () => {
  const { currentPath, setCurrentPath, listFiles, createDirectory, writeFile } = useContext(FileSystemContext);
  const [contextMenu, setContextMenu] = useState(null);
  const [newFileDialog, setNewFileDialog] = useState(false);
  const [newDirDialog, setNewDirDialog] = useState(false);
  const [newName, setNewName] = useState('');
  
  useEffect(() => {
    listFiles(currentPath);
  }, [currentPath, listFiles]);

  const handleRefresh = () => {
    listFiles(currentPath);
  };

  const handleCreateFile = () => {
    setNewFileDialog(true);
  };

  const handleCreateDirectory = () => {
    setNewDirDialog(true);
  };

  const handleNewFileSubmit = () => {
    if (newName) {
      const path = `${currentPath}/${newName}`;
      writeFile(path, '');
      listFiles(currentPath);
    }
    setNewFileDialog(false);
    setNewName('');
  };

  const handleNewDirSubmit = () => {
    if (newName) {
      const path = `${currentPath}/${newName}`;
      createDirectory(path);
      listFiles(currentPath);
    }
    setNewDirDialog(false);
    setNewName('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: 1, 
        borderBottom: 1, 
        borderColor: 'divider'
      }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          EXPLORER
        </Typography>
        <Tooltip title="New File">
          <IconButton size="small" onClick={handleCreateFile}>
            <NoteAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="New Folder">
          <IconButton size="small" onClick={handleCreateDirectory}>
            <CreateNewFolderIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={handleRefresh}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <FileTree />
      </Box>

      {/* New File Dialog */}
      <Dialog open={newFileDialog} onClose={() => setNewFileDialog(false)}>
        <DialogTitle>Create New File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="File Name"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFileDialog(false)}>Cancel</Button>
          <Button onClick={handleNewFileSubmit}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* New Directory Dialog */}
      <Dialog open={newDirDialog} onClose={() => setNewDirDialog(false)}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewDirDialog(false)}>Cancel</Button>
          <Button onClick={handleNewDirSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileExplorer;
