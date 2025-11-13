import fs from "node:fs";
import path from "node:path";
import type { MealHistoryEntry } from "@/components/meal/MealHistoryTable";
import type { MealDetailModalProps } from "@/components/meal/MealDetailModal";

export type MockScanRecord = {
  entry: MealHistoryEntry & { macros?: number[] | null };
  analysis: NonNullable<MealDetailModalProps["analysis"]>;
};

const dbPath = path.resolve(__dirname, "../.mock-scan-history.json");

export function resetMockScanRecords() {
  writeDb([]);
}

export function saveMockScanRecord(record: MockScanRecord) {
  const records = readDb();
  records.unshift(record);
  writeDb(records);
}

export function getLatestMockScanRecord() {
  return readDb()[0] ?? null;
}

export function getAllMockScanRecords() {
  return readDb();
}

function readDb(): MockScanRecord[] {
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(raw) as MockScanRecord[];
  } catch {
    return [];
  }
}

function writeDb(records: MockScanRecord[]) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(records, null, 2), "utf-8");
}
