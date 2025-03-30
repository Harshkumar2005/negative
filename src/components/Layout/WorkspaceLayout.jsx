import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CodeIcon from '@mui/icons-material/Code';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useContext } from 'react';
import { EditorContext } from '../../contexts/EditorContext';
import { FileSystemContext } from '../../contexts/FileSystemContext';

// Import components
import LeftSidebar from '../Sidebar/LeftSidebar';
import Editor from '../Editor/Editor';
import Terminal from '../Terminal/Terminal';
import RightSidebar from '../Sidebar/RightSidebar';
import EditorTabs from '../Editor/EditorTabs';

// Constants for drawer widths
const LEFT_DRAWER_WIDTH = 240;
const RIGHT_DRAWER_WIDTH = 300;
const TERMINAL_HEIGHT = 300;

const WorkspaceLayout = () => {
  const { theme, toggleTheme } = useContext(EditorContext);
  const { openFiles, activeFile } = useContext(FileSystemContext);
  
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(true);

  const toggleLeftDrawer = () => {
    setLeftDrawerOpen(!leftDrawerOpen);
  };

  const toggleRightDrawer = () => {
    setRightDrawerOpen(!rightDrawerOpen);
  };

  const toggleTerminal = () => {
    setTerminalOpen(!terminalOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleLeftDrawer}>
            <MenuIcon />
          </IconButton>
          <CodeIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Web Code Editor
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme}>
            {theme === 'vs-dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton color="inherit">
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - File Explorer */}
        <Drawer
          variant="persistent"
          open={leftDrawerOpen}
          sx={{
            width: LEFT_DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: LEFT_DRAWER_WIDTH,
              position: 'relative',
              border: 'none',
              height: '100%'
            },
          }}
        >
          <LeftSidebar />
        </Drawer>

        {/* Main Content Area */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%', 
          overflow: 'hidden'
        }}>
          {/* Editor Tabs */}
          {openFiles.length > 0 && <EditorTabs />}

          {/* Editor Area */}
          <Box sx={{ 
            flexGrow: 1, 
            overflow: 'hidden',
            display: 'flex',
            backgroundColor: theme === 'vs-dark' ? '#1e1e1e' : '#f3f3f3'
          }}>
            {activeFile ? (
              <Editor />
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%',
                color: 'text.secondary' 
              }}>
                <Typography variant="body1">
                  Open a file from the File Explorer to start editing
                </Typography>
              </Box>
            )}
          </Box>

          {/* Terminal Area */}
          {terminalOpen && (
            <Box sx={{ 
              height: TERMINAL_HEIGHT, 
              borderTop: 1, 
              borderColor: 'divider'
            }}>
              <Terminal />
            </Box>
          )}
        </Box>

        {/* Right Sidebar - AI Assistant */}
        <Drawer
          variant="persistent"
          anchor="right"
          open={rightDrawerOpen}
          sx={{
            width: RIGHT_DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: RIGHT_DRAWER_WIDTH,
              position: 'relative',
              border: 'none',
              height: '100%'
            },
          }}
        >
          <RightSidebar />
        </Drawer>
      </Box>
    </Box>
  );
};

export default WorkspaceLayout;
