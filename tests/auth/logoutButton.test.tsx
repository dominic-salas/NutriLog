import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LogoutButton } from "@/components/logoutButton";
import { getMockRouter } from "../utils/navigation";

const authActions = vi.hoisted(() => ({
  signout: vi.fn(),
}));

vi.mock("@/lib/utils/auth-actions", () => authActions);

describe("LogoutButton", () => {
  beforeEach(() => {
    const router = getMockRouter();
    router.push.mockClear();
    authActions.signout.mockReset();
    authActions.signout.mockImplementation(async () => {
      router.push("/");
    });
  });

  it("redirects the user home after logging out", async () => {
    render(<LogoutButton />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(authActions.signout).toHaveBeenCalledTimes(1);
    expect(getMockRouter().push).toHaveBeenCalledWith("/");
  });
});
