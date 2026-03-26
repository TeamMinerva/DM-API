import React, { useEffect, useRef, useState } from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  footerText: string;
  borderColor: string;
}

const useCountUp = (rawValue: string | number, duration = 800) => {
  const [display, setDisplay] = useState<string | number>(
    typeof rawValue === 'number' ? 0 : rawValue
  )
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (typeof rawValue === 'number') {
      const start = performance.now()
      const animate = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.floor(eased * rawValue))
        if (progress < 1) frameRef.current = requestAnimationFrame(animate)
        else setDisplay(rawValue)
      }
      frameRef.current = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(frameRef.current)
    }

    const numMatch = rawValue.match(/([\d.,]+)/)
    if (!numMatch) return

    const numStr = numMatch[1].replace(',', '.')
    const target = parseFloat(numStr)
    if (isNaN(target)) return

    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target

      const formatted = rawValue.replace(
        numStr,
        Number.isInteger(target)
          ? Math.floor(current).toString()
          : current.toFixed(1)
      )
      setDisplay(formatted)
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
      else setDisplay(rawValue)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [rawValue, duration])

  return display
}

const renderValue = (value: string | number) => {
  if (typeof value === 'number') {
    return <>{value.toLocaleString('pt-BR')}</>
  }

  const match = value.match(/^(R)(\$)(.*)$/)
  if (match) {
    return (
      <>
        {match[1]}
        <span className="font-[Arial] text-[34px]">{match[2]}</span>
        {match[3]}
      </>
    )
  }

  return <>{value}</>
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, footerText, borderColor }) => {
  const animated = useCountUp(value)

  return (
    <div
      className="w-full h-[185px] bg-[#F1EFFF] rounded-[20px] flex flex-col p-6 box-border font-[Catamaran]"
      style={{ borderTop: `5px solid ${borderColor}` }}
    >
      <span className="text-xl font-semibold leading-none text-[#7B7E86] mb-3 block">
        {label}
      </span>
      <span className="text-[36px] font-semibold leading-none text-[#1E1E1E] mb-auto block mt-4">
        {renderValue(animated)}
      </span>
      <span className="text-lg font-semibold leading-none text-[#7B7E86] block">
        {footerText}
      </span>
    </div>
  )
}

export default KpiCard