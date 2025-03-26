import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRightIcon } from "lucide-react";
import { Mockup, MockupFrame } from "../ui/mockup";
import { Glow } from "../ui/glow";
import { cn } from "../../lib/utils";
import './hero.css';

interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "glow";
}

interface HeroProps {
  badge?: {
    text: string;
    action: {
      text: string;
      href: string;
    };
  };
  title: string;
  description: string;
  actions: HeroAction[];
  image?: {
    src: string;
    alt: string;
  } | null;
}

export function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
}: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-background pt-56 pb-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Badge */}
          {badge && (
            <Badge variant="outline" className="animate-appear gap-2 mb-4">
              <span className="text-muted-foreground">{badge.text}</span>
              <a href={badge.action.href} className="flex items-center gap-1">
                {badge.action.text}
                <ArrowRightIcon className="h-3 w-3" />
              </a>
            </Badge>
          )}

          {/* Title */}
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white animate-appear">
            {title}
          </h1>

          {/* Description */}
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 animate-appear opacity-0 delay-100">
            {description}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-appear opacity-0 delay-200">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                size="lg"
                className={cn(
                  "rounded-full transition-transform hover:scale-105",
                  action.variant === "glow" && "bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25"
                )}
                asChild
              >
                <a href={action.href} className="flex items-center gap-2">
                  {action.icon}
                  {action.text}
                </a>
              </Button>
            ))}
          </div>

          {/* Image with Glow */}
          {image && (
            <div className="relative w-full max-w-6xl mt-16 animate-appear opacity-0 delay-300">
              <MockupFrame className="w-full" size="small">
                <Mockup type="responsive">
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={1248}
                    height={765}
                    className="w-full h-auto"
                  />
                </Mockup>
              </MockupFrame>
              <Glow
                variant="top"
                className="animate-appear-zoom opacity-0 delay-400"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export type { HeroProps, HeroAction };