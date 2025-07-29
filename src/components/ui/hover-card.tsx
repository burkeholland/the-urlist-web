import * as React from "react"
import { cn } from "@/lib/utils"

interface HoverCardProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  sideOffset?: number
  alignOffset?: number
}

const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(
  ({ children, content, side = "bottom", align = "center", className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <div 
        ref={ref}
        className="relative inline-block"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        {...props}
      >
        {children}
        {isOpen && (
          <div
            className={cn(
              "absolute z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95",
              side === "top" && "bottom-full mb-2",
              side === "bottom" && "top-full mt-2",
              side === "left" && "right-full mr-2",
              side === "right" && "left-full ml-2",
              align === "start" && "left-0",
              align === "center" && "left-1/2 -translate-x-1/2",
              align === "end" && "right-0",
              className
            )}
          >
            {content}
          </div>
        )}
      </div>
    )
  }
)

HoverCard.displayName = "HoverCard"

export { HoverCard }