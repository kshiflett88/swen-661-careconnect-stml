describe('CareConnect STML - E2E', () => {
  const goToDashboard = async () => {
    await waitFor(element(by.id('welcome_screen')))
      .toBeVisible()
      .withTimeout(20000);

    await element(by.id('face_id_button')).tap();

    await waitFor(element(by.id('dashboard_screen')))
      .toBeVisible()
      .withTimeout(20000);
  };

  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('Welcome → Dashboard', async () => {
    await goToDashboard();
  });

  it('Dashboard → Emergency → Confirm → Alert Sent', async () => {
    await goToDashboard();

    await element(by.id('emergency_help_button')).tap();

    await waitFor(element(by.id('emergency_screen')))
      .toBeVisible()
      .withTimeout(20000);

    await waitFor(element(by.id('sos_button')))
      .toBeVisible()
      .withTimeout(20000);

    await element(by.id('sos_button')).tap();

    await waitFor(element(by.id('confirm_send_alert')))
      .toBeVisible()
      .withTimeout(15000);

    await element(by.id('confirm_send_alert')).tap();

    await waitFor(element(by.id('alert_sent_ok')))
      .toBeVisible()
      .withTimeout(15000);

    await element(by.id('alert_sent_ok')).tap();

    // back on dashboard (depends on your screen behavior)
    await waitFor(element(by.id('dashboard_screen')))
      .toBeVisible()
      .withTimeout(15000);
  });

  it('Dashboard → Tasks → open first task → step navigation', async () => {
    await goToDashboard();

    await element(by.id('schedule_button')).tap();

    await waitFor(element(by.id('task_list_screen')))
      .toBeVisible()
      .withTimeout(15000);

    // tap first task primary action
    await element(by.id('task_primary_1')).tap();

    await waitFor(element(by.id('task_detail_screen')))
      .toBeVisible()
      .withTimeout(15000);

    // Step through (task_primary_cta changes from "Next Step" to "Mark Done")
    await element(by.id('task_primary_cta')).tap();
    await element(by.id('task_primary_cta')).tap();

    // Mark done (same button, final tap)
    await element(by.id('task_primary_cta')).tap();

    // Overlay appears
    await waitFor(element(by.id('task_done_overlay')))
      .toBeVisible()
      .withTimeout(15000);

    await element(by.id('task_done_ok_button')).tap();

    await waitFor(element(by.id('task_list_screen')))
      .toBeVisible()
      .withTimeout(15000);
  });
});
