"use client";

import { useEffect, useState } from "react";

interface Props {
  value: number;
  duration?: number;
}

export default function AnimatedCounter({ value, duration = 800 }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime || 1);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}
