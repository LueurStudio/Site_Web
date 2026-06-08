"use client";

import { useEffect, useRef, useState } from "react";

export default function BeforeAfter() {
  const [pos, setPos] = useState(52);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef(false);

  const move = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let p = ((clientX - r.left) / r.width) * 100;
    p = Math.max(2, Math.min(98, p));
    setPos(p);
  };

  useEffect(() => {
    const up = () => (drag.current = false);
    const mv = (e: MouseEvent | TouchEvent) => {
      if (!drag.current) return;
      const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      move(x);
    };
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    window.addEventListener("mousemove", mv);
    window.addEventListener("touchmove", mv, { passive: false });
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("touchmove", mv);
    };
  }, []);

  const width = wrapRef.current ? wrapRef.current.getBoundingClientRect().width : undefined;

  return (
    <div
      ref={wrapRef}
      className="frame ratio-32"
      style={{ cursor: "ew-resize", userSelect: "none" }}
      onMouseDown={(e) => { drag.current = true; move(e.clientX); }}
      onTouchStart={(e) => { drag.current = true; move(e.touches[0].clientX); }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/apres.webp" alt="Après retouche" style={{ position: "absolute", inset: 0 }} draggable={false} />
      <div style={{ position: "absolute", inset: 0, width: pos + "%", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/avant.webp"
          alt="Avant retouche"
          draggable={false}
          style={{ position: "absolute", top: 0, left: 0, height: "100%", width, maxWidth: "none", objectFit: "cover" }}
        />
      </div>
      <span className="pill" style={{ position: "absolute", top: 16, left: 16, background: "rgba(8,6,5,0.7)" }}>Avant</span>
      <span className="pill" style={{ position: "absolute", top: 16, right: 16, background: "rgba(8,6,5,0.7)" }}>Après</span>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: pos + "%", width: 1.5, background: "var(--accent)", transform: "translateX(-50%)" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 44, height: 44,
          border: "1.5px solid var(--accent)",
          background: "rgba(8,6,5,0.6)",
          display: "grid", placeItems: "center",
          color: "var(--accent)",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
