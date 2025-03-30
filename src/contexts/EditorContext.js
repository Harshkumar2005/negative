import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { FileSystemContext } from './FileSystemContext';

// Create context
export const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const {
    activeFile,
    openFiles,
    updateFileContent,
    saveFile
  } = useContext(FileSystemContext);

  const [editorInstance, setEditorInstance] = useState(null);
  const [theme, setTheme] = useState('vs-dark'); // Default theme
  const [fontSize, setFontSize] = useState(14);
  const [editorOptions, setEditorOptions] = useState({
    minimap: { enabled: true },
    lineNumbers: 'on',
    tabSize: 2,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on'
  });

  // Function to determine language based on file extension
  const getLanguageFromFilename = useCallback((filename) => {
    if (!filename) return 'plaintext';

    const extension = filename.split('.').pop().toLowerCase();
    
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'go': 'go',
      'php': 'php',
      'rb': 'ruby',
      'rs': 'rust',
      'sh': 'shell',
      'yaml': 'yaml',
      'yml': 'yaml',
      'xml': 'xml'
    };
    
    return languageMap[extension] || 'plaintext';
  }, []);

  // Handle content change in editor
  const handleContentChange = useCallback((newContent) => {
    if (!activeFile) return;
    updateFileContent(activeFile.path, newContent);
  }, [activeFile, updateFileContent]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'vs-dark' ? 'vs-light' : 'vs-dark');
  }, []);

  // Save active file
  const handleSaveFile = useCallback(() => {
    if (!activeFile) return;
    saveFile();
  }, [activeFile, saveFile]);

  // Update editor options
  const updateEditorOptions = useCallback((options) => {
    setEditorOptions(prev => ({ ...prev, ...options }));
  }, []);

  // Change font size
  const changeFontSize = useCallback((newSize) => {
    setFontSize(newSize);
  }, []);

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveFile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveFile]);

  const value = {
    editorInstance,
    setEditorInstance,
    theme,
    fontSize,
    editorOptions,
    getLanguageFromFilename,
    handleContentChange,
    toggleTheme,
    handleSaveFile,
    updateEditorOptions,
    changeFontSize
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};
