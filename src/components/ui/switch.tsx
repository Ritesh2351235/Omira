import * as React from "react"
import { cn } from "../../lib/utils"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked)
      }
    }

    return (
      <div className={cn("flex items-center", className)}>
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className="peer sr-only"
          {...props}
        />
        <div
          onClick={() => onCheckedChange && onCheckedChange(!checked)}
          className={cn(
            "peer relative h-5 w-10 cursor-pointer rounded-full transition-colors",
            "after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-background after:transition-all",
            checked ? "bg-primary after:translate-x-5" : "bg-input"
          )}
        />
      </div>
    )
  }
)

Switch.displayName = "Switch"

export { Switch } 