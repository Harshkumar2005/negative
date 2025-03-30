import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as BrowserFS from 'browserfs';
import { set, get } from 'idb-keyval';
import JSZip from 'jszip';

// Create context
export const FileSystemContext = createContext();

export const FileSystemProvider = ({ children }) => {
  const [fs, setFs] = useState(null);
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState([]);
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize BrowserFS
  useEffect(() => {
    const initFs = async () => {
      return new Promise((resolve, reject) => {
        BrowserFS.configure({
          fs: 'IndexedDB',
          options: { storeName: 'web-code-editor-fs' }
        }, (err) => {
          if (err) return reject(err);
          const fs = BrowserFS.BFSRequire('fs');
          resolve(fs);
        });
      });
    };

    initFs()
      .then((filesystem) => {
        setFs(filesystem);
        // Create basic folder structure if it doesn't exist
        try {
          if (!filesystem.existsSync('/workspace')) {
            filesystem.mkdirSync('/workspace');
          }
        } catch (err) {
          console.error('Error setting up initial folders:', err);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to initialize filesystem:', error);
        setIsLoading(false);
      });
  }, []);

  // List files in a directory
  const listFiles = useCallback((path = '/workspace') => {
    if (!fs) return [];
    
    try {
      const fileList = fs.readdirSync(path);
      const filesData = fileList.map(file => {
        const filePath = `${path}/${file}`;
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          isDirectory: stats.isDirectory(),
          size: stats.size,
          modified: stats.mtime
        };
      });
      setFiles(filesData);
      return filesData;
    } catch (err) {
      console.error(`Error listing files at ${path}:`, err);
      return [];
    }
  }, [fs]);

  // Read file content
  const readFile = useCallback((path) => {
    if (!fs) return null;
    
    try {
      const content = fs.readFileSync(path, { encoding: 'utf8' });
      return content;
    } catch (err) {
      console.error(`Error reading file ${path}:`, err);
      return null;
    }
  }, [fs]);

  // Write file content
  const writeFile = useCallback((path, content) => {
    if (!fs) return false;
    
    try {
      const dirPath = path.substring(0, path.lastIndexOf('/'));
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(path, content);
      return true;
    } catch (err) {
      console.error(`Error writing file ${path}:`, err);
      return false;
    }
  }, [fs]);

  // Create directory
  const createDirectory = useCallback((path) => {
    if (!fs) return false;
    
    try {
      fs.mkdirSync(path, { recursive: true });
      listFiles(currentPath);
      return true;
    } catch (err) {
      console.error(`Error creating directory ${path}:`, err);
      return false;
    }
  }, [fs, currentPath, listFiles]);

  // Delete file or directory
  const deleteFileOrDir = useCallback((path) => {
    if (!fs) return false;
    
    try {
      const stats = fs.statSync(path);
      if (stats.isDirectory()) {
        // Recursive delete for directories
        const deleteRecursive = (dirPath) => {
          if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach((file) => {
              const curPath = `${dirPath}/${file}`;
              if (fs.statSync(curPath).isDirectory()) {
                deleteRecursive(curPath);
              } else {
                fs.unlinkSync(curPath);
              }
            });
            fs.rmdirSync(dirPath);
          }
        };
        deleteRecursive(path);
      } else {
        fs.unlinkSync(path);
      }
      
      // If we deleted the active file, clear it
      if (activeFile && activeFile.path === path) {
        setActiveFile(null);
        setOpenFiles(prev => prev.filter(f => f.path !== path));
      }
      
      listFiles(currentPath);
      return true;
    } catch (err) {
      console.error(`Error deleting ${path}:`, err);
      return false;
    }
  }, [fs, currentPath, listFiles, activeFile]);

  // Rename file or directory
  const renameFileOrDir = useCallback((oldPath, newPath) => {
    if (!fs) return false;
    
    try {
      // Read the content if it's a file
      let content = null;
      const stats = fs.statSync(oldPath);
      if (!stats.isDirectory()) {
        content = fs.readFileSync(oldPath, { encoding: 'utf8' });
      }
      
      // If it's a directory, recursively move contents
      if (stats.isDirectory()) {
        createDirectory(newPath);
        fs.readdirSync(oldPath).forEach(file => {
          const oldFilePath = `${oldPath}/${file}`;
          const newFilePath = `${newPath}/${file}`;
          renameFileOrDir(oldFilePath, newFilePath);
        });
        fs.rmdirSync(oldPath);
      } else {
        // For files, write to new path and delete old
        writeFile(newPath, content);
        fs.unlinkSync(oldPath);
        
        // Update open files references
        if (activeFile && activeFile.path === oldPath) {
          setActiveFile({
            ...activeFile, 
            path: newPath, 
            name: newPath.split('/').pop()
          });
        }
        
        setOpenFiles(prev => prev.map(f => {
          if (f.path === oldPath) {
            return {
              ...f, 
              path: newPath, 
              name: newPath.split('/').pop()
            };
          }
          return f;
        }));
      }
      
      listFiles(currentPath);
      return true;
    } catch (err) {
      console.error(`Error renaming ${oldPath} to ${newPath}:`, err);
      return false;
    }
  }, [fs, currentPath, createDirectory, writeFile, listFiles, activeFile]);

  // Export project as ZIP
  const exportProjectAsZip = useCallback(async () => {
    if (!fs) return null;
    
    try {
      const zip = new JSZip();
      
      const addFilesToZip = (dirPath, zipFolder) => {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
          const fullPath = `${dirPath}/${file}`;
          const stats = fs.statSync(fullPath);
          
          if (stats.isDirectory()) {
            const newZipFolder = zipFolder.folder(file);
            addFilesToZip(fullPath, newZipFolder);
          } else {
            const content = fs.readFileSync(fullPath);
            zipFolder.file(file, content);
          }
        });
      };
      
      addFilesToZip('/workspace', zip);
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      return zipBlob;
    } catch (err) {
      console.error('Error exporting project as ZIP:', err);
      return null;
    }
  }, [fs]);

  // Open a file in the editor
  const openFile = useCallback((file) => {
    if (!fs) return;
    
    try {
      // Check if file is already open
      const isAlreadyOpen = openFiles.some(f => f.path === file.path);
      
      if (!isAlreadyOpen) {
        const content = readFile(file.path);
        const newFile = {
          ...file,
          content,
          modified: false
        };
        setOpenFiles(prev => [...prev, newFile]);
      }
      
      // Set as active file
      const fileToActivate = isAlreadyOpen 
        ? openFiles.find(f => f.path === file.path)
        : { ...file, content: readFile(file.path), modified: false };
      
      setActiveFile(fileToActivate);
    } catch (err) {
      console.error(`Error opening file ${file.path}:`, err);
    }
  }, [fs, openFiles, readFile]);

  // Save current active file
  const saveFile = useCallback(() => {
    if (!fs || !activeFile) return false;
    
    try {
      writeFile(activeFile.path, activeFile.content);
      
      // Update open files list to mark as not modified
      setOpenFiles(prev => prev.map(f => {
        if (f.path === activeFile.path) {
          return { ...f, modified: false };
        }
        return f;
      }));
      
      // Update active file
      setActiveFile(prev => ({ ...prev, modified: false }));
      
      return true;
    } catch (err) {
      console.error(`Error saving file ${activeFile.path}:`, err);
      return false;
    }
  }, [fs, activeFile, writeFile]);

  // Update file content without saving to disk
  const updateFileContent = useCallback((path, content) => {
    setOpenFiles(prev => prev.map(f => {
      if (f.path === path) {
        return { ...f, content, modified: true };
      }
      return f;
    }));
    
    if (activeFile && activeFile.path === path) {
      setActiveFile(prev => ({ ...prev, content, modified: true }));
    }
  }, [activeFile]);

  // Close file
  const closeFile = useCallback((path) => {
    const fileIndex = openFiles.findIndex(f => f.path === path);
    if (fileIndex === -1) return;
    
    setOpenFiles(prev => prev.filter(f => f.path !== path));
    
    // If we're closing the active file, set another file as active
    if (activeFile && activeFile.path === path) {
      if (openFiles.length > 1) {
        // Choose the next or previous file
        const newActiveIndex = fileIndex === 0 ? 1 : fileIndex - 1;
        setActiveFile(openFiles[newActiveIndex]);
      } else {
        setActiveFile(null);
      }
    }
  }, [openFiles, activeFile]);

  // Load files when the directory changes
  useEffect(() => {
    if (fs && !isLoading) {
      listFiles(currentPath);
    }
  }, [fs, currentPath, isLoading, listFiles]);

  const contextValue = {
    fs,
    files,
    openFiles,
    activeFile,
    currentPath,
    isLoading,
    setCurrentPath,
    listFiles,
    readFile,
    writeFile,
    createDirectory,
    deleteFileOrDir,
    renameFileOrDir,
    exportProjectAsZip,
    openFile,
    saveFile,
    updateFileContent,
    closeFile
  };

  return (
    <FileSystemContext.Provider value={contextValue}>
      {children}
    </FileSystemContext.Provider>
  );
};
