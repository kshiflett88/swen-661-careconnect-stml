describe('Dashboard → Tasks → open first task → step navigation', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('opens a task and advances steps', async () => {
    await element(by.id('face_id_button')).tap();
    await expect(element(by.id('schedule_button'))).toBeVisible();

    await element(by.id('schedule_button')).tap();

    // Task list visible
    await expect(element(by.text('You are on:'))).toBeVisible();

    // Open first task deterministically
    await expect(element(by.id('task_primary_1'))).toBeVisible();
    await element(by.id('task_primary_1')).tap();

    // Task detail
    await expect(element(by.text('You are on:'))).toBeVisible();
    await expect(element(by.id('task_primary_cta'))).toBeVisible();

    // Real action: step forward twice
    await element(by.id('task_primary_cta')).tap();
    await element(by.id('task_primary_cta')).tap();

    // Assert progress changes (either via text or a progressbar label you set)
    await expect(element(by.text('Step 3 of 3'))).toBeVisible();
  });
});
