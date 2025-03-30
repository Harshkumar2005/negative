// Mock Git service for simulating Git operations in the browser

class GitService {
  constructor() {
    this.repositories = new Map();
    this.activeRepository = null;
    this.listeners = [];
    
    // Initialize with a mock repository
    this.initializeDefaultRepo();
  }
  
  initializeDefaultRepo() {
    const defaultRepo = {
      name: 'web-code-editor',
      currentBranch: 'main',
      branches: ['main', 'develop', 'feature/ui-improvements'],
      commits: [
        {
          id: '8f7e6d5c4b3a2109',
          message: 'Initial commit',
          author: 'User',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          files: ['package.json', 'README.md']
        },
        {
          id: '2a3b4c5d6e7f8910',
          message: 'Add basic editor components',
          author: 'User',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          files: ['src/App.jsx', 'src/components/Editor/Editor.jsx']
        },
        {
          id: '0a1b2c3d4e5f6a7b',
          message: 'Implement file explorer',
          author: 'User',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          files: ['src/components/FileExplorer/FileExplorer.jsx', 'src/components/FileExplorer/FileTree.jsx']
        }
      ],
      stagedChanges: [],
      changes: [
        { path: 'src/App.jsx', status: 'modified' },
        { path: 'src/components/Editor/Editor.jsx', status: 'modified' },
        { path: 'src/components/Terminal/Terminal.jsx', status: 'added' }
      ],
      remotes: ['origin']
    };
    
    this.repositories.set('web-code-editor', defaultRepo);
    this.activeRepository = 'web-code-editor';
  }
  
  // Get current repository
  getCurrentRepository() {
    return this.repositories.get(this.activeRepository);
  }
  
  // Get current branch
  getCurrentBranch() {
    const repo = this.getCurrentRepository();
    return repo ? repo.currentBranch : null;
  }
  
  // Get all branches
  getBranches() {
    const repo = this.getCurrentRepository();
    return repo ? repo.branches : [];
  }
  
  // Get commits for current branch
  getCommits(branch = null) {
    const repo = this.getCurrentRepository();
    if (!repo) return [];
    
    // In a real implementation, this would filter by branch
    return repo.commits;
  }
  
  // Get uncommitted changes
  getChanges() {
    const repo = this.getCurrentRepository();
    return repo ? repo.changes : [];
  }
  
  // Stage a file
  stageFile(filePath) {
    const repo = this.getCurrentRepository();
    if (!repo) return false;
    
    const fileChange = repo.changes.find(change => change.path === filePath);
    if (fileChange) {
      repo.stagedChanges.push({...fileChange});
      repo.changes = repo.changes.filter(change => change.path !== filePath);
      this.notifyListeners();
      return true;
    }
    
    return false;
  }
  
  // Unstage a file
  unstageFile(filePath) {
    const repo = this.getCurrentRepository();
    if (!repo) return false;
    
    const stagedFile = repo.stagedChanges.find(change => change.path === filePath);
    if (stagedFile) {
      repo.changes.push({...stagedFile});
      repo.stagedChanges = repo.stagedChanges.filter(change => change.path !== filePath);
      this.notifyListeners();
      return true;
    }
    
    return false;
  }
  
  // Stage all files
  stageAll() {
    const repo = this.getCurrentRepository();
    if (!repo || repo.changes.length === 0) return false;
    
    repo.stagedChanges = [...repo.stagedChanges, ...repo.changes];
    repo.changes = [];
    this.notifyListeners();
    return true;
  }
  
  // Unstage all files
  unstageAll() {
    const repo = this.getCurrentRepository();
    if (!repo || repo.stagedChanges.length === 0) return false;
    
    repo.changes = [...repo.changes, ...repo.stagedChanges];
    repo.stagedChanges = [];
    this.notifyListeners();
    return true;
  }
  
  // Commit staged changes
  commit(message) {
    const repo = this.getCurrentRepository();
    if (!repo || repo.stagedChanges.length === 0 || !message) return false;
    
    const newCommit = {
      id: Math.random().toString(16).slice(2, 18),
      message,
      author: 'User',
      date: new Date().toISOString(),
      files: repo.stagedChanges.map(change => change.path)
    };
    
    repo.commits.unshift(newCommit);
    repo.stagedChanges = [];
    this.notifyListeners();
    return true;
  }
  
  // Switch branch
  switchBranch(branchName) {
    const repo = this.getCurrentRepository();
    if (!repo || !repo.branches.includes(branchName)) return false;
    
    repo.currentBranch = branchName;
    
    // In a real implementation, this would update the working directory
    // to reflect the state of the branch
    
    this.notifyListeners();
    return true;
  }
  
  // Create new branch
  createBranch(branchName) {
    const repo = this.getCurrentRepository();
    if (!repo || repo.branches.includes(branchName)) return false;
    
    repo.branches.push(branchName);
    this.notifyListeners();
    return true;
  }
  
  // Push to remote (mock)
  push(remote = 'origin', branch = null) {
    const repo = this.getCurrentRepository();
    if (!repo) return false;
    
    const branchToPush = branch || repo.currentBranch;
    
    // In a real implementation, this would push to remote repository
    console.log(`Pushing ${branchToPush} to ${remote}...`);
    
    // Simulate network delay
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Push to ${remote}/${branchToPush} completed successfully.`);
        this.notifyListeners();
        resolve(true);
      }, 1000);
    });
  }
  
  // Pull from remote (mock)
  pull(remote = 'origin', branch = null) {
    const repo = this.getCurrentRepository();
    if (!repo) return false;
    
    const branchToPull = branch || repo.currentBranch;
    
    // In a real implementation, this would pull from remote repository
    console.log(`Pulling from ${remote}/${branchToPull}...`);
    
    // Simulate network delay
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulate getting a new commit
        const newCommit = {
          id: Math.random().toString(16).slice(2, 18),
          message: 'Remote changes pulled',
          author: 'Remote User',
          date: new Date().toISOString(),
          files: ['src/remote-file.js']
        };
        
        repo.commits.unshift(newCommit);
        console.log(`Pull from ${remote}/${branchToPull} completed successfully.`);
        this.notifyListeners();
        resolve(true);
      }, 1000);
    });
  }
  
  // Add listener for Git changes
  addChangeListener(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  // Notify all listeners of changes
  notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

// Singleton instance
const gitService = new GitService();

export default gitService;
