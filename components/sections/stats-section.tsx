"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  { value: 83, label: "га — собственный питомник", suffix: "" },
  { value: 25000, label: "га — лесовосстановление", prefix: "до ", suffix: "" },
  { value: 1, label: "Казахстан — фокус проекта", suffix: "", isText: true },
  {
    value: 1,
    label: "Поэтапная реализация",
    suffix: "",
    isText: true,
    textValue: "Поэтапная",
  },
]

function useCountUp(end: number, duration = 2000, isInView = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, isInView])

  return count
}

function StatCard({ stat, delay }: { stat: any; delay: number }) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = useCountUp(stat.value, 2000, isInView)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="text-center animate-fade-in-up" style={{ animationDelay: `${delay}s` }}>
      <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
        {stat.isText
          ? stat.textValue || stat.label.split(" ")[0]
          : `${stat.prefix || ""}${count.toLocaleString()}${stat.suffix || ""}`}
      </div>
      <p className="text-muted-foreground text-sm md:text-base">
        {stat.isText ? stat.label.split(" ").slice(1).join(" ") : stat.label}
      </p>
    </div>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 bg-emerald-50 dark:bg-emerald-950/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Масштаб проекта</h2>
          <p className="text-lg text-muted-foreground text-pretty">Реальные цифры нашей работы</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
