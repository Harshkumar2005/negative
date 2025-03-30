// Complete implementation of the file system service
class FileSystemService {
  constructor() {
    // Mock file system structure
    this.fileSystem = {
      '/workspace': {
        type: 'directory',
        children: {
          'src': {
            type: 'directory',
            children: {
              'App.jsx': {
                type: 'file',
                content: 'import React from "react";\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;'
              },
              'index.js': {
                type: 'file',
                content: 'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "./App";\n\nReactDOM.render(<App />, document.getElementById("root"));'
              },
              'components': {
                type: 'directory',
                children: {
                  'Button.jsx': {
                    type: 'file',
                    content: 'import React from "react";\n\nconst Button = ({ children, onClick }) => {\n  return (\n    <button onClick={onClick}>\n      {children}\n    </button>\n  );\n};\n\nexport default Button;'
                  },
                  'Header.jsx': {
                    type: 'file',
                    content: 'import React from "react";\n\nconst Header = ({ title }) => {\n  return <header>{title}</header>;\n};\n\nexport default Header;'
                  }
                }
              },
              'styles': {
                type: 'directory',
                children: {
                  'main.css': {
                    type: 'file',
                    content: 'body {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n}'
                  }
                }
              }
            }
          },
          'package.json': {
            type: 'file',
            content: '{\n  "name": "my-project",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^17.0.2",\n    "react-dom": "^17.0.2"\n  }\n}'
          },
          'README.md': {
            type: 'file',
            content: '# My Project\n\nThis is a sample project.'
          }
        }
      }
    };
    
    this.currentDirectory = '/workspace';
    this.listeners = [];
  }

  // Get file or directory by path
  getItem(path) {
    const parts = this.normalizePath(path).split('/').filter(p => p);
    let current = this.fileSystem;
    
    // Special case for root
    if (parts.length === 0 || (parts.length === 1 && parts[0] === '')) {
      return { ...this.fileSystem['/workspace'], path: '/workspace' };
    }
    
    // Handle /workspace as part of the path
    if (parts[0] === 'workspace') {
      parts.shift();
    }
    
    current = this.fileSystem['/workspace'];
    
    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return null;
      }
      current = current.children[part];
    }
    
    return { ...current, path: this.normalizePath('/' + parts.join('/')) };
  }
  
  // List files in directory
  listFiles(directory = this.currentDirectory) {
    const dir = this.getItem(directory);
    if (!dir || dir.type !== 'directory') {
      return [];
    }
    
    return Object.entries(dir.children).map(([name, item]) => ({
      name,
      type: item.type,
      path: `${directory === '/' ? '' : directory}/${name}`,
      children: item.type === 'directory' ? this.getDirectoryStructure(item.children) : null
    }));
  }
  
  // Get directory structure recursively
  getDirectoryStructure(dirChildren) {
    if (!dirChildren) return [];
    
    return Object.entries(dirChildren).map(([name, item]) => ({
      name,
      type: item.type,
      children: item.type === 'directory' ? this.getDirectoryStructure(item.children) : null
    }));
  }
  
  // Get file content
  getFileContent(path) {
    const file = this.getItem(path);
    if (!file || file.type !== 'file') {
      return null;
    }
    return file.content;
  }
  
  // Save file content
  saveFile(path, content) {
    const normalizedPath = this.normalizePath(path);
    const pathParts = normalizedPath.split('/').filter(p => p);
    
    // Handle /workspace as part of the path
    if (pathParts[0] === 'workspace') {
      pathParts.shift();
    }
    
    const fileName = pathParts.pop();
    const dirPath = '/' + pathParts.join('/');
    
    let current = this.fileSystem['/workspace'];
    for (const part of pathParts) {
      if (!current.children[part]) {
        current.children[part] = {
          type: 'directory',
          children: {}
        };
      }
      current = current.children[part];
    }
    
    if (!current.children[fileName]) {
      // Creating new file
      current.children[fileName] = {
        type: 'file',
        content: content
      };
    } else {
      // Updating existing file
      current.children[fileName].content = content;
    }
    
    this.notifyListeners();
    return true;
  }
  
  // Create new file
  createFile(directory, fileName) {
    return this.saveFile(`${directory}/${fileName}`, '');
  }
  
  // Create new directory
  createDirectory(directory, dirName) {
    const normalizedPath = this.normalizePath(`${directory}/${dirName}`);
    const pathParts = normalizedPath.split('/').filter(p => p);
    
    // Handle /workspace as part of the path
    if (pathParts[0] === 'workspace') {
      pathParts.shift();
    }
    
    let current = this.fileSystem['/workspace'];
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (i === pathParts.length - 1) {
        // Last part is the new directory name
        if (!current.children[part]) {
          current.children[part] = {
            type: 'directory',
            children: {}
          };
          this.notifyListeners();
          return true;
        }
        return false; // Directory already exists
      }
      
      if (!current.children[part]) {
        current.children[part] = {
          type: 'directory',
          children: {}
        };
      }
      current = current.children[part];
    }
    
    return false;
  }
  
  // Delete file or directory
  deleteItem(path) {
    const normalizedPath = this.normalizePath(path);
    const pathParts = normalizedPath.split('/').filter(p => p);
    
    // Handle /workspace as part of the path
    if (pathParts[0] === 'workspace') {
      pathParts.shift();
    }
    
    if (pathParts.length === 0) {
      return false; // Cannot delete root
    }
    
    const itemName = pathParts.pop();
    let current = this.fileSystem['/workspace'];
    
    for (const part of pathParts) {
      if (!current.children[part]) {
        return false;
      }
      current = current.children[part];
    }
    
    if (current.children && current.children[itemName]) {
      delete current.children[itemName];
      this.notifyListeners();
      return true;
    }
    
    return false;
  }
  
  // Rename file or directory
  renameItem(path, newName) {
    const normalizedPath = this.normalizePath(path);
    const pathParts = normalizedPath.split('/').filter(p => p);
    
    // Handle /workspace as part of the path
    if (pathParts[0] === 'workspace') {
      pathParts.shift();
    }
    
    if (pathParts.length === 0) {
      return false; // Cannot rename root
    }
    
    const itemName = pathParts.pop();
    const dirPath = '/' + pathParts.join('/');
    let current = this.fileSystem['/workspace'];
    
    for (const part of pathParts) {
      if (!current.children[part]) {
        return false;
      }
      current = current.children[part];
    }
    
    if (current.children && current.children[itemName]) {
      const item = current.children[itemName];
      delete current.children[itemName];
      current.children[newName] = item;
      this.notifyListeners();
      return true;
    }
    
    return false;
  }
  
  // Normalize path
  normalizePath(path) {
    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    // Remove trailing slash
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    return path;
  }
  
  // Add listener for file system changes
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
const fileSystemService = new FileSystemService();

export default fileSystemService;
