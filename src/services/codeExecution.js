// Mock service for executing code in the browser environment

class CodeExecutionService {
  constructor() {
    this.outputListeners = [];
    this.errorListeners = [];
    this.runningProcesses = new Map();
    this.nextProcessId = 1;
  }
  
  // Execute JavaScript code in a sandboxed environment
  executeJavaScript(code, contextVars = {}) {
    const processId = this.nextProcessId++;
    
    this.notifyOutput(processId, '> Executing JavaScript code...\n');
    
    try {
      // Create a sandboxed environment with provided context
      const sandbox = {
        console: {
          log: (...args) => this.handleConsoleLog(processId, ...args),
          error: (...args) => this.handleConsoleError(processId, ...args),
          warn: (...args) => this.handleConsoleWarn(processId, ...args),
          info: (...args) => this.handleConsoleInfo(processId, ...args)
        },
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
        ...contextVars
      };
      
      // Track this process
      this.runningProcesses.set(processId, { type: 'js', startTime: Date.now() });
      
      // Execute in try/catch to handle errors
      const wrappedCode = `
        try {
          ${code}
        } catch (error) {
          console.error(error);
        }
      `;
      
      // Use Function constructor to create a new scope
      const executor = new Function(...Object.keys(sandbox), wrappedCode);
      
      // Execute the code with the sandbox context
      executor(...Object.values(sandbox));
      
      this.notifyOutput(processId, '> JavaScript execution completed\n');
      return processId;
    } catch (error) {
      this.notifyError(processId, `Error executing JavaScript: ${error.message}\n`);
      return null;
    }
  }
  
  // Execute shell commands (mock implementation)
  executeCommand(command, cwd = '/workspace') {
    const processId = this.nextProcessId++;
    const words = command.trim().split(' ');
    const cmd = words[0];
    const args = words.slice(1);
    
    this.notifyOutput(processId, `> Executing: ${command}\n`);
    
    // Track this process
    this.runningProcesses.set(processId, { type: 'shell', command, startTime: Date.now() });
    
    // Mock implementation of common shell commands
    setTimeout(() => {
      switch (cmd) {
        case 'ls':
          this.mockLsCommand(processId, args, cwd);
          break;
        case 'echo':
          this.mockEchoCommand(processId, args);
          break;
        case 'cd':
          this.mockCdCommand(processId, args, cwd);
          break;
        case 'cat':
          this.mockCatCommand(processId, args, cwd);
          break;
        case 'node':
          this.mockNodeCommand(processId, args, cwd);
          break;
        case 'npm':
          this.mockNpmCommand(processId, args, cwd);
          break;
        default:
          this.notifyError(processId, `Command not found: ${cmd}\n`);
      }
      
      // Complete the process
      this.runningProcesses.delete(processId);
    }, 500);
    
    return processId;
  }
  
  // Mock implementation of 'ls' command
  mockLsCommand(processId, args, cwd) {
    // This would typically interact with file system service
    // Here we'll just return mock data
    this.notifyOutput(processId, 'file1.js\nfile2.js\ndirectory1/\ndirectory2/\n');
  }
  
  // Mock implementation of 'echo' command
  mockEchoCommand(processId, args) {
    this.notifyOutput(processId, args.join(' ') + '\n');
  }
  
  // Mock implementation of 'cd' command
  mockCdCommand(processId, args, cwd) {
    if (args.length === 0) {
      this.notifyOutput(processId, '/workspace\n');
    } else {
      // Would change directory in a real implementation
      this.notifyOutput(processId, `Changed directory to: ${args[0]}\n`);
    }
  }
  
  // Mock implementation of 'cat' command
  mockCatCommand(processId, args, cwd) {
    if (args.length === 0) {
      this.notifyError(processId, 'cat: missing file operand\n');
      return;
    }
    
    // This would read from file system in a real implementation
    this.notifyOutput(processId, `// Mock content of file: ${args[0]}\n// This is a placeholder for actual file content\n`);
  }
  
  // Mock implementation of 'node' command
  mockNodeCommand(processId, args, cwd) {
    if (args.length === 0) {
      this.notifyOutput(processId, 'Node.js REPL (mock)\n> ');
      return;
    }
    
    const filename = args[0];
    this.notifyOutput(processId, `Executing ${filename} with Node.js (mock)...\n`);
    this.notifyOutput(processId, 'Hello from Node.js!\n');
  }
  
  // Mock implementation of 'npm' command
  mockNpmCommand(processId, args, cwd) {
    if (args.length === 0) {
      this.notifyOutput(processId, 'npm usage instructions (mock)\n');
      return;
    }
    
    const subcommand = args[0];
    
    switch (subcommand) {
      case 'install':
        const packages = args.slice(1);
        if (packages.length === 0) {
          this.notifyOutput(processId, 'Installing dependencies from package.json... (mock)\n');
        } else {
          this.notifyOutput(processId, `Installing packages: ${packages.join(', ')} (mock)\n`);
        }
        this.notifyOutput(processId, 'Added 123 packages in 2s (mock)\n');
        break;
      case 'start':
        this.notifyOutput(processId, 'Starting application... (mock)\n');
        this.notifyOutput(processId, 'App running at http://localhost:3000 (mock)\n');
        break;
      case 'test':
        this.notifyOutput(processId, 'Running tests... (mock)\n');
        this.notifyOutput(processId, 'PASS: All tests passed! (mock)\n');
        break;
      case 'build':
        this.notifyOutput(processId, 'Building application... (mock)\n');
        this.notifyOutput(processId, 'Build completed successfully! (mock)\n');
        break;
      default:
        this.notifyOutput(processId, `Running npm ${subcommand}... (mock)\n`);
        this.notifyOutput(processId, 'Command completed successfully (mock)\n');
    }
  }
  
  // Handle console.log from executed code
  handleConsoleLog(processId, ...args) {
    const output = args.map(arg => this.formatArg(arg)).join(' ');
    this.notifyOutput(processId, output + '\n');
  }
  
  // Handle console.error from executed code
  handleConsoleError(processId, ...args) {
    const output = args.map(arg => this.formatArg(arg)).join(' ');
    this.notifyError(processId, output + '\n');
  }
  
  // Handle console.warn from executed code
  handleConsoleWarn(processId, ...args) {
    const output = args.map(arg => this.formatArg(arg)).join(' ');
    this.notifyOutput(processId, `[WARN] ${output}\n`);
  }
  
  // Handle console.info from executed code
  handleConsoleInfo(processId, ...args) {
    const output = args.map(arg => this.formatArg(arg)).join(' ');
    this.notifyOutput(processId, `[INFO] ${output}\n`);
  }
  
  // Format any type of argument for console output
  formatArg(arg) {
    if (arg === undefined) return 'undefined';
    if (arg === null) return 'null';
    
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch (e) {
        return '[Object]';
      }
    }
    
    return String(arg);
  }
  
  // Terminate a running process
  terminateProcess(processId) {
    if (!this.runningProcesses.has(processId)) {
      return false;
    }
    
    // In a real implementation, this would terminate the process
    this.runningProcesses.delete(processId);
    this.notifyOutput(processId, '\n> Process terminated\n');
    return true;
  }
  
  // Add a listener for process output
  addOutputListener(listener) {
    this.outputListeners.push(listener);
    return () => {
      this.outputListeners = this.outputListeners.filter(l => l !== listener);
    };
  }
  
  // Add a listener for process errors
  addErrorListener(listener) {
    this.errorListeners.push(listener);
    return () => {
      this.errorListeners = this.errorListeners.filter(l => l !== listener);
    };
  }
  
  // Notify all output listeners
  notifyOutput(processId, output) {
    this.outputListeners.forEach(listener => listener(processId, output));
  }
  
  // Notify all error listeners
  notifyError(processId, error) {
    this.errorListeners.forEach(listener => listener(processId, error));
  }
}

// Singleton instance
const codeExecutionService = new CodeExecutionService();

export default codeExecutionService;
