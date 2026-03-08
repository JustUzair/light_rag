import { SCRAMBLE_CHARS } from "@/lib/data";
import { useState, useEffect } from "react";

export default function ScrambleOnMount({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(() =>
    text
      .split("")
      .map(ch =>
        ch === " "
          ? " "
          : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
      )
      .join(""),
  );
  useEffect(() => {
    const t = setTimeout(() => {
      let iter = 0;
      const iv = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              if (i < iter) return text[i];
              return SCRAMBLE_CHARS[
                Math.floor(Math.random() * SCRAMBLE_CHARS.length)
              ];
            })
            .join(""),
        );
        if (iter >= text.length) clearInterval(iv);
        iter += 0.65;
      }, 22);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);

  return <span className={className}>{display}</span>;
}
