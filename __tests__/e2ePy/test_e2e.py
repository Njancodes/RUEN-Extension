from selenium import webdriver
from selenium.webdriver.common.by import By 
import pyautogui
import pytest
import time
from dataclasses import dataclass

@dataclass
class E2EData:
    driver: any
    encrypted_messages: list
    decrypted_messages: list

@pytest.fixture(scope="module")
def browser_setup():
    driver = webdriver.Firefox()

    driver.get("file:///home/nijo/CODe/JS/RUEN/RUEN-Extension/__tests__/e2ePy/fakewhatsapp.html")
    driver.install_addon("tstsel.xpi", True)
    time.sleep(1)

    yield driver

    driver.quit()

@pytest.fixture(scope="module")
def test_data(browser_setup):

    driver = browser_setup

    location = pyautogui.locateCenterOnScreen("extensionIcon.png", confidence=0.8)
    pyautogui.moveTo(location.x, location.y)
    pyautogui.click()

    time.sleep(1)

    location = pyautogui.locateCenterOnScreen("whatsappIcon.png", confidence=0.8)
    pyautogui.moveTo(location.x, location.y)
    pyautogui.click()

    time.sleep(1)

    location = pyautogui.locateCenterOnScreen("inputClick.png", confidence=0.8)
    pyautogui.moveTo(location.x, location.y)
    pyautogui.click()
    pyautogui.write("R R R R R R")

    location = pyautogui.locateCenterOnScreen("submitBtn.png", confidence=0.8)
    pyautogui.moveTo(location.x, location.y)
    pyautogui.click()

    # location = pyautogui.locateCenterOnScreen("generateBtn.png", confidence=0.8)
    # pyautogui.moveTo(location.x, location.y)
    # pyautogui.click()

    enterMsg = driver.find_element(By.CLASS_NAME, "message-input")
    enterMsg.send_keys("This is a message for testing purposes")

    location = pyautogui.locateCenterOnScreen("sendBtn.png", confidence=0.8)
    pyautogui.moveTo(location.x, location.y)
    pyautogui.click()

    #After Encryption
    encryptedMsgs = []
    for incomingMsg in driver.find_elements(By.CSS_SELECTOR, ".outgoing .message-text"):
        encryptedMsgs.append(incomingMsg.text)


    time.sleep(1)

    #After Decryption
    decryptedMsgs = []
    for incomingMsg in driver.find_elements(By.CSS_SELECTOR, ".outgoing .message-text"):
        decryptedMsgs.append(incomingMsg.text)
    
    data = E2EData(
        driver=driver,
        encrypted_messages=encryptedMsgs,
        decrypted_messages=decryptedMsgs
    )

    yield data

def test_encryption(test_data):
    assert test_data.encrypted_messages[1] == "ENC:XhiX iX a message foX tXstXsoprup gnesrXXeXXiXXTXXsXXs"

def test_decryption(test_data):
    assert test_data.decrypted_messages[1] == "This is a message for testing purposesXXXXXXXXXXXXXXXX"

def test_send_button(test_data):
    snd_btn_container = test_data.driver.find_element(By.CLASS_NAME, "send-button-container")
    assert len(snd_btn_container.get_property("children")) == 3
