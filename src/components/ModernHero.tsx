import React from 'react';
import { Badge } from './ui/badge.tsx';
import { Separator } from './ui/separator.tsx';

export function ModernHero() {
  const stats = [
    { number: "10K+", label: "Lists Created" },
    { number: "50K+", label: "Links Shared" },
    { number: "99.9%", label: "Uptime" }
  ];

  const features = [
    {
      icon: "✨",
      title: "Instant Creation",
      description: "Create beautiful link collections in seconds",
      badge: "Easy"
    },
    {
      icon: "🔍", 
      title: "Rich Previews",
      description: "Automatic titles, descriptions, and images",
      badge: "Smart"
    },
    {
      icon: "🔗",
      title: "Custom URLs", 
      description: "Memorable links that represent your brand",
      badge: "Flexible"
    },
    {
      icon: "📱",
      title: "Mobile First",
      description: "Perfect experience on any device",
      badge: "Responsive"
    },
    {
      icon: "🚀",
      title: "Lightning Fast",
      description: "Optimized for speed and performance", 
      badge: "Optimized"
    },
    {
      icon: "🎨",
      title: "Beautiful Design",
      description: "Modern, clean interface that impresses",
      badge: "Premium"
    }
  ];

  return (
    <div className="relative">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-transparent to-blue-50/30 pointer-events-none"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-20">
        {/* Badge announcement */}
        <div className="text-center mb-8">
          <Badge className="px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-teal-500 to-blue-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <span className="mr-2">🎉</span>
            New: Enhanced sharing features now available
          </Badge>
        </div>

        {/* Main hero content */}
        <div className="text-center mb-16 space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">
              Share Your Links
            </span>
            <br />
            <span className="text-gray-900 relative">
              Simply
              <svg 
                className="absolute -bottom-2 left-0 w-full h-3 text-teal-200" 
                viewBox="0 0 400 12" 
                fill="currentColor"
              >
                <path d="M0,8 Q200,2 400,8 Q200,4 0,8 Z" />
              </svg>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create and share beautiful collections of links with an elegant, 
            <span className="text-teal-600 font-semibold"> easy-to-share URL</span>. 
            Perfect for curators, educators, and professionals.
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center gap-8 pt-8">
            {stats.map((stat, index) => (
              <React.Fragment key={stat.label}>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-teal-600">{stat.number}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
                {index < stats.length - 1 && (
                  <Separator orientation="vertical" className="h-8 bg-gray-200" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Features grid with enhanced design */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeIn 0.6s ease-out forwards'
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                    {feature.icon}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-2 py-1 bg-teal-50 text-teal-700 border-teal-200"
                  >
                    {feature.badge}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-teal-700 transition-colors duration-200">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-600 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Trusted by thousands of users worldwide</span>
          </div>
        </div>
      </div>
    </div>
  );
}