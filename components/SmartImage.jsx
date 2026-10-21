"use client";
import { useEffect, useRef, useState } from "react";

// <img> with an elegant tonal fallback, so the layout stays premium even if
// a remote photo fails to load. Replace URLs in data/products.json with your
// own photos (e.g. /images/coat-1.jpg in the public folder).
export default function SmartImage({ src, alt = "", tone = "#2a2826", className = "", style, eager = false }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);
  // Catch images that failed before React hydrated (onError would be missed)
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);
  return (
    <div className={`smart-img ${className}`} style={{ background: `linear-gradient(160deg, ${tone}, #141312)`, ...style }}>
      {failed || !src ? (
        <div className="fallback">{alt?.[0] || "A"}</div>
      ) : (
        <img ref={ref} src={src} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} draggable={false} />
      )}
    </div>
  );
}
