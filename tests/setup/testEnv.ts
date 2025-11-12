import "@testing-library/jest-dom/vitest";
import "whatwg-fetch";
import React, { type ComponentPropsWithoutRef, type FormEvent } from "react";
import { vi, beforeEach } from "vitest";

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
};

let searchParams = new URLSearchParams();

const updateSearchParams = (entries?: Record<string, string>) => {
  searchParams = new URLSearchParams(entries ?? {});
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => ({
    get: (key: string) => searchParams.get(key),
    toString: () => searchParams.toString(),
    entries: () => searchParams.entries(),
  }),
  redirect: vi.fn(),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    alt,
    fill: _fill,
    priority: _priority,
    ...rest
  }: ComponentPropsWithoutRef<"img"> & { fill?: boolean; priority?: boolean }) =>
    React.createElement("img", {
      ...rest,
      alt: alt ?? "",
    }),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    onClick,
    ...rest
  }: {
    href: string | { pathname?: string };
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  }) => {
    const url = typeof href === "string" ? href : href?.pathname ?? "/";
    return React.createElement(
      "a",
      {
        ...rest,
        href: url,
        onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          mockRouter.push(url);
        },
      },
      children,
    );
  },
}));

vi.mock("next/form", () => ({
  __esModule: true,
  default: ({
    action,
    children,
    onSubmit,
    ...rest
  }: {
    action?: (formData: FormData) => unknown;
    children: React.ReactNode;
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
    [key: string]: unknown;
  }) =>
    React.createElement(
      "form",
      {
        ...rest,
        onSubmit: (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          if (typeof action === "function") {
            const formData = new FormData(event.currentTarget);
            action(formData);
          }
          onSubmit?.(event);
        },
      },
      children,
    ),
}));

const getUserMediaMock = vi.fn().mockResolvedValue({
  getTracks: () => [
    {
      stop: vi.fn(),
    },
  ],
});

Object.defineProperty(navigator, "mediaDevices", {
  value: {
    getUserMedia: getUserMediaMock,
  },
  configurable: true,
});

if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = ((contextId: string) => {
    if (contextId === "2d") {
      return {
        drawImage: vi.fn(),
        fillRect: vi.fn(),
        getImageData: vi.fn(),
      } as unknown as CanvasRenderingContext2D;
    }
    return null;
  }) as HTMLCanvasElement["getContext"];
}

Object.defineProperty(HTMLMediaElement.prototype, "play", {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined),
});

Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  configurable: true,
  value: vi.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, "srcObject", {
  configurable: true,
  get() {
    return (this as unknown as { __srcObject?: MediaStream }).__srcObject ?? null;
  },
  set(value) {
    (this as unknown as { __srcObject?: MediaStream }).__srcObject = value ?? null;
  },
});

(globalThis as unknown as TestGlobals).__TEST_ROUTER__ = mockRouter;
(globalThis as unknown as TestGlobals).__setSearchParams__ = updateSearchParams;
(globalThis as unknown as TestGlobals).__getUserMediaMock__ = getUserMediaMock;

beforeEach(() => {
  updateSearchParams();
  Object.values(mockRouter).forEach((fn) => {
    if (typeof fn === "function" && "mockClear" in fn) {
      (fn as ReturnType<typeof vi.fn>).mockClear();
    }
  });
  getUserMediaMock.mockClear();
});

type TestGlobals = {
  __TEST_ROUTER__: typeof mockRouter;
  __setSearchParams__: typeof updateSearchParams;
  __getUserMediaMock__: typeof getUserMediaMock;
};

declare global {
  // eslint-disable-next-line no-var
  var __TEST_ROUTER__: typeof mockRouter;
  // eslint-disable-next-line no-var
  var __setSearchParams__: typeof updateSearchParams;
  // eslint-disable-next-line no-var
  var __getUserMediaMock__: typeof getUserMediaMock;
}

export {};
