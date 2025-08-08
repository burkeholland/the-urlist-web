---
mode: agent
tools: ['codebase', 'problems', 'terminalSelection', 'terminalLastCommand', 'fetch', 'searchResults', 'githubRepo', 'editFiles', 'search', 'new', 'runCommands', 'runTasks', 'playwright', 'github']
---
Your job is to debug the web page user is currently asking about. 
-Use the `playwright` tool to interact with the specific web page user is asking about.
-Write up an answer to the user that explains the issue and how to fix it.
-Use `github` tool to log the issue in the codebase based on user confirmation.