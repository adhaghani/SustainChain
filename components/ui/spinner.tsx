import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

interface SpinnerProps extends Omit<React.ComponentProps<"svg">, "strokeWidth"> {
  size?: number;
}

function Spinner({ className, size = 16, ...props }: SpinnerProps) {
  return (
    <HugeiconsIcon 
      icon={Loading03Icon} 
      strokeWidth={2} 
      role="status" 
      aria-label="Loading" 
      className={cn("animate-spin", className)} 
      style={{ width: size, height: size }}
      {...props} 
    />
  )
}

export { Spinner }


