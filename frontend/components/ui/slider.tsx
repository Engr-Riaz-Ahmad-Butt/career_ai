"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
    value?: number[]
    defaultValue?: number[]
    onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
        const val = value ? value[0] : (defaultValue ? defaultValue[0] : 0)

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = parseFloat(e.target.value)
            onValueChange?.([newValue])
        }

        const percentage = ((val - Number(min)) / (Number(max) - Number(min))) * 100

        return (
            <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
                <input
                    type="range"
                    ref={ref}
                    min={min}
                    max={max}
                    step={step}
                    value={val}
                    onChange={handleChange}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                    style={{
                        background: `linear-gradient(to right, #4f46e5 ${percentage}%, #e2e8f0 ${percentage}%)`
                    }}
                    {...props}
                />
                <style jsx>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background: #ffffff;
            border: 2px solid #4f46e5;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          input[type='range']::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #ffffff;
            border: 2px solid #4f46e5;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
        `}</style>
            </div>
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
