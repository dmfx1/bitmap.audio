import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu"; // Assuming NavigationMenu.tsx is here
import { cn } from "@/lib/utils";
import { BitmapIcon } from "./BitmapText"; // Importing the BitmapIcon component for the logo


const solutions = [
  { name: "Sonic Branding", href: "/solutions/sonic-branding", description: "Brand identity through sound" },
  { name: "UI/UX Sound", href: "/solutions/uiux-sound", description: "Sonic interfaces for technology" },
  { name: "Immersive Audio", href: "/solutions/immersive-audio", description: "AR/VR & spatial installations" },
];

const why = [
  { name: "Returns", href: "/the-why/returns", description: "How audio enhances brand identity" },
  { name: "Use Cases", href: "/the-why/use-cases", description: "Working Examples" },
];

const Navigation = ({ currentPath }: { currentPath: string }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO BLOCK */}
          <a href="/" className="flex items-center gap-2 group">
            {/* Replacing the <span>b.</span> with your custom SVG icon */}
            <div className="w-6 h-6 flex items-center justify-center bg-accent">
              <BitmapIcon char="b" className="w-4 h-4 text-primary-foreground" />
            </div>
            
            <span className="font-mono font-light text-foreground group-hover:text-primary transition-colors">
              bitmap<span className="text-accent font-bold">.audio</span>
            </span>
          </a>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList className="gap-8">
                {/* HOME & ABOUT LINKS */}
                <NavigationMenuItem>
                  <a href="/home" className={cn(
                    "font-mono text-sm uppercase tracking-wider link-underline transition-colors",
                    isActive("/home") ? "text-primary hover:text-accent" : "text-muted-foreground hover:text-accent"
                  )}>Home</a>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <a href="/about" className={cn(
                    "font-mono text-sm uppercase tracking-wider link-underline transition-colors",
                    isActive("/about") ? "text-primary hover:text-accent" : "text-muted-foreground hover:text-accent"
                  )}>About</a>
                </NavigationMenuItem>

                {/* SOLUTIONS DROPDOWN (UPDATED FOR ACCENT & SQUARE EDGES) */}
                <NavigationMenuItem className="relative">
                  <NavigationMenuTrigger className={cn(
                    "bg-transparent p-0 h-auto font-mono text-sm uppercase tracking-wider transition-colors rounded-none", // Added rounded-none
                    "hover:bg-transparent hover:text-accent focus:bg-transparent focus:text-accent data-[state=open]:text-accent", // Added accent colors
                    currentPath.startsWith("/solutions") ? "text-primary" : "text-muted-foreground"
                  )}>
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {/* Added rounded-none to the container below */}
                    <div className="w-64 bg-background/75 border border-border shadow-xl flex flex-col rounded-none">
                      {solutions.map((s) => (
                        <a 
                          key={s.href} 
                          href={s.href} 
                          className="group block px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
                        >
                          {/* Text color now switches to primary (teal) or accent (amber) on hover */}
                          <span className="block font-mono text-sm text-foreground group-hover:text-accent transition-colors">
                            {s.name}
                          </span>
                          <span className="block text-[10px] uppercase tracking-tight text-muted-foreground mt-1">
                            {s.description}
                          </span>
                          <div className="h-px w-0 bg-accent transition-all group-hover:w-full mt-2" />
                        </a>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <a href="/returns" className={cn(
                    "font-mono text-sm uppercase tracking-wider link-underline transition-colors",
                    isActive("/returns") ? "text-primary hover:text-accent" : "text-muted-foreground hover:text-accent"
                  )}>Returns</a>
                </NavigationMenuItem>
                
              </NavigationMenuList>
            </NavigationMenu>

            <Button variant="outline" size="sm" asChild className="morph-accent">
              <a href="/contact">Contact</a>
            </Button>
          </div>

          {/* MOBILE TOGGLE */}
          <button className="md:hidden text-foreground" onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MOBILE MENU (Static Click-based) */}
        {isMobileOpen && (
          <div className="md:hidden py-6 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="/home" className="font-mono text-sm uppercase tracking-wider text-muted-foreground hover:text-primary">Home</a>
              <a href="/about" className="font-mono text-sm uppercase tracking-wider text-muted-foreground hover:text-primary">About</a>
              <div className="pt-2 border-t border-border">
                <span className="font-mono text-xs uppercase tracking-wider text-accent">Solutions</span>
                <div className="mt-3 flex flex-col gap-3 pl-4">
                  {solutions.map((s) => (
                    <a key={s.href} href={s.href} className="font-mono text-sm text-foreground hover:text-primary">{s.name}</a>
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