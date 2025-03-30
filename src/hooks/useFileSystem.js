// hooks/useFileSystem.js
import { useContext, useEffect, useState } from 'react';
import { FileSystemContext } from '../contexts/FileSystemContext';
import fileSystemService from '../services/fileSystem';

export function useFileSystem() {
  const context = useContext(FileSystemContext);
  
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  
  return context;
}

export function useFile(filePath) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!filePath) {
      setContent('');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      const fileContent = fileSystemService.getFileContent(filePath);
      setContent(fileContent || '');
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load file');
      setContent('');
    } finally {
      setLoading(false);
    }
  }, [filePath]);
  
  const saveFile = (newContent) => {
    if (!filePath) return false;
    
    try {
      fileSystemService.saveFile(filePath, newContent);
      setContent(newContent);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to save file');
      return false;
    }
  };
  
  return {
    content,
    loading,
    error,
    saveFile
  };
}

export function useDirectory(dirPath) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadFiles = () => {
    setLoading(true);
    
    try {
      const dirFiles = fileSystemService.listFiles(dirPath);
      setFiles(dirFiles);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load directory');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!dirPath) {
      setFiles([]);
      setLoading(false);
      return;
    }
    
    loadFiles();
    
    // Set up listener for file system changes
    const removeListener = fileSystemService.addChangeListener(() => {
      loadFiles();
    });
    
    return () => removeListener();
  }, [dirPath]);
  
  return {
    files,
    loading,
    error,
    refresh: loadFiles
  };
}
