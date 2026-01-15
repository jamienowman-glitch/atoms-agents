import { test, expect } from '@playwright/test';

test('Mobile Builder Smoke Test', async ({ page }) => {
    // 1. Load Builder (Mocked)
    // Need to mock the API responses for feeds/tokens
    await page.route('/feeds/summary', async route => {
        const json = {
            sources: ['youtube'],
            feeds: [{ feed_id: 'yt1', name: 'My Videos', source_kind: 'youtube' }]
        };
        await route.fulfill({ json });
    });

    await page.route('/feeds/youtube/yt1/items', async route => {
        const json = [
            { item_id: 'i1', title: 'Video 1', image_url: 'http://placeholder.com/1.jpg' }
        ];
        await route.fulfill({ json });
    });

    await page.goto('/builder/canvas/123'); // Assuming route

    // 2. Select Element
    // Assuming we have a test element with data-id="el1"
    await page.click('[data-testid="element-el1"]');

    // 3. Verify Inspector Opens
    await expect(page.locator('.inspector-panel')).toBeVisible();

    // 4. Test Controls
    // Toggle (Boolean)
    const toggle = page.locator('input[type="checkbox"]');
    await toggle.check();
    // Verify API call or State change (mocked or observed)

    // Slider (Number)
    const slider = page.locator('input[type="range"]');
    await slider.fill('50');

    // 5. Test Multi-21 Feed Picker
    // Assuming the selected element is Multi-21
    const picker = page.locator('.feed-picker select');
    await picker.selectOption('yt1');

    // 6. Verify Tiles Rendered
    await expect(page.locator('.tile')).toHaveCount(1);
    await expect(page.locator('.tile h3')).toHaveText('Video 1');

});
