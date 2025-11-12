import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupForm from "@/components/signupForm";
import { getMockRouter, setMockSearchParams } from "../utils/navigation";

const authActions = vi.hoisted(() => ({
  signup: vi.fn(),
  signInWithGoogle: vi.fn(),
}));

vi.mock("@/lib/utils/auth-actions", () => authActions);

describe("SignupForm", () => {
  beforeEach(() => {
    setMockSearchParams();
    authActions.signup.mockReset();
    getMockRouter().push.mockClear();
    authActions.signup.mockImplementation(async () => {
      getMockRouter().push("/profile");
    });
  });

  it("submits the expected payload to signup action", async () => {
    render(<SignupForm />);
    const user = userEvent.setup();
    
    await user.type(screen.getByLabelText(/first name/i), "Automated");
    await user.type(screen.getByLabelText(/last name/i), "Tester");
    await user.type(screen.getByLabelText(/email/i), "automated@test.com");
    await user.type(screen.getByLabelText(/^password$/i), "Test123test");
    await user.type(screen.getByLabelText(/confirm password/i), "Test123test");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(authActions.signup).toHaveBeenCalledTimes(1);
    const submitted = authActions.signup.mock.calls[0][0] as FormData;
    expect(submitted.get("first-name")).toBe("Automated");
    expect(submitted.get("last-name")).toBe("Tester");
    expect(submitted.get("email")).toBe("automated@test.com");
    expect(submitted.get("password")).toBe("Test123test");
    expect(submitted.get("confirm-password")).toBe("Test123test");
    expect(getMockRouter().push).toHaveBeenCalledWith("/profile");
  });
});
