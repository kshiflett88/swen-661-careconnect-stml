describe('Dashboard → Emergency → Confirm → Alert Sent', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('sends emergency alert and shows confirmation', async () => {
    // Go to dashboard
    await element(by.id('face_id_button')).tap();
    await expect(element(by.id('emergency_help_button'))).toBeVisible();

    // Open emergency screen
    await element(by.id('emergency_help_button')).tap();
    await expect(element(by.id('sos_button'))).toBeVisible();

    // Open confirm modal
    await element(by.id('sos_button')).tap();
    await expect(element(by.id('confirm_send_alert'))).toBeVisible();
    await expect(element(by.id('confirm_cancel'))).toBeVisible();

    // Confirm
    await element(by.id('confirm_send_alert')).tap();

    // Alert sent modal
    await expect(element(by.id('alert_sent_ok'))).toBeVisible();
    await element(by.id('alert_sent_ok')).tap();

    // Back to dashboard
    await expect(element(by.id('location_card'))).toBeVisible();
  });
});
