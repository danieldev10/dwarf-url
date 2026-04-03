import { describe, expect, it, vi } from "vitest";

import ShortCodePage from "@/app/[shortCode]/page";
import { createShortLink } from "@/app/create/actions";
import { deleteShortLink, updateShortLinkTitle } from "@/app/library/actions";
import { login, signup } from "@/app/login/actions";
import { createSession, getCurrentUser, hashPassword } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { normalizeOriginalUrl } from "@/lib/short-links";

import { createTestEmail } from "./support/database";
import {
  RedirectError,
  getSessionCookieValue,
  setMockHeaders,
} from "./support/next-test-context";

function buildFormData(values: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}

async function expectRedirect(result: Promise<unknown>) {
  try {
    await result;
  } catch (error) {
    if (error instanceof RedirectError) {
      return error.destination;
    }

    throw error;
  }

  throw new Error("Expected the action to redirect.");
}

describe("App flows", () => {
  it("rejects malformed scheme-like URLs", () => {
    expect(() => normalizeOriginalUrl("httptp//ralyd.co")).toThrow(
      "Enter a valid http or https URL.",
    );
  });

  it("signs up a user, creates a session, and redirects to the library", async () => {
    const email = createTestEmail();

    const destination = await expectRedirect(
      signup(
        buildFormData({
          email,
          password: "password123",
        }),
      ),
    );

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        sessions: true,
      },
    });

    expect(destination).toBe("/library");
    expect(user?.passwordHash).toBeTruthy();
    expect(user?.sessions).toHaveLength(1);
    expect(getSessionCookieValue()).toBeTruthy();
  });

  it("does not let signup claim an existing user row without a password", async () => {
    const email = createTestEmail();

    await prisma.user.create({
      data: {
        email,
      },
    });

    const destination = await expectRedirect(
      signup(
        buildFormData({
          email,
          password: "password123",
        }),
      ),
    );
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        sessions: true,
      },
    });

    expect(destination).toBe(
      "/signup?error=We%20couldn't%20create%20that%20account.%20If%20you've%20already%20signed%20up%2C%20try%20signing%20in.",
    );
    expect(user?.passwordHash).toBeNull();
    expect(user?.sessions).toHaveLength(0);
    expect(getSessionCookieValue()).toBeNull();
  });

  it("logs in an existing user and creates a new session", async () => {
    const email = createTestEmail();
    const passwordHash = await hashPassword("password123");
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    const destination = await expectRedirect(
      login(
        buildFormData({
          email,
          password: "password123",
        }),
      ),
    );

    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
      },
    });

    expect(destination).toBe("/library");
    expect(sessions).toHaveLength(1);
    expect(getSessionCookieValue()).toBeTruthy();
  });

  it("clears the session cookie when the cookie points to a missing session", async () => {
    const user = await prisma.user.create({
      data: {
        email: createTestEmail(),
        passwordHash: await hashPassword("password123"),
      },
    });

    await createSession(user.id);
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const currentUser = await getCurrentUser();

    expect(currentUser).toBeNull();
    expect(getSessionCookieValue()).toBe("");
  });

  it("clears the session cookie and deletes expired sessions", async () => {
    const user = await prisma.user.create({
      data: {
        email: createTestEmail(),
        passwordHash: await hashPassword("password123"),
      },
    });

    await createSession(user.id);
    await prisma.session.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    const currentUser = await getCurrentUser();
    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
      },
    });

    expect(currentUser).toBeNull();
    expect(getSessionCookieValue()).toBe("");
    expect(sessions).toHaveLength(0);
  });

  it("uses the same login error for a wrong password and an unknown email", async () => {
    const email = createTestEmail();
    const passwordHash = await hashPassword("password123");

    await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    const wrongPasswordDestination = await expectRedirect(
      login(
        buildFormData({
          email,
          password: "wrong-password",
        }),
      ),
    );
    const unknownEmailDestination = await expectRedirect(
      login(
        buildFormData({
          email: createTestEmail(),
          password: "wrong-password",
        }),
      ),
    );

    expect(wrongPasswordDestination).toBe(
      "/login?error=Incorrect%20email%20or%20password.",
    );
    expect(unknownEmailDestination).toBe(
      "/login?error=Incorrect%20email%20or%20password.",
    );
  });

  it("rate limits repeated login attempts from the same request fingerprint", async () => {
    const email = createTestEmail();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const destination = await expectRedirect(
        login(
          buildFormData({
            email,
            password: "wrong-password",
          }),
        ),
      );

      expect(destination).toBe(
        "/login?error=Incorrect%20email%20or%20password.",
      );
    }

    const rateLimitedDestination = await expectRedirect(
      login(
        buildFormData({
          email,
          password: "wrong-password",
        }),
      ),
    );

    expect(rateLimitedDestination).toBe(
      "/login?error=Too%20many%20attempts.%20Please%20wait%20a%20few%20minutes%20and%20try%20again.",
    );
  });

  it("creates a short link for the signed-in user", async () => {
    const email = createTestEmail();
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword("password123"),
      },
    });

    await createSession(user.id);

    const destination = await expectRedirect(
      createShortLink(
        buildFormData({
          originalUrl: "example.com/docs",
          title: "Docs",
        }),
      ),
    );
    const link = await prisma.shortLink.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    expect(destination).toBe("/library?message=Short%20link%20created.");
    expect(link?.title).toBe("Docs");
    expect(link?.originalUrl).toBe("https://example.com/docs");
    expect(link?.shortCode).toHaveLength(7);
  });

  it("updates a link title and preserves the current library filters in the redirect", async () => {
    const user = await prisma.user.create({
      data: {
        email: createTestEmail(),
        passwordHash: await hashPassword("password123"),
      },
    });
    const link = await prisma.shortLink.create({
      data: {
        originalUrl: "https://example.com/edit",
        shortCode: "Edt234X",
        title: "Old title",
        userId: user.id,
      },
    });

    await createSession(user.id);

    const destination = await expectRedirect(
      updateShortLinkTitle(
        buildFormData({
          linkId: link.id,
          page: "2",
          query: "docs",
          sort: "oldest",
          title: "New title",
        }),
      ),
    );
    const updatedLink = await prisma.shortLink.findUnique({
      where: {
        id: link.id,
      },
    });

    expect(destination).toBe(
      "/library?query=docs&sort=oldest&message=Link+title+updated.",
    );
    expect(updatedLink?.title).toBe("New title");
  });

  it("deletes a link and preserves the current library filters in the redirect", async () => {
    const user = await prisma.user.create({
      data: {
        email: createTestEmail(),
        passwordHash: await hashPassword("password123"),
      },
    });
    const link = await prisma.shortLink.create({
      data: {
        originalUrl: "https://example.com/delete",
        shortCode: "Del234X",
        title: "Delete me",
        userId: user.id,
      },
    });

    await createSession(user.id);

    const destination = await expectRedirect(
      deleteShortLink(
        buildFormData({
          linkId: link.id,
          page: "3",
          query: "delete",
          sort: "most-clicked",
        }),
      ),
    );
    const deletedLink = await prisma.shortLink.findUnique({
      where: {
        id: link.id,
      },
    });

    expect(destination).toBe(
      "/library?query=delete&sort=most-clicked&message=Link+deleted.",
    );
    expect(deletedLink).toBeNull();
  });

  it("clamps the redirect page after deleting the last item on a later page", async () => {
    const user = await prisma.user.create({
      data: {
        email: createTestEmail(),
        passwordHash: await hashPassword("password123"),
      },
    });

    const links = await Promise.all(
      Array.from({ length: 9 }, (_, index) =>
        prisma.shortLink.create({
          data: {
            originalUrl: `https://example.com/page-${index + 1}`,
            shortCode: `Pg${String(index).padStart(2, "0")}XyZ`,
            title: `Page ${index + 1}`,
            userId: user.id,
          },
        }),
      ),
    );

    await createSession(user.id);

    const destination = await expectRedirect(
      deleteShortLink(
        buildFormData({
          linkId: links[0].id,
          page: "2",
          query: "",
          sort: "newest",
        }),
      ),
    );

    expect(destination).toBe("/library?message=Link+deleted.");
  });

  it("redirects a short link and increments the click count", async () => {
    const user = await prisma.user.create({
      data: {
        email: createTestEmail(),
        passwordHash: await hashPassword("password123"),
      },
    });
    const link = await prisma.shortLink.create({
      data: {
        originalUrl: "https://example.com/post",
        shortCode: "Abc234X",
        title: "Post",
        userId: user.id,
      },
    });

    const destination = await expectRedirect(
      ShortCodePage({
        params: Promise.resolve({
          shortCode: link.shortCode,
        }),
      }),
    );
    const updatedLink = await prisma.shortLink.findUnique({
      where: {
        id: link.id,
      },
    });

    expect(destination).toBe("https://example.com/post");
    expect(updatedLink?.clickCount).toBe(1);
  });

  it("stops counting repeated redirects from the same request fingerprint after the limit", async () => {
    const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(1_775_209_200_000);

    const user = await prisma.user.create({
      data: {
        email: createTestEmail(),
        passwordHash: await hashPassword("password123"),
      },
    });
    const link = await prisma.shortLink.create({
      data: {
        originalUrl: "https://example.com/repeat",
        shortCode: "Rpt234X",
        title: "Repeat",
        userId: user.id,
      },
    });

    setMockHeaders({
      host: "localhost:3000",
      "x-forwarded-for": "203.0.113.10",
      "x-forwarded-proto": "http",
    });

    try {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const destination = await expectRedirect(
          ShortCodePage({
            params: Promise.resolve({
              shortCode: link.shortCode,
            }),
          }),
        );

        expect(destination).toBe("https://example.com/repeat");
      }

      const updatedLink = await prisma.shortLink.findUnique({
        where: {
          id: link.id,
        },
      });

      expect(updatedLink?.clickCount).toBe(3);
    } finally {
      dateNowSpy.mockRestore();
    }
  });
});
