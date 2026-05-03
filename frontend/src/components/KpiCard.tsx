import React, { useEffect, useRef, useState } from "react"

interface KpiCardProps {
  label: string
  value: string | number
  footerText: string
  borderColor: string
  footerColor?: string
}

const useCountUp = (rawValue: string | number, duration = 800) => {
  const [display, setDisplay] = useState<string | number>(
    typeof rawValue === "number" ? 0 : rawValue
  )

  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (typeof rawValue === "number") {
      const start = performance.now()

      const animate = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)

        setDisplay(Math.floor(eased * rawValue))

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate)
        } else {
          setDisplay(rawValue)
        }
      }

      frameRef.current = requestAnimationFrame(animate)

      return () => cancelAnimationFrame(frameRef.current)
    }

    const numMatch = rawValue.match(/([\d.,]+)/)
    if (!numMatch) {
      setDisplay(rawValue)
      return
    }

    const originalNumber = numMatch[1]
    const target = parseFloat(originalNumber.replace(",", "."))

    if (isNaN(target)) {
      setDisplay(rawValue)
      return
    }

    const start = performance.now()

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target

      const formattedNumber = Number.isInteger(target)
        ? Math.floor(current).toString()
        : current.toFixed(1).replace(".", ",")

      setDisplay(rawValue.replace(originalNumber, formattedNumber))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setDisplay(rawValue)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameRef.current)
  }, [rawValue, duration])

  return display
}

const renderValue = (value: string | number) => {
  if (typeof value === "number") {
    return <>{value.toLocaleString("pt-BR")}</>
  }

  const match = value.match(/^(R)(\$)(.*)$/)

  if (match) {
    return (
      <>
        {match[1]}
        <span className="font-[Arial] text-[26px]">{match[2]}</span>
        {match[3]}
      </>
    )
  }

  return <>{value}</>
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  footerText,
  borderColor,
  footerColor = "#7B7E86",
}) => {
  const animated = useCountUp(value)

  return (
    <div
      className="
        w-full
        min-h-[142px]
        rounded-[16px]
        bg-[#F1EFFF]
        px-5
        py-6
        box-border
        font-[Catamaran]
        flex
        flex-col
        justify-between
        overflow-hidden
      "
      style={{ borderTop: `4px solid ${borderColor}` }}
    >
      <span className="text-[15px] font-semibold leading-none text-[#7B7E86]">
        {label}
      </span>

      <span className="text-[26px] font-bold leading-none text-[#1E1E1E]">
        {renderValue(animated)}
      </span>

      <span
        className="text-[13px] font-semibold leading-none"
        style={{ color: footerColor }}
      >
        {footerText}
      </span>
    </div>
  )
}

export default KpiCard
