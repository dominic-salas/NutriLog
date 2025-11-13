import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MealHistoryTable } from "@/components/meal/MealHistoryTable";
import { MealDetailModal } from "@/components/meal/MealDetailModal";
import { getLatestMockScanRecord } from "../utils/mockDatabase";

describe("Meal history and detail experience", () => {
  it("lists the scanned meal entry inside MealHistoryTable", async () => {
    const { entry } = await waitForLatestScanRecord();
    render(<MealHistoryTable entries={[entry]} onSelect={() => {}} />);

    expect(screen.getByText(entry.date)).toBeInTheDocument();
    expect(screen.getByText(formatTime(entry.time))).toBeInTheDocument();
    expect(screen.getByText(`${entry.health_score}%`)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(entry.description, "i"))).toBeInTheDocument();
  });

  it("opens MealDetailModal with the scan details when a row is selected", async () => {
    const { entry, analysis } = await waitForLatestScanRecord();
    const Harness = () => {
      const [open, setOpen] = useState(false);

      return (
        <>
          <MealHistoryTable
            entries={[entry]}
            onSelect={() => setOpen(true)}
          />
          <MealDetailModal
            open={open}
            entry={entry}
            analysis={open ? analysis : null}
            onClose={() => setOpen(false)}
            onDelete={async () => {}}
            onSave={async () => {}}
          />
        </>
      );
    };

    render(<Harness />);
    const user = userEvent.setup();

    await user.click(screen.getByText(new RegExp(entry.description, "i")));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
});

function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${period}`;
}

async function waitForLatestScanRecord(timeout = 5000) {
  const start = Date.now();
  let record = getLatestMockScanRecord();
  while (!record) {
    if (Date.now() - start > timeout) {
      throw new Error("No scan record found. Run scanFlow.test.tsx first to seed the mock database.");
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
    record = getLatestMockScanRecord();
  }
  return record;
}
