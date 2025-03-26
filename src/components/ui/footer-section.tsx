/* eslint-disable jsx-a11y/anchor-is-valid */
"use client"

import * as React from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Facebook, Instagram, Linkedin, Twitter, Send } from "lucide-react"

function FooterSection() {
  return (
    <footer className="w-full bg-white border-t border-gray">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid gap-12 md:grid-cols-3 lg:gap-16">
          {/* Brand and Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img src="/omira.png" alt="Omira" width={56} height={56} />
              <h2 className="text-3xl font-regular tracking-tight">Omira</h2>
            </div>
            <p className="text-black/80 max-w-xs leading-relaxed">
              Stay ahead with cutting-edge AI insights and exclusive updates.
            </p>
            <form className="flex items-center border border-black rounded-full overflow-hidden max-w-md">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2.5 bg-transparent border-none focus:outline-none text-black"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="p-2.5 hover:bg-black/10"
              >
                <Send className="h-5 w-5 text-black" />
              </Button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black mb-4">Quick Links</h3>
            <nav className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Features", href: "#features" },
                { label: "About", href: "#about" },
                { label: "Pricing", href: "#pricing" },
                { label: "Contact", href: "#contact" }
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-black/80 hover:text-black transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social and Legal */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Connect</h3>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Twitter, label: "Twitter" },
                  { icon: Instagram, label: "Instagram" },
                  { icon: Linkedin, label: "LinkedIn" }
                ].map(({ icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="icon"
                    className="text-black hover:bg-black/10 rounded-full"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex gap-4 text-sm">
                <a href="#" className="text-black/80 hover:text-black transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-black/80 hover:text-black transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray text-center">
          <p className="text-sm text-black/80">
            © {new Date().getFullYear()} Omira AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export { FooterSection }