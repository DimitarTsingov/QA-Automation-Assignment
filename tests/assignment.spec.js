import { test, expect } from '@playwright/test';

test('Weather Check', async ({ page }) => {

    const { addDays } = require('date-fns');
    const { chromium } = require('playwright');
    const browser = await chromium.launch();
    
    await page.goto('https://www.sinoptik.bg/');
    await page.getByText('Приемане и затваряне').click()
    await page.locator('.ad-TransitionClose').click();
    await page.getByRole('textbox', { name: 'Търси град' }).fill('София, България');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'София', exact: true })).toBeVisible();
    await page.getByText('14-дневна').click();

    // Function to get the name of the month in Bulgarian
    function getBulgarianMonth(month) {
    const months = [
      'януари', 'февруари', 'март', 'април', 'май', 'юни',
      'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'
    ];
    return months[month - 1];
  }
  
    // Function to get the day of the week as abbreviation in Bulgarian
    function getDayOfTheWeekAbbreviation(dayOfWeek) {
    const days = ['Нд.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.'];
    return days[dayOfWeek];
  }

  let currentDate = new Date();

  for (let i = 1; i <= 14; i++) {
    const dayOfTheWeekLocatorXPath = `(//div[@class='slide']/a[@href[contains(.,'14-days')]])[${i}]/span[@class[contains(.,'RightDay')]]`;
    const dateOfTheMonthLocatorXPath = `(//div[@class='slide']/a[@href[contains(.,'14-days')]])[${i}]/span[@class[contains(.,'RightDate')]]`;

    // Extract the day of the week and date from the page
    const dayOfTheWeekElement = await page.$(dayOfTheWeekLocatorXPath);
    const dateOfTheMonthElement = await page.$(dateOfTheMonthLocatorXPath);

    const dayOfTheWeekText = await dayOfTheWeekElement.innerText();
    const dateOfTheMonthText = await dateOfTheMonthElement.innerText();

    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const dayOfTheWeekAbbreviation = getDayOfTheWeekAbbreviation(currentDate.getDay());
    const bulgarianMonth = getBulgarianMonth(currentMonth);

    const expectedDate = `${currentDay} ${bulgarianMonth}`;

    console.log(`Verifying day ${i}:`);
    console.log(`Expected day: ${dayOfTheWeekAbbreviation} / Actual day: ${dayOfTheWeekText}`);
    console.log(`Expected date: ${expectedDate} / Actual date: ${dateOfTheMonthText}`);

    if (dayOfTheWeekText !== dayOfTheWeekAbbreviation) {
      console.error(`Day of the week mismatch: expected ${dayOfTheWeekAbbreviation}, got ${dayOfTheWeekText}`);
    }

    if (dateOfTheMonthText !== expectedDate) {
      console.error(`Date of the month mismatch: expected ${expectedDate}, got ${dateOfTheMonthText}`);
    }

    // Continue with the next day
    currentDate = addDays(currentDate, 1);
    }

    await browser.close();
})