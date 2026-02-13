describe('Welcome → Face ID → Dashboard', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('lands on dashboard after Face ID', async () => {
    await expect(element(by.text('Access CareConnect'))).toBeVisible();
    await expect(element(by.id('face_id_button'))).toBeVisible();

    await element(by.id('face_id_button')).tap();

    // Dashboard assertions
    await expect(element(by.id('location_card'))).toBeVisible();
    await expect(element(by.id('emergency_help_button'))).toBeVisible();
  });
});
