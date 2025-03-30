import React, { useState, useContext } from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Box, Typography, Menu, MenuItem } from '@mui/material';
import { FileSystemContext } from '../../contexts/FileSystemContext';
import FileContextMenu from './FileContextMenu';

const FileTree = () => {
  const { files, currentPath, listFiles, openFile, deleteFileOrDir, renameFileOrDir } = useContext(FileSystemContext);
  const [expanded, setExpanded] = useState(['/workspace']);
  const [selected, setSelected] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeId) => {
    setSelected(nodeId);
    
    // Find the selected file/folder
    const file = files.find(f => f.path === nodeId);
    if (file && !file.isDirectory) {
      openFile(file);
    }
  };

  const handleContextMenu = (event, file) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX, mouseY: event.clientY }
        : null
    );
    setSelectedFile(file);
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const handleDelete = () => {
    if (selectedFile) {
      deleteFileOrDir(selectedFile.path);
    }
    setContextMenu(null);
  };

  const handleRename = (newName) => {
    if (selectedFile && newName) {
      const dirPath = selectedFile.path.substring(0, selectedFile.path.lastIndexOf('/'));
      const newPath = `${dirPath}/${newName}`;
      renameFileOrDir(selectedFile.path, newPath);
    }
  };

  const getFileIcon = (file) => {
    if (file.isDirectory) {
      return expanded.includes(file.path) ? <FolderOpenIcon color="primary" fontSize="small" /> : <FolderIcon color="primary" fontSize="small" />;
    }
    
    // Get file extension
    const extension = file.name.split('.').pop().toLowerCase();
    
    // Simple icon mapping based on file extension
    const iconMap = {
      js: <InsertDriveFileIcon sx={{ color: '#F0DB4F' }} fontSize="small" />,   // JavaScript - yellow
      jsx: <InsertDriveFileIcon sx={{ color: '#61DAFB' }} fontSize="small" />,  // React - blue
      ts: <InsertDriveFileIcon sx={{ color: '#007ACC' }} fontSize="small" />,   // TypeScript - blue
      tsx: <InsertDriveFileIcon sx={{ color: '#007ACC' }} fontSize="small" />,  // TypeScript React - blue
      html: <InsertDriveFileIcon sx={{ color: '#E34F26' }} fontSize="small" />, // HTML - orange
      css: <InsertDriveFileIcon sx={{ color: '#1572B6' }} fontSize="small" />,  // CSS - blue
      json: <InsertDriveFileIcon sx={{ color: '#F0DB4F' }} fontSize="small" />, // JSON - yellow
      md: <InsertDriveFileIcon sx={{ color: '#FFFFFF' }} fontSize="small" />,   // Markdown - white
      py: <InsertDriveFileIcon sx={{ color: '#3776AB' }} fontSize="small" />,   // Python - blue
    };
    
    return iconMap[extension] || <InsertDriveFileIcon fontSize="small" />;
  };

  const renderTree = (files) => {
    // Sort files first by directories, then by name
    const sortedFiles = [...files].sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    return sortedFiles.map((file) => (
      <TreeItem
        key={file.path}
        nodeId={file.path}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5, px: 0 }}>
            {getFileIcon(file)}
            <Typography variant="body2" sx={{ ml: 1 }}>
              {file.name}
            </Typography>
          </Box>
        }
        onContextMenu={(e) => handleContextMenu(e, file)}
      >
        {file.isDirectory && files.some(f => f.path.startsWith(file.path + '/')) && (
          // If this directory is expanded, fetch its children
          expanded.includes(file.path) && (
            renderTree(files.filter(f => {
              const relativePath = f.path.replace(file.path + '/', '');
              return f.path !== file.path && f.path.startsWith(file.path + '/') && !relativePath.includes('/');
            }))
          )
        )}
      </TreeItem>
    ));
  };

  return (
    <Box sx={{ p: 1 }}>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {renderTree(files.filter(f => {
          // Only show files in the root directory
          const relativePath = f.path.replace(currentPath + '/', '');
          return f.path !== currentPath && f.path.startsWith(currentPath + '/') && !relativePath.includes('/');
        }))}
      </TreeView>
      
      <FileContextMenu
        contextMenu={contextMenu}
        handleClose={handleContextMenuClose}
        handleDelete={handleDelete}
        handleRename={handleRename}
        isDirectory={selectedFile?.isDirectory}
      />
    </Box>
  );
};

export default FileTree;
