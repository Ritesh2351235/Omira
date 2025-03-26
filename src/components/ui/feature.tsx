import { Check } from "lucide-react";
import { Badge } from "./badge";

function Feature() {
  return (
    <div className="w-full py-12 lg:py-24">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex gap-4 py-8 flex-col items-center">
          <div>
            <Badge>Omira Features</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter font-regular">
              Unlock Your Full Potential
            </h2>
            <p className="text-lg max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              Managing your health and conversations shouldn't be complicated.
            </p>
          </div>
          <div className="flex gap-18 pt-8 flex-col w-full mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 items-start lg:grid-cols-3 gap-10">
              <div className="flex flex-row gap-6 w-full items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Daily Health Dashboard</p>
                  <p className="text-muted-foreground text-sm">
                    Track your nutrition and eating habits with comprehensive insights and trends.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Conversation Analysis</p>
                  <p className="text-muted-foreground text-sm">
                    Stop overthinking with AI-powered analysis of your conversations and interactions.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Custom MCP Server</p>
                  <p className="text-muted-foreground text-sm">
                    Create your personal MCP server using Omi memories for enhanced privacy and control.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 w-full items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Intuitive User Experience</p>
                  <p className="text-muted-foreground text-sm">
                    Simple and elegant interface designed for focus on what matters most to you.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Instant Feedback</p>
                  <p className="text-muted-foreground text-sm">
                    Get real-time suggestions and feedback on your queries and conversations.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>AI-Powered Reflections</p>
                  <p className="text-muted-foreground text-sm">
                    Gain deeper insights through intelligent reflections on your health and communication patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature }; 