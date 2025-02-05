# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import pytest

from pages.firefox.welcome.page6 import FirefoxWelcomePage6


@pytest.mark.skip_if_not_firefox(reason="Welcome pages are shown to Firefox only.")
@pytest.mark.nondestructive
def test_set_default_browser_button_displayed(base_url, selenium):
    page = FirefoxWelcomePage6(selenium, base_url, params="?default=false").open()
    assert page.is_set_default_browser_button_displayed


@pytest.mark.skip_if_not_firefox(reason="Welcome pages are shown to Firefox only.")
@pytest.mark.nondestructive
def test_get_firefox_qr_code(base_url, selenium):
    page = FirefoxWelcomePage6(selenium, base_url, locale="it", params="?default=true").open()
    modal = page.click_modal_button()
    assert modal.is_displayed
    assert not page.send_to_device.is_displayed
    assert page.is_firefox_qr_code_displayed
    modal.close()


@pytest.mark.skip_if_not_firefox(reason="Welcome pages are shown to Firefox only.")
@pytest.mark.nondestructive
def test_send_to_device_success(base_url, selenium):
    page = FirefoxWelcomePage6(selenium, base_url, params="?default=true").open()
    modal = page.click_modal_button()
    assert modal.is_displayed
    assert not page.is_firefox_qr_code_displayed
    send_to_device = page.send_to_device
    send_to_device.type_email("success@example.com")
    send_to_device.click_send()
    assert send_to_device.send_successful
    modal.close()


@pytest.mark.skip_if_not_firefox(reason="Welcome pages are shown to Firefox only.")
@pytest.mark.nondestructive
def test_send_to_device_failure(base_url, selenium):
    page = FirefoxWelcomePage6(selenium, base_url, params="?default=true").open()
    modal = page.click_modal_button()
    assert modal.is_displayed
    send_to_device = page.send_to_device
    send_to_device.type_email("invalid@email")
    send_to_device.click_send(expected_result="error")
    assert send_to_device.is_form_error_displayed
