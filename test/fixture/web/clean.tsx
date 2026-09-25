// Must lint without a single message.
import { useEffect, useState } from "react";

export function Uhr({ intervallMs }: { intervallMs: number }) {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTicks((t) => t + 1), intervallMs);
    return () => clearInterval(id);
  }, [intervallMs]);

  return <p>{ticks}</p>;
}
