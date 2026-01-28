import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const solutions = [
  { name: "Sonic Branding", href: "/solutions/sonic-branding", description: "Brand identity through sound" },
  { name: "UI/UX Sound", href: "/solutions/uiux-sound", description: "Sonic interfaces for technology" },
  { name: "Immersive Audio", href: "/solutions/immersive-audio", description: "AR/VR & spatial installations" },
];

interface NavigationProps {
  currentPath: string;
}

const Navigation = ({ currentPath }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  const isActive = (path: string) => currentPath === path;
  const isSolutionsActive = currentPath.startsWith("/solutions");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Standard <a> tag */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-mono text-xs font-bold">b.</span>
            </div>
            <span className="font-mono text-lg font-medium text-foreground group-hover:text-primary transition-colors">
              bitmap<span className="text-primary">.audio</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/home" className={`font-mono text-sm uppercase morph-accent tracking-wider link-underline transition-colors ${isActive("/home") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              Home
            </a>
            <a href="/about" className={`font-mono text-sm uppercase morph-accent  tracking-wider link-underline transition-colors ${isActive("/about") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              About
            </a>

            <div className="relative" onMouseEnter={() => setSolutionsOpen(true)} onMouseLeave={() => setSolutionsOpen(false)}>
              <button className={`flex items-center gap-1 font-mono text-sm uppercase morph-accent  tracking-wider transition-colors ${isSolutionsActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                Solutions <ChevronDown className={`w-4 h-4 transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
              </button>

              {solutionsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-popover border border-border shadow-xl">
                  {solutions.map((s) => (
                    <a key={s.href} href={s.href} className="block px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0">
                      <span className="block font-mono text-sm text-foreground">{s.name}</span>
                      <span className="block text-xs text-muted-foreground mt-1">{s.description}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Button variant="outline" size="sm" asChild className="morph-accent">
              <a href="/contact">Contact</a>
            </Button>
          </div>

          {/* Mobile Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="/home" className="font-mono text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">Home</a>
              <a href="/about" className="font-mono text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">About</a>
              <div className="pt-2 border-t border-border">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Solutions</span>
                <div className="mt-3 flex flex-col gap-3 pl-4">
                  {solutions.map((s) => (
                    <a key={s.href} href={s.href} className="font-mono text-sm text-foreground hover:text-primary transition-colors">{s.name}</a>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-fit" asChild>
                <a href="/contact">Contact</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;