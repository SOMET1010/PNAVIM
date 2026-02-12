import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Moon, Heart } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useState } from "react";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { count } = useFavorites();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Modèles" },
    { href: "/editor", label: "Éditeur" },
    { href: "/examples", label: "Exemples" },
    { href: "/favorites", label: "Favoris", badge: count },
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
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 ${
                  location === item.href
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.href === "/favorites" && (
                  <Heart
                    className={`h-3.5 w-3.5 ${
                      location === "/favorites"
                        ? "text-destructive fill-destructive"
                        : count > 0
                          ? "text-destructive/70 fill-destructive/70"
                          : ""
                    }`}
                  />
                )}
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold rounded-full bg-destructive text-destructive-foreground leading-none">
                    {item.badge}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Favorites shortcut — mobile */}
          <Link href="/favorites">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 md:hidden"
              aria-label="Mes favoris"
            >
              <Heart
                className={`h-4 w-4 ${
                  count > 0 ? "text-destructive fill-destructive" : ""
                }`}
              />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-0.5 text-[9px] font-bold rounded-full bg-destructive text-destructive-foreground flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </Button>
          </Link>

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
                      className={`flex items-center gap-2.5 px-4 py-3 text-base font-medium rounded-xl transition-colors touch-target ${
                        location === item.href
                          ? "text-primary bg-primary/8"
                          : "text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item.href === "/favorites" && (
                        <Heart
                          className={`h-4 w-4 ${
                            count > 0 ? "text-destructive fill-destructive" : "text-muted-foreground"
                          }`}
                        />
                      )}
                      {item.label}
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-[11px] font-semibold rounded-full bg-destructive text-destructive-foreground">
                          {item.badge}
                        </span>
                      )}
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
