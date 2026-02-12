import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Modèles" },
    { href: "/editor", label: "Éditeur" },
    { href: "/examples", label: "Exemples" },
  ];

  return (
    <header className="border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-50 safe-area-top">
      <div className="container h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center paper-shadow">
            <span className="text-primary-foreground font-bold text-base font-serif">C</span>
          </div>
          <span className="font-semibold text-base tracking-tight">CardCreator</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location === item.href
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            aria-label="Changer le thème"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Link href="/editor">
            <Button size="sm" className="hidden sm:inline-flex font-medium">
              Créer une carte
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                    <span
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors touch-target ${
                        location === item.href
                          ? "text-primary bg-primary/8"
                          : "text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
                <div className="border-t border-border/60 mt-4 pt-4">
                  <Link href="/editor" onClick={() => setOpen(false)}>
                    <Button className="w-full font-medium" size="lg">
                      Créer une carte
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
