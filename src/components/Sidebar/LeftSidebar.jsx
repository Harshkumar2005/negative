import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchIcon from '@mui/icons-material/Search';
import BugReportIcon from '@mui/icons-material/BugReport';
import FileExplorer from '../FileExplorer/FileExplorer';
import GitControls from '../GitControls/GitControls';

const LeftSidebar = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        orientation="vertical"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderRight: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            minWidth: 50,
            minHeight: 50,
            p: 1,
          },
        }}
      >
        <Tab icon={<FolderIcon />} aria-label="Files" />
        <Tab icon={<GitHubIcon />} aria-label="Git" />
        <Tab icon={<SearchIcon />} aria-label="Search" />
        <Tab icon={<BugReportIcon />} aria-label="Debug" />
      </Tabs>

      <Box sx={{ flexGrow: 1, overflow: 'hidden', display: activeTab === 0 ? 'block' : 'none' }}>
        <FileExplorer />
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'hidden', display: activeTab === 1 ? 'block' : 'none' }}>
        <GitControls />
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'hidden', display: activeTab === 2 ? 'block' : 'none' }}>
        {/* Search component (to be implemented) */}
        <Box sx={{ p: 2 }}>Search (Coming Soon)</Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'hidden', display: activeTab === 3 ? 'block' : 'none' }}>
        {/* Debug component (to be implemented) */}
        <Box sx={{ p: 2 }}>Debug (Coming Soon)</Box>
      </Box>
    </Box>
  );
};

export default LeftSidebar;
