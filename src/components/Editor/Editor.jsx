import React, { useContext, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import * as monaco from 'monaco-editor';
import { EditorContext } from '../../contexts/EditorContext';
import { FileSystemContext } from '../../contexts/FileSystemContext';

const Editor = () => {
  const editorRef = useRef(null);
  const monacoEditorRef = useRef(null);
  const { 
    theme, 
    fontSize, 
    editorOptions, 
    getLanguageFromFilename, 
    handleContentChange,
    setEditorInstance 
  } = useContext(EditorContext);
  const { activeFile } = useContext(FileSystemContext);

  // Initialize editor
  useEffect(() => {
    if (editorRef.current && activeFile) {
      // Clean up previous editor instance
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
      }

      // Determine language from file name
      const language = getLanguageFromFilename(activeFile.name);

      // Create editor instance
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: activeFile.content || '',
        language,
        theme,
        fontSize,
        ...editorOptions
      });

      // Set editor instance in context
      setEditorInstance(monacoEditorRef.current);

      // Set up change listener
      const model = monacoEditorRef.current.getModel();
      if (model) {
        model.onDidChangeContent(() => {
          handleContentChange(monacoEditorRef.current.getValue());
        });
      }

      // Clean up
      return () => {
        if (monacoEditorRef.current) {
          monacoEditorRef.current.dispose();
        }
      };
    }
  }, [activeFile?.path, theme, fontSize, editorOptions]);

  // Update editor content when active file changes
  useEffect(() => {
    if (monacoEditorRef.current && activeFile) {
      const currentModel = monacoEditorRef.current.getModel();
      const language = getLanguageFromFilename(activeFile.name);
      
      if (currentModel) {
        // Update model content and language
        monaco.editor.setModelLanguage(currentModel, language);
        monacoEditorRef.current.setValue(activeFile.content || '');
      }
    }
  }, [activeFile]);

  // Update theme when it changes
  useEffect(() => {
    monaco.editor.setTheme(theme);
  }, [theme]);

  return (
    <Box 
      ref={editorRef} 
      sx={{ 
        width: '100%', 
        height: '100%'
      }} 
    />
  );
};

export default Editor;
