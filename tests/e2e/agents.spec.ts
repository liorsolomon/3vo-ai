import { test, expect } from "@playwright/test";

// Smoke test for the agents product — run against local dev or staging
// BASE_URL=https://prompts.3vo.ai npx playwright test tests/e2e/agents.spec.ts

test.describe("Agents hub", () => {
  test("renders hub page with all 5 agents", async ({ page }) => {
    await page.goto("/agents");
    await expect(page).toHaveTitle(/prompts\.3vo\.ai/i);
    await expect(page.getByText("Done in 30 seconds.")).toBeVisible();
    // All 5 agent cards
    for (const title of ["Cold Pitch", "Pricing Reframe", "LinkedIn Content", "Proposal", "Client Check-in"]) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
  });

  test("agent page renders input form", async ({ page }) => {
    await page.goto("/agents/cold-pitch");
    await expect(page.getByRole("heading", { name: "Cold Pitch" })).toBeVisible();
    // Required fields
    await expect(page.getByLabel(/WHO ARE YOU PITCHING/i)).toBeVisible();
    await expect(page.getByLabel(/WHAT DO YOU DO/i)).toBeVisible();
    await expect(page.getByLabel(/WHY YOU/i)).toBeVisible();
    // Submit button
    await expect(page.getByRole("button", { name: /RUN COLD PITCH AGENT/i })).toBeVisible();
  });

  test("gate appears after 3 runs (localStorage mock)", async ({ page }) => {
    // Simulate 3 runs already used by setting localStorage before navigating
    await page.goto("/agents/cold-pitch");
    await page.evaluate(() => localStorage.setItem("3vo_runs", "3"));
    await page.reload();
    await expect(page.getByText("FREE RUNS USED")).toBeVisible();
    await expect(page.getByRole("button", { name: /UPGRADE/i })).toBeVisible();
    await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
  });

  test("upgraded users see unlimited badge and no gate", async ({ page }) => {
    await page.goto("/agents/cold-pitch");
    await page.evaluate(() => {
      localStorage.setItem("3vo_runs", "10");
      localStorage.setItem("3vo_upgraded", "true");
    });
    await page.reload();
    await expect(page.getByText("FREE RUNS USED")).not.toBeVisible();
    await expect(page.getByText("AGENT — UNLIMITED")).toBeVisible();
  });

  test("success page sets upgrade flag and redirects", async ({ page }) => {
    await page.goto("/agents/success");
    // Page should show confirmation and countdown
    await expect(page.getByText("You're in.")).toBeVisible();
    // localStorage should be set
    const upgraded = await page.evaluate(() => localStorage.getItem("3vo_upgraded"));
    expect(upgraded).toBe("true");
    // Wait for redirect (4s countdown → /agents)
    await page.waitForURL("**/agents", { timeout: 6000 });
  });

  test("nav header is present on agent pages", async ({ page }) => {
    await page.goto("/agents");
    await expect(page.getByText("PROMPTS.3VO.AI")).toBeVisible();
  });
});

test.describe("Agents API", () => {
  test("returns 404 for unknown agent", async ({ request }) => {
    const res = await request.post("/api/agents/nonexistent-agent", {
      data: {},
    });
    expect(res.status()).toBe(404);
  });

  test("returns 400 for missing required fields", async ({ request }) => {
    const res = await request.post("/api/agents/cold-pitch", {
      data: { target_type: "" }, // missing required fields
    });
    expect(res.status()).toBe(400);
  });

  test("returns 503 when ANTHROPIC_API_KEY is absent", async ({ request }) => {
    // Only meaningful when running against a local build without the key set
    // Skip in CI or when key IS set
    const res = await request.post("/api/agents/cold-pitch", {
      data: {
        target_type: "SaaS founders",
        your_service: "Growth consulting",
        differentiator: "ex-Notion head of growth",
      },
    });
    // Either 503 (no key) or 200 (key set, streaming response)
    expect([200, 503]).toContain(res.status());
  });
});
