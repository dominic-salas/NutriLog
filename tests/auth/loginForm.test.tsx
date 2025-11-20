import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/loginForm";
import { getMockRouter, setMockSearchParams } from "../utils/navigation";

const authActions = vi.hoisted(() => ({
  login: vi.fn(),
}));

vi.mock("@/lib/utils/auth-actions", () => authActions);

describe("LoginForm", () => {
  beforeEach(() => {
    setMockSearchParams();
    authActions.login.mockReset();
    getMockRouter().push.mockClear();
    authActions.login.mockImplementation(async () => {
      getMockRouter().push("/profile");
    });
  });

  it("submits email/password to login action", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "automated@test.com");
    await user.type(screen.getByLabelText(/^password$/i), "Test123test");

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(authActions.login).toHaveBeenCalledTimes(1);
    const submitted = authActions.login.mock.calls[0][0] as FormData;
    expect(submitted.get("email")).toBe("automated@test.com");
    expect(submitted.get("password")).toBe("Test123test");
    expect(getMockRouter().push).toHaveBeenCalledWith("/profile");
  });

  it("surfaces auth errors from query string", () => {
    setMockSearchParams({ error: "Too many failed attempts" });
    render(<LoginForm />);
    expect(screen.getByText(/too many failed attempts/i)).toBeInTheDocument();
  });
});
