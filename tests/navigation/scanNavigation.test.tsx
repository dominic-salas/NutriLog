import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScanMeal from "@/components/scanMeal";
import { ScanResultActions } from "@/components/scan/ScanResultActions";
import { getMockRouter } from "../utils/navigation";

describe("Navigation shortcuts", () => {
  beforeEach(() => {
    getMockRouter().push.mockClear();
  });

  it("routes to /scan when the Scan Meal CTA is clicked", async () => {
    render(<ScanMeal />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /scan meal/i }));

    expect(getMockRouter().push).toHaveBeenCalledWith("/scan");
  });

  it("routes to /scan or /profile via ScanResultActions", async () => {
    render(<ScanResultActions />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("link", { name: /scan another meal/i }));
    expect(getMockRouter().push).toHaveBeenCalledWith("/scan");

    getMockRouter().push.mockClear();

    await user.click(screen.getByRole("link", { name: /view history/i }));
    expect(getMockRouter().push).toHaveBeenCalledWith("/profile");
  });
});

