"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function TopProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState("0%");

  useEffect(() => {
    const timers = [
      window.setTimeout(() => {
        setVisible(true);
        setWidth("10%");
      }, 0),
      window.setTimeout(() => setWidth("80%"), 200),
      window.setTimeout(() => setWidth("100%"), 500),
      window.setTimeout(() => setVisible(false), 800),
      window.setTimeout(() => setWidth("0%"), 1100),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [pathname]);

  return (
    <div
      className="fixed left-0 top-0 z-50 h-0.5 bg-blue-500 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        width,
      }}
    />
  );
}
