import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Mosaic } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';

// Import contexts
import { FileSystemProvider } from './contexts/FileSystemContext';
import { EditorProvider } from './contexts/EditorContext';

// Import components
import WorkspaceLayout from './components/Layout/WorkspaceLayout';
import LeftSidebar from './components/Sidebar/LeftSidebar';
import Editor from './components/Editor/Editor';
import Terminal from './components/Terminal/Terminal';
import RightSidebar from './components/Sidebar/RightSidebar';

// Main app structure
const App = () => {
  const [initializedFs, setInitializedFs] = useState(false);

  useEffect(() => {
    // Initialize file system when component mounts
    const initFs = async () => {
      try {
        // We'll implement file system initialization in FileSystemContext
        setInitializedFs(true);
      } catch (error) {
        console.error('Failed to initialize file system:', error);
      }
    };

    initFs();
  }, []);

  if (!initializedFs) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Loading file system...
    </Box>;
  }

  return (
    <FileSystemProvider>
      <EditorProvider>
        <WorkspaceLayout />
      </EditorProvider>
    </FileSystemProvider>
  );
};

export default App;
