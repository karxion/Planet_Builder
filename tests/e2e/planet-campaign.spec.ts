import { readFile, writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { expect, test } from "@playwright/test";
import { DEFAULT_PLANET_SETTINGS } from "../../src/types/planet-project";

test.use({ channel: process.env.FPB_BROWSER_CHANNEL, launchOptions: { args: ["--enable-unsafe-swiftshader"] } });

test("administrative NPC editing, local persistence and responsive views", async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(settings => {
    if (!localStorage.getItem("fpb-planet-settings")) localStorage.setItem("fpb-planet-settings", JSON.stringify(settings));
  }, { ...DEFAULT_PLANET_SETTINGS, name: "NPC UI 검증", seed: "550021" });
  await page.goto("/Fantasy-Planet-Builder/?seed=550021&width=1440&height=720");
  await expect(page.locator("#loading")).toBeHidden({ timeout: 60_000 });
  await page.locator("#fpb-world-button").click();
  await expect(page.locator("#fpb-world-summary")).toContainText("마을");
  const summary = await page.locator("#fpb-world-summary").innerText();
  const villages = Number(summary.match(/마을 (\d+)/)![1]);
  expect(Number((await page.locator("#fpb-npc-count").innerText()).replace("명", ""))).toBe(villages * 4);
  for (const level of ["country", "region", "fief", "village"]) {
    await page.locator(`#fpb-filter-${level}`).selectOption({ index: 1 });
  }
  await expect(page.locator("#fpb-npc-count")).toHaveText("4명");
  await page.locator('#fpb-npc-form [name="name"]').fill('검증 NPC "아린"');
  await page.locator('#fpb-npc-form [name="notes"]').fill("저장 및 복구 검증 메모");
  await page.locator('#fpb-npc-form [name="templateId"]').selectOption("guard");
  await expect(page.locator(".fpb-npc-stats")).toContainText("AC 16");
  await expect(page.locator('#fpb-npc-form [name="name"]')).toHaveValue('검증 NPC "아린"');
  await page.getByRole("button", { name: "변경 저장", exact: true }).click();
  await expect(page.locator(".fpb-npc-row.selected")).toContainText("수정됨");
  page.once("dialog", dialog => dialog.accept());
  await page.locator("#fpb-npc-regenerate").click();
  await expect(page.locator("#fpb-npc-count")).toHaveText("5명");
  await expect(page.locator("#fpb-npc-list")).toContainText('검증 NPC "아린"');
  await page.locator("#fpb-npc-detail").evaluate(detail => { detail.scrollTop = 0; });

  for (const [width, height] of [[1440, 900], [1920, 1080], [390, 844]]) {
    await page.setViewportSize({ width, height });
    const overflow = await page.locator("#fpb-world-dialog").evaluate(dialog => ({
      horizontal: dialog.scrollWidth > dialog.clientWidth + 2,
      right: dialog.getBoundingClientRect().right,
      viewport: window.innerWidth
    }));
    expect(overflow.horizontal).toBe(false);
    expect(overflow.right).toBeLessThanOrEqual(overflow.viewport);
    const header = await page.locator("#fpb-shell").evaluate(shell => {
      const brand = shell.querySelector(".fpb-brand")!.getBoundingClientRect();
      const actions = shell.querySelector(".fpb-actions")!.getBoundingClientRect();
      return { overlap: brand.right > actions.left, outside: actions.right > window.innerWidth };
    });
    expect(header).toEqual({ overlap: false, outside: false });
    await page.screenshot({ path: testInfo.outputPath(`npc-${width}.png`) });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator("#fpb-admin-level").selectOption("region");
  await expect(page.locator("#fpb-administration path")).not.toHaveCount(0);
  await page.locator("#fpb-world-close").click();
  await page.screenshot({ path: testInfo.outputPath("regions-1440.png") });
  await page.locator("#fpb-world-button").click();
  await page.locator("#fpb-admin-level").selectOption("fief");
  await expect(page.locator("#fpb-administration path")).not.toHaveCount(0);
  await page.locator("#fpb-admin-level").selectOption("village");
  await expect(page.locator("#fpb-administration")).toHaveCount(0);
  await expect(page.locator("#toggleStates")).toHaveClass(/buttonoff/);
  await page.locator("#fpb-admin-level").selectOption("country");
  await expect(page.locator("#toggleStates")).not.toHaveClass(/buttonoff/);
  await page.locator("#fpb-admin-level").selectOption("region");
  await page.locator("#fpb-world-close").click();

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#fpb-save-button").click();
  const download = await downloadPromise;
  const filePath = testInfo.outputPath("campaign.fpb");
  await download.saveAs(filePath);
  const project = JSON.parse(gunzipSync(await readFile(filePath)).toString("utf8"));
  expect(project.campaign.npcs.some((npc: { notes: string }) => npc.notes === "저장 및 복구 검증 메모")).toBe(true);
  expect(project.mapPayload).not.toContain("sacred-forests");
  const mapRows = project.mapPayload.split("\r\n");
  expect(JSON.parse(mapRows[13])).toEqual([]);
  expect(JSON.parse(mapRows[29])).toEqual([]);
  expect(JSON.parse(mapRows[38])).toEqual([]);
  expect(mapRows[19]).toBe("");
  expect(mapRows[26]).toBe("");
  expect(JSON.parse(mapRows[14]).every((state: object) => !("culture" in state))).toBe(true);
  expect(JSON.parse(mapRows[15]).filter((village: unknown) => village && typeof village === "object").every((village: object) => !("culture" in village) && !("temple" in village))).toBe(true);
  await page.locator("#fpb-file-input").setInputFiles(filePath);
  await expect(page.locator("#fpb-save-status")).toHaveText("프로젝트 열림", { timeout: 30_000 });
  await page.locator("#fpb-world-button").click();
  await expect(page.locator("#fpb-admin-level")).toHaveValue("region");
  await expect(page.locator("#fpb-administration path")).not.toHaveCount(0);
  await page.locator("#fpb-npc-search").fill('검증 NPC "아린"');
  await expect(page.locator("#fpb-npc-count")).toHaveText("1명");
  await expect(page.locator('#fpb-npc-form [name="notes"]')).toHaveValue("저장 및 복구 검증 메모");
  await page.locator("#fpb-world-close").click();
  await expect(page.locator("#fpb-save-status")).toHaveText("자동 저장됨", { timeout: 20_000 });
  await page.reload();
  await expect(page.locator("#fpb-save-status")).toHaveText("자동 저장 복구됨", { timeout: 60_000 });
  await page.locator("#fpb-world-button").click();
  await page.locator("#fpb-npc-search").fill('검증 NPC "아린"');
  await expect(page.locator('#fpb-npc-form [name="notes"]')).toHaveValue("저장 및 복구 검증 메모");
  await expect(page.locator("#cults > *, #relig > *, #zones > *")).toHaveCount(0);
  await page.locator("#fpb-world-close").click();
  await page.locator("#fpb-globe-view").click();
  await expect(page.locator("#canvas3d")).toBeVisible({ timeout: 30_000 });
  const pixels = await page.locator("#canvas3d").evaluate((canvas: HTMLCanvasElement) => {
    const copy = document.createElement("canvas");
    copy.width = 64;
    copy.height = 64;
    const context = copy.getContext("2d")!;
    context.drawImage(canvas, 0, 0, 64, 64);
    const data = context.getImageData(0, 0, 64, 64).data;
    return new Set(Array.from({ length: 4096 }, (_, i) => `${data[i * 4]},${data[i * 4 + 1]},${data[i * 4 + 2]}`)).size;
  });
  expect(pixels).toBeGreaterThan(10);
  const before = await page.locator("#canvas3d").screenshot();
  await page.mouse.move(720, 420);
  await page.mouse.down();
  await page.mouse.move(880, 420, { steps: 12 });
  await page.mouse.up();
  const after = await page.locator("#canvas3d").screenshot();
  expect(before.equals(after)).toBe(false);
  await page.screenshot({ path: testInfo.outputPath("globe-1440.png") });
  for (const [width, height] of [[1920, 1080], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await expect(page.locator("#canvas3d")).toBeVisible();
    await expect.poll(async () => page.locator("#canvas3d").evaluate(canvas => ({
      width: Math.round(canvas.getBoundingClientRect().width),
      height: Math.round(canvas.getBoundingClientRect().height)
    }))).toEqual({ width, height: height - await page.locator("#fpb-shell").evaluate(shell => shell.getBoundingClientRect().height) });
    const center = await page.locator("#canvas3d").evaluate((canvas: HTMLCanvasElement) => {
      const copy = document.createElement("canvas");
      copy.width = copy.height = 1;
      const ctx = copy.getContext("2d")!;
      ctx.drawImage(canvas, canvas.width / 2, canvas.height / 2, 1, 1, 0, 0, 1, 1);
      return Math.max(...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
    });
    expect(center).toBeGreaterThan(70);
    await page.screenshot({ path: testInfo.outputPath(`globe-${width}.png`) });
  }
  // Import a legacy map with actual obsolete entities, not merely empty compatibility slots.
  mapRows[13] = JSON.stringify([{ i: 0, name: "Neutral" }, { i: 1, name: "Legacy culture" }]);
  mapRows[29] = JSON.stringify([{ i: 0, name: "Neutral" }, { i: 1, name: "Legacy religion" }]);
  mapRows[19] = mapRows[25].split(",").map(() => 1).join(",");
  mapRows[26] = mapRows[19];
  mapRows[35] = JSON.stringify([...JSON.parse(mapRows[35]), { i: 999999, type: "sacred-forests", cell: 1, x: 0, y: 0, icon: "X" }]);
  mapRows[4] = JSON.stringify([...JSON.parse(mapRows[4]), { id: "marker999999", name: "Old shrine", legend: "Legacy religion" }]);
  const legacyPath = testInfo.outputPath("legacy-with-divisions.map");
  await writeFile(legacyPath, mapRows.join("\r\n"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator("#fpb-file-input").setInputFiles(legacyPath);
  await expect(page.locator("#fpb-save-status")).toHaveText("프로젝트 열림", { timeout: 30_000 });
  await expect(page.locator("#canvas3d")).toHaveCount(0);
  const sanitizedDownload = page.waitForEvent("download");
  await page.locator("#fpb-save-button").click();
  const sanitizedPath = testInfo.outputPath("sanitized-import.fpb");
  await (await sanitizedDownload).saveAs(sanitizedPath);
  const sanitized = JSON.parse(gunzipSync(await readFile(sanitizedPath)).toString("utf8"));
  expect(sanitized.mapPayload).not.toContain("Legacy culture");
  expect(sanitized.mapPayload).not.toContain("Legacy religion");
  expect(sanitized.mapPayload).not.toContain("marker999999");
  expect(sanitized.mapPayload).not.toContain("sacred-forests");
  expect(errors).toEqual([]);
});
