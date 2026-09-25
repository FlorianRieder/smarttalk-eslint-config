// Must lint without a single message. Covers syntax the parser has to know.
export enum Kursart {
  Gruppe = "gruppe",
  Einzel = "einzel",
}

export interface Kurs {
  readonly id: string;
  kursart: Kursart;
  plaetze?: number;
}

const standard = { id: "k-1", kursart: Kursart.Gruppe } satisfies Kurs;

export function istKurs(value: unknown): value is Kurs {
  return typeof value === "object" && value !== null && "id" in value;
}

export function erstes<const T extends readonly unknown[]>(liste: T): T[0] | undefined {
  return liste[0];
}

export class Zaehler {
  #stand = 0;

  erhoehen(_grund?: string): number {
    this.#stand += 1;
    return this.#stand;
  }
}

export async function ladePlaetze(kurs: Kurs = standard): Promise<number> {
  await Promise.resolve();
  return kurs.plaetze ?? 0;
}
