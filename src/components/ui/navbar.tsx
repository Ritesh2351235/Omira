import * as React from "react"
import { Button } from "./button"

function Navbar() {
  return (
    <nav className="fixed top-0 w-[90%] z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-full">
      <div className="container flex h-16 items-center px-4">
        <div className="flex gap-2 items-center">
          <img src="/omira.png" alt="Omira" width={32} height={32} />
          <span className="text-lg font-semibold tracking-tight">Omira</span>
        </div>

        <div className="flex-1" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 mr-6">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Features
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            About
          </a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Pricing
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4 text-sm transition-colors">
          <Button variant="outline" asChild className="text-gray">
            <a href="/signin">Signin</a>
          </Button>
          <Button asChild className="text-gray">
            <a href="/signup">Signup</a>
          </Button>
        </div>
      </div>
    </nav>
  )
}

export { Navbar } 