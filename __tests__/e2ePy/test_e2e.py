from selenium import webdriver
from selenium.webdriver.common.by import By 
import pyautogui
import pytest
import logging
import time
from dataclasses import dataclass
import pyperclip

MAX_NUMBER_OF_BUTTONS_TO_ADD = 2

@dataclass
class E2EData:
    driver: any
    encrypted_messages: list
    decrypted_messages: list
    storage_key: str
    inverse_key: str
    key: str
    no_of_added_buttons: int

logger = logging.getLogger(__name__)

@pytest.fixture(scope="module")
def browser_setup():
    logger.info("=" * 60)
    logger.info("Setting up firefox with the extension and loading up the fake whatsapp website")
    driver = webdriver.Firefox()

    # Remember to hide this with directory names and shit
    driver.get("file:///home/nijo/CODe/JS/RUEN/RUEN-Extension/__tests__/e2ePy/fakewhatsapp.html")
    driver.install_addon("./tstsel.xpi", True)
    time.sleep(1)

    yield driver

    logger.info("Stopping the driver")
    driver.quit()

@pytest.fixture(scope="module")
def test_data(browser_setup):

    driver = browser_setup

    logger.info("Click the extension icon")
    location = pyautogui.locateCenterOnScreen("extensionIcon.png", confidence=0.8)
    pyautogui.moveTo(location.x, location.y)
    pyautogui.click()

    time.sleep(1)

    logger.info("Click the whatsapp icon")
    location = pyautogui.locateCenterOnScreen("whatsappIcon.png", confidence=0.8)
    pyautogui.moveTo(location.x, location.y)
    pyautogui.click()

    time.sleep(1)

    logger.info("Click the input box")
    location = pyautogui.locateCenterOnScreen("inputClick.png", confidence=0.8)
    pyautogui.moveTo(location.x, location.y)
    pyautogui.click()
    logger.info("Enter the hardcoded key")
    pyautogui.write("R R R R R R")

    logger.info("Submit the key")
    location = pyautogui.locateCenterOnScreen("submitBtn.png", confidence=0.8)
    pyautogui.moveTo(location.x, location.y)
    pyautogui.click()

    logger.info("Enter the message to send")
    enterMsg = driver.find_element(By.CLASS_NAME, "message-input")
    enterMsg.send_keys("This is a message for testing purposes")

    logger.info("Send the message")
    location = pyautogui.locateCenterOnScreen("sendBtn.png", confidence=0.8)
    pyautogui.moveTo(location.x, location.y)
    pyautogui.click()

    logger.info("Get all messages before decryption")
    encryptedMsgs = []
    for incomingMsg in driver.find_elements(By.CSS_SELECTOR, ".outgoing .message-text"):
        encryptedMsgs.append(incomingMsg.text)


    time.sleep(1)

    logger.info("Get all messages after decryption")
    decryptedMsgs = []
    for incomingMsg in driver.find_elements(By.CSS_SELECTOR, ".outgoing .message-text"):
        decryptedMsgs.append(incomingMsg.text)
    
    logger.info("Get the amount of buttons added to the send button")
    snd_btn_container = driver.find_element(By.CLASS_NAME, "send-button-container")
    no_of_added_buttons = len(snd_btn_container.get_property('children')) - 1


    driver.get("about:debugging#/runtime/this-firefox")

    time.sleep(1)

    logger.info("Get the internal UUID")
    location = pyautogui.locateOnScreen("internalUUIDBtn.png", confidence = 0.8)
    pyautogui.moveTo(location.left, location.top + location.height / 2)
    pyautogui.dragTo(location.left+1000,(location.top + location.height / 2), button='left')
    pyautogui.hotkey('ctrl', 'c')

    clipboard_data = pyperclip.paste()
    split_cp_data = clipboard_data.split(" ")

    logger.info(f"Extracted the extension ID")
    extension_id = split_cp_data[len(split_cp_data) - 1]

    driver.get(f"moz-extension://{extension_id}/_generated_background_page.html")
    local_storage_data = driver.execute_async_script("""
    const callback = arguments[arguments.length - 1];
    browser.storage.local.get(null).then(callback);
    """)
    logger.info("Extracted the localStorage data")

    storage_key = list(local_storage_data.keys())[0]
    inverse_key = local_storage_data[storage_key]['inversekey']
    key = local_storage_data[storage_key]['key']

    data = E2EData(
        driver=driver,
        encrypted_messages=encryptedMsgs,
        decrypted_messages=decryptedMsgs,
        storage_key=storage_key,
        inverse_key=inverse_key,
        key=key,
        no_of_added_buttons=no_of_added_buttons
    )

    yield data

def test_encryption(test_data):
    assert test_data.encrypted_messages[1] == "ENC:XhiX iX a message foX tXstXsoprup gnesrXXeXXiXXTXXsXXs"

def test_decryption(test_data):
    assert test_data.decrypted_messages[1] == "This is a message for testing purposesXXXXXXXXXXXXXXXX"

def test_send_button(test_data):
    assert test_data.no_of_added_buttons == MAX_NUMBER_OF_BUTTONS_TO_ADD

def test_local_storage_data(test_data):
    assert test_data.storage_key == "919876543210"
    assert test_data.inverse_key == "R' R' R' R' R' R'"
    assert test_data.key == "R R R R R R"