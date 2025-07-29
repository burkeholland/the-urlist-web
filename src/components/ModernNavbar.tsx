import React from 'react';
import { Badge } from './ui/badge.tsx';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from './ui/navigation-menu.tsx';
import { HoverCard } from './ui/hover-card.tsx';

interface ModernNavbarProps {
  currentPath?: string;
}

export function ModernNavbar({ currentPath = '/' }: ModernNavbarProps) {
  const navigationItems = [
    {
      title: "My Lists",
      href: "/",
      description: "Create and manage your link collections"
    },
    {
      title: "About", 
      href: "/about",
      description: "Learn more about The Urlist"
    },
    {
      title: "Terms",
      href: "/terms", 
      description: "Privacy policy and terms of service"
    }
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="group flex items-center gap-3 text-xl font-bold text-teal-600 hover:text-teal-500 transition-all duration-200"
          >
            <div className="relative">
              <img 
                src="/favicon.svg" 
                alt="" 
                className="w-8 h-8 transition-transform duration-200 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-teal-600/20 rounded-full scale-0 group-hover:scale-125 transition-transform duration-300"></div>
            </div>
            <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              The Urlist
            </span>
            <Badge variant="secondary" className="text-xs px-2 py-0.5 ml-1">
              Beta
            </Badge>
          </a>

          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <HoverCard
                    content={
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    }
                    side="bottom"
                    align="center"
                  >
                    <NavigationMenuLink
                      href={item.href}
                      active={currentPath === item.href}
                      className={`
                        relative px-4 py-2 text-sm font-medium transition-all duration-200
                        text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded-lg
                        ${currentPath === item.href 
                          ? 'text-teal-600 bg-teal-50 border border-teal-200' 
                          : 'hover:shadow-sm'
                        }
                      `}
                    >
                      {item.title}
                      {currentPath === item.href && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-600 rounded-full"></div>
                      )}
                    </NavigationMenuLink>
                  </HoverCard>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Action Button */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden sm:flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs">Live</span>
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  );
}