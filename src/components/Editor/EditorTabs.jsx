import React, { useContext } from 'react';
import { Box, Tabs, Tab, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FileSystemContext } from '../../contexts/FileSystemContext';

const EditorTabs = () => {
  const { openFiles, activeFile, closeFile } = useContext(FileSystemContext);

  const handleChange = (event, newValue) => {
    // Find the file by path and set it as active
    const file = openFiles.find(f => f.path === newValue);
    if (file) {
      openFile(file);
    }
  };

  const handleClose = (event, path) => {
    event.stopPropagation();
    closeFile(path);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={activeFile ? activeFile.path : false}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {openFiles.map((file) => (
          <Tab
            key={file.path}
            value={file.path}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {file.name}
                {file.modified && ' •'}
                <IconButton
                  size="small"
                  onClick={(e) => handleClose(e, file.path)}
                  sx={{ ml: 1, p: 0 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            }
            sx={{ 
              textTransform: 'none',
              minHeight: 36,
              '& .MuiTab-wrapper': {
                alignItems: 'center'
              }
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default EditorTabs;
