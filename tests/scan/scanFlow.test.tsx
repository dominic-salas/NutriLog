import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ScanPage from "@/app/scan/page";
import ScanMeal from "@/components/scanMeal";
import { ScanResultActions } from "@/components/scan/ScanResultActions";
import { ScanResultSummary } from "@/components/scan/ScanResultSummary";
import { getMockRouter } from "../utils/navigation";
import mockHistory from "../.mock-scan-history.json";
import { resetMockScanRecords, saveMockScanRecord, type MockScanRecord } from "../utils/mockDatabase";

const originalFetch = global.fetch;
let fetchMock: ReturnType<typeof vi.fn>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foodImagePath = path.resolve(__dirname, "../assets/foodtest.jpg");

beforeEach(() => {
  fetchMock = vi.fn();
  global.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
});

beforeAll(() => {
  resetMockScanRecords();
});

describe("Scan flow", () => {
  it("lets a signed-in user scan, upload, confirm, and return to history", async () => {
    const router = getMockRouter();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ analysisId: "analysis-123" }),
    });

    const user = userEvent.setup();

    render(<ScanMeal />);
    await user.click(screen.getByRole("button", { name: /scan meal/i }));
    expect(router.push).toHaveBeenCalledWith("/scan");

    router.push.mockClear();
    const { container } = render(<ScanPage />);

    await user.click(screen.getByRole("button", { name: /upload photo/i }));
    const hiddenFileInput = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (!hiddenFileInput) {
      throw new Error("Hidden file input not found");
    }
    const testFile = new File([readFileSync(foodImagePath)], "foodtest.jpg", {
      type: "image/jpeg",
    });
    await user.upload(hiddenFileInput, testFile);

    expect(await screen.findByText(/use this photo/i)).toBeInTheDocument();
    const confirmButton = await screen.findByRole("button", { name: /confirm\s*&\s*scan/i });
    await user.click(confirmButton);

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/scan/result/analysis-123");
    });

    const [desiredRecord] = mockHistory as MockScanRecord[];
    if (!desiredRecord) {
      throw new Error("Fixture .mock-scan-history.json is empty; unable to seed history.");
    }
    const recordClone: MockScanRecord = JSON.parse(JSON.stringify(desiredRecord));
    saveMockScanRecord(recordClone);

    router.push.mockClear();
    render(<ScanResultActions />);
    const viewHistoryLink = screen.getByRole("link", { name: /view history/i });
    await user.click(viewHistoryLink);
    expect(router.push).toHaveBeenCalledWith("/profile");
  });

  it("renders ScanResultSummary for analyzed meals", () => {
    render(
      <ScanResultSummary
        imageUrl="/tests/foodtest.jpg"
        description="Rotini Pasta, Cured Meat, Bell Pepper, Olives and more"
        healthScore={58}
        macros={{
          calories: 525,
          carbs: 54,
          protein: 21,
          fats: 25,
        }}
      />,
    );

    expect(screen.getByRole("img", { name: /Rotini Pasta, Cured Meat, Bell Pepper, Olives and more/i })).toBeInTheDocument();
    expect(screen.getByText(/525 kcal/i)).toBeInTheDocument();
    expect(screen.getByText(/54 g/i)).toBeInTheDocument();
    expect(screen.getByText(/58%/)).toBeInTheDocument();
  });
});
