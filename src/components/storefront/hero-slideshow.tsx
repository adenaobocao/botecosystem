"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = ["/hero-1.png", "/hero-2.png", "/hero-3.png"];

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {slides.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
          quality={80}
          priority={i === 0}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
    </>
  );
}
