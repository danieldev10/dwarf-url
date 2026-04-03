const DEFAULT_HEADERS = {
  host: "localhost:3000",
  "x-forwarded-for": "127.0.0.1",
  "x-forwarded-proto": "http",
};

type CookieEntry = {
  options: unknown;
  value: string;
};

class MockCookieStore {
  private entries = new Map<string, CookieEntry>();

  clear() {
    this.entries.clear();
  }

  get(name: string) {
    const entry = this.entries.get(name);

    if (!entry) {
      return undefined;
    }

    return {
      name,
      value: entry.value,
    };
  }

  getValue(name: string) {
    return this.entries.get(name)?.value ?? null;
  }

  set(name: string, value: string, options: unknown = {}) {
    this.entries.set(name, {
      options,
      value,
    });
  }
}

export class RedirectError extends Error {
  destination: string;

  constructor(destination: string) {
    super("Redirected to " + destination);
    this.destination = destination;
    this.name = "RedirectError";
  }
}

export class NotFoundError extends Error {
  constructor() {
    super("Not found");
    this.name = "NotFoundError";
  }
}

const cookieStore = new MockCookieStore();
let headerValues = new Map<string, string>(Object.entries(DEFAULT_HEADERS));

export function getMockCookieStore() {
  return cookieStore;
}

export function getMockHeaderStore() {
  return {
    get(name: string) {
      return headerValues.get(name.toLowerCase()) ?? null;
    },
  };
}

export function getSessionCookieValue() {
  return cookieStore.getValue("dwarfurl_session");
}

export function resetNextMockState() {
  cookieStore.clear();
  headerValues = new Map<string, string>(Object.entries(DEFAULT_HEADERS));
}

export function setMockHeaders(values: Record<string, string>) {
  headerValues = new Map<string, string>(
    Object.entries({
      ...DEFAULT_HEADERS,
      ...values,
    }).map(([key, value]) => [key.toLowerCase(), value]),
  );
}
