import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const Terminal = () => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      // Initialize xterm.js
      xtermRef.current = new XTerm({
        cursorBlink: true,
        theme: {
          background: '#1E1E1E',
          foreground: '#D4D4D4'
        }
      });

      // Add the fit addon
      fitAddonRef.current = new FitAddon();
      xtermRef.current.loadAddon(fitAddonRef.current);

      // Open the terminal
      xtermRef.current.open(terminalRef.current);
      
      // Fit the terminal to the container
      fitAddonRef.current.fit();

      // Add some welcome text
      xtermRef.current.writeln('Web Code Editor Terminal');
      xtermRef.current.writeln('------------------------');
      xtermRef.current.writeln('This is a limited terminal environment running in your browser.');
      xtermRef.current.writeln('Type "help" for available commands.');
      xtermRef.current.write('\r\n$ ');

      // Handle user input
      let currentLine = '';
      xtermRef.current.onKey(e => {
        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

        if (ev.keyCode === 13) { // Enter key
          xtermRef.current.writeln('');
          processCommand(currentLine);
          currentLine = '';
          xtermRef.current.write('$ ');
        } else if (ev.keyCode === 8) { // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.substr(0, currentLine.length - 1);
            xtermRef.current.write('\b \b');
          }
        } else if (printable) {
          currentLine += e.key;
          xtermRef.current.write(e.key);
        }
      });

      // Basic command processing
      const processCommand = (command) => {
        command = command.trim();
        if (command === 'help') {
          xtermRef.current.writeln('Available commands:');
          xtermRef.current.writeln('  help    - Show this help message');
          xtermRef.current.writeln('  clear   - Clear the terminal');
          xtermRef.current.writeln('  ls      - List files (mock)');
          xtermRef.current.writeln('  echo    - Echo text');
        } else if (command === 'clear') {
          xtermRef.current.clear();
        } else if (command === 'ls') {
          xtermRef.current.writeln('index.js');
          xtermRef.current.writeln('package.json');
          xtermRef.current.writeln('README.md');
        } else if (command.startsWith('echo ')) {
          xtermRef.current.writeln(command.substr(5));
        } else if (command !== '') {
          xtermRef.current.writeln(`Command not found: ${command}`);
        }
      };

      // Handle terminal resize
      const handleResize = () => {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      };

      window.addEventListener('resize', handleResize);

      // Clean up
      return () => {
        window.removeEventListener('resize', handleResize);
        if (xtermRef.current) {
          xtermRef.current.dispose();
        }
      };
    }
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          p: 0.5,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant="body2">TERMINAL</Typography>
      </Box>
      <Box
        ref={terminalRef}
        sx={{
          flexGrow: 1,
          backgroundColor: '#1E1E1E',
          padding: '4px'
        }}
      />
    </Box>
  );
};

export default Terminal;
