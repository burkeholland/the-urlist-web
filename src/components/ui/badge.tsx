import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = {
  default: "inline-flex items-center rounded-full border-transparent bg-teal-600 px-2.5 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2",
  secondary: "inline-flex items-center rounded-full border-transparent bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-200",
  destructive: "inline-flex items-center rounded-full border-transparent bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-red-600",
  outline: "inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-50",
  success: "inline-flex items-center rounded-full border-transparent bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-green-600",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants[variant], className)} {...props} />
  )
}

export { Badge, badgeVariants }