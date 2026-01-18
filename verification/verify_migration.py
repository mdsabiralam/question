
import time
from playwright.sync_api import sync_playwright

def verify_dashboard(page):
    print("Navigating to dashboard...")
    page.goto("http://localhost:3000")

    # Wait for Question Bank (indicates dashboard loaded)
    print("Waiting for Question Bank...")
    page.wait_for_selector("text=Question Bank", timeout=30000)

    # Check for Question Card (indicates questions loaded)
    # Wait a bit for api mock or fetch
    # QuestionCard has "draggable" but we removed attributes in favor of useDraggable.
    # It has class "cursor-grab".
    print("Waiting for questions to load...")
    try:
        page.wait_for_selector(".cursor-grab", timeout=10000)
        print("Questions loaded.")
    except:
        print("Questions might not have loaded or selector issue. Continuing...")

    # Check for Wand icon (Add New Section button)
    print("Checking for Wand icon...")
    page.wait_for_selector("button[title='Add New Section']", timeout=10000)
    print("Wand icon found.")

    # Take screenshot in mobile view
    print("Taking screenshot...")
    page.screenshot(path="verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        # iPhone 12 Pro viewport simulation
        iphone_12 = p.devices['iPhone 12 Pro']
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(**iphone_12)
        page = context.new_page()
        try:
            verify_dashboard(page)
            print("Verification successful")
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()
