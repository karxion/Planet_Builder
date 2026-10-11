import { expect, test, type Page } from "@playwright/test";
import { DEFAULT_PLANET_SETTINGS } from "../../src/types/planet-project";

test.use({ channel: process.env.FPB_BROWSER_CHANNEL, launchOptions: { args: ["--enable-unsafe-swiftshader"] } });

async function expectMapToCoverViewport(page: Page): Promise<void> {
  await expect.poll(() => page.locator("#map").evaluate(svg => {
    const viewport = svg.getBoundingClientRect();
    const map = svg.querySelector("#landmass rect")!.getBoundingClientRect();
    const header = document.getElementById("fpb-shell")!.getBoundingClientRect().height;
    return Math.abs(Number(svg.getAttribute("width")) - innerWidth) < 1
      && Math.abs(Number(svg.getAttribute("height")) - (innerHeight - header)) < 1
      && Math.abs(viewport.top - header) < 1
      && Math.abs(viewport.bottom - innerHeight) < 1
      && map.left <= viewport.left + 1 && map.top <= viewport.top + 1
      && map.right >= viewport.right - 1 && map.bottom >= viewport.bottom - 1;
  })).toBe(true);
}

test("small world fills the viewport after resizing and zoom reset", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(settings => {
    localStorage.setItem("fpb-planet-settings", JSON.stringify(settings));
  }, DEFAULT_PLANET_SETTINGS);
  await page.goto("/Fantasy-Planet-Builder/?seed=550021&width=719&height=764");
  await expect(page.locator("#loading")).toBeHidden({ timeout: 60_000 });
  await expect(page.locator("#fpb-shell")).toBeVisible();
  const originalDimensions = await page.locator("#landmass rect").evaluate(rect => [
    rect.getAttribute("width"), rect.getAttribute("height")
  ]);

  for (const [width, height] of [[1440, 900], [1920, 1080], [390, 844], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await expectMapToCoverViewport(page);
    expect(await page.locator("#landmass rect").evaluate(rect => [
      rect.getAttribute("width"), rect.getAttribute("height")
    ])).toEqual(originalDimensions);
  }

  await page.locator("#fpb-world-button").click();
  await page.locator("#fpb-npc-focus").click();
  await expect(page.locator("#viewbox")).toHaveAttribute("transform", /scale\(6\)/);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expectMapToCoverViewport(page);
  await expect(page.locator("#viewbox")).toHaveAttribute("transform", /scale\(6\)/);

  if (!(await page.locator("#options").isVisible())) await page.locator("#fpb-editor-button").click();
  await page.locator("#zoomReset").click();
  await expectMapToCoverViewport(page);
  const expectedScale = await page.locator("#map").evaluate(svg => {
    const world = svg.querySelector("#landmass rect")!;
    return Math.max(
      Number(svg.getAttribute("width")) / Number(world.getAttribute("width")),
      Number(svg.getAttribute("height")) / Number(world.getAttribute("height"))
    );
  });
  await expect.poll(async () => {
    const transform = await page.locator("#viewbox").getAttribute("transform");
    return Number(transform?.match(/scale\(([^)]+)\)/)?.[1]);
  }).toBeCloseTo(expectedScale, 6);
});
