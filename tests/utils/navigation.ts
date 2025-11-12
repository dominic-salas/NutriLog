export function getMockRouter() {
  return globalThis.__TEST_ROUTER__;
}

export function setMockSearchParams(params?: Record<string, string>) {
  globalThis.__setSearchParams__(params);
}

