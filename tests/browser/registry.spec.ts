import { expect, test } from "@playwright/test"
import registry from "../../registry.json" with { type: "json" }

test.beforeEach(async ({ page }) => {
  await page.route("https://pokeapi.co/**", async (route) => {
    const url = new URL(route.request().url())
    const data = url.searchParams.has("limit")
      ? { results: [{ name: "bulbasaur" }] }
      : { name: "bulbasaur", id: 1, sprites: { front_default: "" }, stats: [] }
    await route.fulfill({ json: data })
  })
  await page.route("https://raw.githubusercontent.com/PokeAPI/**", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><circle cx="48" cy="48" r="30" fill="seagreen"/></svg>',
    }),
  )
})

test("renders every registry item under a repository subpath without runtime errors", async ({
  page,
  request,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("./")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    registry.name,
  )
  for (const item of registry.items) {
    const section = page.getByRole("region", { name: item.title })
    await expect(section).toBeVisible()
    await expect(
      section.getByRole("link", { name: "Show source" }),
    ).toHaveAttribute("href", new RegExp(item.files[0].path))
    const link = await section
      .getByRole("link", { name: "Open in v0" })
      .getAttribute("href")
    expect(new URL(link!).searchParams.get("url")).toBe(
      `https://registry.example.test/registry-preview/r/${item.name}.json`,
    )
    const response = await request.get(`r/${item.name}.json`)
    expect(response.ok()).toBeTruthy()
    expect((await response.json()).name).toBe(item.name)
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy()
  expect(errors).toEqual([])
})

test("copies the complete install URL and reports validation errors", async ({
  page,
}) => {
  await page.goto("./")
  const item = registry.items.find((item) => item.name === "example-form")
  test.skip(
    !item,
    "This starter form has been replaced by project-specific examples.",
  )
  const section = page.getByRole("region", { name: item!.title })
  await section
    .getByRole("button", { name: "Copy install command for example-form" })
    .click()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "pnpm dlx shadcn@latest add https://registry.example.test/registry-preview/r/example-form.json",
  )
  await section.getByRole("button", { name: "Validate message" }).click()
  await expect(section.getByLabel("Name", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  )
  await section.getByLabel("Name", { exact: true }).fill("Taylor")
  await section.getByLabel("Email", { exact: true }).fill("taylor@example.com")
  await section.getByLabel("Message", { exact: true }).fill("Hello")
  await section.getByRole("button", { name: "Validate message" }).click()
  await expect(
    section.getByText("Form validated successfully.", { exact: false }),
  ).toBeVisible()
})

test("keeps the gallery usable on mobile and in dark mode", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("./")
  await page.evaluate(() => document.documentElement.classList.add("dark"))
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy()
})
