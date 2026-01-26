from selenium import webdriver
from selenium.webdriver.common.by import By 
import pyautogui
import time

driver = webdriver.Firefox()

driver.get("file:///home/nijo/CODe/JS/RUEN/RUEN-Extension/__tests__/e2ePy/fakewhatsapp.html")

driver.install_addon("tstsel.xpi", True)

location = pyautogui.locateCenterOnScreen("extensionIcon.png", confidence=0.8)
pyautogui.moveTo(location.x, location.y)
pyautogui.click()

location = pyautogui.locateCenterOnScreen("whatsappIcon.png", confidence=0.8)
pyautogui.moveTo(location.x, location.y)
pyautogui.click()

time.sleep(1)

location = pyautogui.locateCenterOnScreen("generateBtn.png", confidence=0.8)
pyautogui.moveTo(location.x, location.y)
pyautogui.click()

enterMsg = driver.find_element(By.CLASS_NAME, "message-input")
enterMsg.send_keys("This is a message for testing purposes")

location = pyautogui.locateCenterOnScreen("sendBtn.png", confidence=0.8)
pyautogui.moveTo(location.x, location.y)
pyautogui.click()
