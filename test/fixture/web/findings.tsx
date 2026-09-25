// Every finding in this file is intentional; check.mjs expects exactly these.
import { useState } from "react";

export const hilfsfunktion = () => 1;

export function Zaehler({ aktiv }: { aktiv: boolean }) {
  if (aktiv) {
    const [stand] = useState(0);
    return <p>{stand}</p>;
  }
  return null;
}
