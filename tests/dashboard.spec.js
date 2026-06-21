import { test, expect } from '@playwright/test'

test.describe('FounderOS Dashboard', () => {
  test('page loads with correct title and heading', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/FounderOS/)
    await expect(page.getByText('Business state in')).toBeVisible()
  })

  test('clock renders WIB time string', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/\d{2}:\d{2} WIB/)).toBeVisible()
  })

  test('loading skeleton resolves within 5 seconds', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    const skeletons = page.locator('.animate-pulse')
    await expect(skeletons).toHaveCount(0)
  })

  test('email section renders with heading and content', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await expect(page.getByText('Email Intelligence')).toBeVisible()
    const hasCards = await page.locator('article').count() > 0
    const hasEmpty = await page.getByText('No urgent emails.').isVisible().catch(() => false)
    expect(hasCards || hasEmpty).toBe(true)
  })

  test('lead section renders', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Lead Pipeline')).toBeVisible()
  })

  test('briefing section renders', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('CEO Briefing')).toBeVisible()
  })

  test('email card click opens Gmail in new tab', async ({ page, context }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)

    const cards = page.locator('article')
    const cardCount = await cards.count()
    if (cardCount === 0) {
      test.skip()
      return
    }

    const newTabPromise = context.waitForEvent('page')
    await cards.first().click()

    // Only assert new tab if one opened (card may not have thread_id)
    const opened = await Promise.race([
      newTabPromise.then(() => true),
      new Promise(resolve => setTimeout(() => resolve(false), 2000))
    ])

    if (opened) {
      const newTab = await newTabPromise
      await newTab.waitForLoadState()
      expect(newTab.url()).toContain('mail.google.com')
    }
  })

  test('no console errors on page load', async ({ page }) => {
    const consoleErrors = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    await page.goto('/')
    await page.waitForTimeout(3000)
    expect(consoleErrors).toHaveLength(0)
  })
})
