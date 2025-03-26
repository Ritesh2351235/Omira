import React from 'react';
import { CalendarClock, Brain, Bot, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';

export default function McpPage() {
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
        <Alert className="border border-neutral-200 bg-neutral-50 text-neutral-800">
          <CalendarClock className="h-4 w-4" />
          <AlertTitle className="text-neutral-800 font-medium text-sm">Coming Soon</AlertTitle>
          <AlertDescription className="text-sm">
            MCP Server creation is coming in our next release. Stay tuned for announcements!
          </AlertDescription>
        </Alert>

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

        <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">Get Ready for MCP</h3>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-neutral-600">
              Start preparing for your MCP server by organizing your memories now. Use our
              <a href="/memories" className="text-blue-500 hover:underline mx-1">memory collection tools</a>
              to build your knowledge base.
            </p>
            <p className="text-sm leading-relaxed text-neutral-600">
              Whether you're a developer looking to enhance your coding workflow with Cursor,
              or someone who wants to have more meaningful conversations with Claude,
              MCP will transform how you interact with AI by making it truly personal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 