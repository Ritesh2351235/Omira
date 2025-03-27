import React from 'react';
import { CalendarClock, Brain, Bot, Lock, Download, Terminal, FileJson, FolderOpen, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export default function McpPage() {
  const handleDownload = () => {
    // Replace this URL with your actual server file download URL
    const fileUrl = '/mcp-server.zip';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'mcp-server.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto">


      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">MCP Server</h2>
          <p className="text-sm text-muted-foreground mt-1">Create your personal Model Context Protocol server</p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Beta Feature
        </Badge>
      </div>



      <div className="w-full space-y-6">
        <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Model Context Protocol: The Future of Personal AI</h3>
            <p className="text-sm text-muted-foreground">Seamlessly connect your memories with powerful AI models</p>
          </div>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-neutral-600">
              MCP (Model Context Protocol) represents a groundbreaking approach to personalized AI interaction.
              By creating your own MCP server, you'll be able to query powerful AI models like Claude and Cursor
              with the full context of your selected memories.
            </p>
            <p className="text-sm leading-relaxed text-neutral-600">
              Imagine asking Claude a question and having it understand not just the question, but the entire context
              of your past experiences, notes, and knowledge stored in your <a href="/memories" className="text-blue-500 hover:underline">memory archive</a>.
            </p>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">MCP Server V1: Now Available!</h3>
            <p className="text-sm text-muted-foreground">Set up your personal MCP server for Claude Desktop and Cursor</p>
          </div>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-neutral-600">
              Download and configure your MCP server to enhance your AI interactions with personalized context from your memories.
            </p>
            <div className="flex justify-start">
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download MCP Server
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold">Setup Instructions</h3>

          <div className="space-y-6">
            {/* Step 1: User ID Configuration */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium text-neutral-900">1. Configure User ID</h4>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600 ml-7">
                Open <code className="bg-neutral-100 px-1.5 py-0.5 rounded">server.js</code> and replace the
                <code className="bg-neutral-100 px-1.5 py-0.5 rounded">SPECIFIED_USERID</code> with your User ID
                from the <a href="/account" className="text-blue-500 hover:underline">Account page</a>.
              </p>
            </div>

            {/* Step 2: Installation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium text-neutral-900">2. Install Dependencies</h4>
              </div>
              <div className="ml-7 space-y-2">
                <p className="text-sm leading-relaxed text-neutral-600">
                  Open your terminal in the MCP server directory and run:
                </p>
                <code className="block bg-neutral-100 p-2 rounded text-sm">
                  npm install
                  <br />
                  npm run build
                </code>
              </div>
            </div>

            {/* Step 3: Claude Desktop Configuration */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium text-neutral-900">3. Configure Claude Desktop</h4>
              </div>
              <div className="ml-7 space-y-2">
                <p className="text-sm leading-relaxed text-neutral-600">
                  Locate the AppData folder for Claude Desktop and create or edit the
                  <code className="bg-neutral-100 px-1.5 py-0.5 rounded">claude_desktop_config</code> file:
                </p>
                <Alert className="bg-neutral-50 border-neutral-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-sm font-medium">Configuration Text</AlertTitle>
                  <AlertDescription className="text-sm mt-2">
                    <p className="mb-2 text-sm text-neutral-600">
                      Replace <code className="bg-neutral-100 px-1.5 py-0.5 rounded">PATH_TO_MCP_SERVER</code> with the actual path to your downloaded MCP server folder.
                    </p>
                    <code className="block bg-white p-2 rounded border border-neutral-200 whitespace-pre">
                      {`{
  "mcpServers": {
    "omi-mcp": {
      "command": "node",
      "args": [
        "PATH_TO_MCP_SERVER/dist/server.js"
      ],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}`}
                    </code>
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            {/* Step 4: Cursor Configuration */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-2">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium text-neutral-900">4. Configure Cursor</h4>
              </div>
              <div className="ml-7 space-y-2">
                <p className="text-sm leading-relaxed text-neutral-600">
                  Open Cursor Settings, navigate to the MCP section, and click "Add new MCP". When the configuration file opens:
                </p>
                <Alert className="bg-neutral-50 border-neutral-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-sm font-medium">Configuration Text</AlertTitle>
                  <AlertDescription className="text-sm mt-2">
                    <p className="mb-2 text-sm text-neutral-600">
                      Copy and paste the same configuration as above, replacing <code className="bg-neutral-100 px-1.5 py-0.5 rounded">PATH_TO_MCP_SERVER</code> with your MCP server folder path.
                    </p>
                  </AlertDescription>
                </Alert>
                <p className="text-sm leading-relaxed text-neutral-600 mt-4">
                  Once configured, your Cursor MCP settings should look like this:
                </p>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <div className="relative w-full max-w-3xl">
                <img
                  src="/cursor.png"
                  alt="Cursor MCP Settings Configuration"
                  className="rounded-lg border border-neutral-200 shadow-sm w-full"
                />
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Example: Cursor MCP Settings page showing the configured MCP server
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <div className="relative w-full max-w-3xl">
            <img
              src="/mcp.png"
              alt="Claude using MCP Server to recall lunch memory"
              className="rounded-lg border border-neutral-200 shadow-sm w-full"
            />
            <p className="text-xs text-center text-muted-foreground mt-2">
              Example: Claude using MCP to recall memories about yesterday's lunch
            </p>
          </div>
        </div>

        {/* MCP Server Setup Section */}


        {/* Setup Instructions */}


        {/* Usage Instructions */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">Using Your MCP Server</h3>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-neutral-600">
              Once configured, your MCP server will automatically provide context from your memories to Claude Desktop
              and Cursor. Try asking about your past conversations, notes, or experiences!
            </p>
            <p className="text-sm leading-relaxed text-neutral-600">
              Keep adding to your <a href="/memories" className="text-blue-500 hover:underline">memory archive</a> to
              enhance your AI interactions with more personal context.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 