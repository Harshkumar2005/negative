import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, TextField, Button, Chip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CommitIcon from '@mui/icons-material/CommitSharp';
import PushIcon from '@mui/icons-material/Upload';
import PullIcon from '@mui/icons-material/Download';
import BranchIcon from '@mui/icons-material/AccountTree';

const GitControls = () => {
  const [changes, setChanges] = useState([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState('main');
  
  // Mock data - in a real application, this would come from a Git service
  useEffect(() => {
    // Simulate fetching Git data
    setTimeout(() => {
      setChanges([
        { path: 'src/App.jsx', status: 'modified' },
        { path: 'src/components/Editor/Editor.jsx', status: 'modified' },
        { path: 'src/styles.css', status: 'added' }
      ]);
      
      setBranches([
        { name: 'main', isCurrent: true },
        { name: 'develop', isCurrent: false },
        { name: 'feature/new-ui', isCurrent: false }
      ]);
    }, 500);
  }, []);
  
  // Mock Git operations
  const handleCommit = () => {
    if (commitMessage.trim() === '') return;
    
    console.log(`Committing with message: ${commitMessage}`);
    setCommitMessage('');
    // In a real app, call Git service to commit changes
    
    // Mock successful commit
    setTimeout(() => {
      setChanges([]);
    }, 500);
  };
  
  const handlePush = () => {
    console.log('Pushing changes to remote');
    // In a real app, call Git service to push changes
  };
  
  const handlePull = () => {
    console.log('Pulling changes from remote');
    // In a real app, call Git service to pull changes
  };
  
  const handleChangeBranch = (branchName) => {
    console.log(`Switching to branch: ${branchName}`);
    setCurrentBranch(branchName);
    
    // Update branches list
    const updatedBranches = branches.map(branch => ({
      ...branch,
      isCurrent: branch.name === branchName
    }));
    
    setBranches(updatedBranches);
    // In a real app, call Git service to change branch
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ padding: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1">GIT</Typography>
      </Box>
      
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <BranchIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">CURRENT BRANCH</Typography>
        </Box>
        <Chip 
          label={currentBranch} 
          size="small" 
          color="primary" 
          sx={{ borderRadius: 1 }}
        />
      </Box>
      
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="body2" gutterBottom>CHANGES</Typography>
        <List dense disablePadding>
          {changes.length === 0 ? (
            <ListItem sx={{ pl: 0 }}>
              <ListItemText primary="No changes" primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          ) : (
            changes.map((change, index) => (
              <ListItem key={index} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  {change.status === 'modified' ? (
                    <RemoveIcon fontSize="small" color="warning" />
                  ) : change.status === 'added' ? (
                    <AddIcon fontSize="small" color="success" />
                  ) : (
                    <RemoveIcon fontSize="small" color="error" />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={change.path} 
                  primaryTypographyProps={{ variant: 'body2', noWrap: true }} 
                />
              </ListItem>
            ))
          )}
        </List>
      </Box>
      
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="body2" gutterBottom>COMMIT</Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Commit message"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          variant="outlined"
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<CommitIcon />}
            disabled={commitMessage.trim() === '' || changes.length === 0}
            onClick={handleCommit}
            fullWidth
          >
            Commit
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="body2" gutterBottom>REMOTE</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<PushIcon />}
            onClick={handlePush}
          >
            Push
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<PullIcon />}
            onClick={handlePull}
          >
            Pull
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ p: 1, flexGrow: 1, overflow: 'auto' }}>
        <Typography variant="body2" gutterBottom>BRANCHES</Typography>
        <List dense disablePadding>
          {branches.map((branch, index) => (
            <ListItem 
              key={index} 
              sx={{ 
                pl: 0, 
                backgroundColor: branch.isCurrent ? 'action.selected' : 'inherit',
                cursor: 'pointer'
              }}
              onClick={() => !branch.isCurrent && handleChangeBranch(branch.name)}
            >
              <ListItemIcon sx={{ minWidth: 24 }}>
                <BranchIcon fontSize="small" color={branch.isCurrent ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary={branch.name} 
                primaryTypographyProps={{ variant: 'body2' }} 
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default GitControls;
