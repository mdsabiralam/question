from playwright.sync_api import sync_playwright

def verify_mobile_sidebar():
    with sync_playwright() as p:
        # Use a mobile viewport
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 375, "height": 667})
        page = context.new_page()
        try:
            page.goto("http://localhost:3000")

            # Wait for toggle button (visible on mobile)
            print("Waiting for mobile toggle...")
            toggle_btn = page.locator("button.md\\:hidden")
            toggle_btn.wait_for(state="visible", timeout=10000)

            # Click Toggle
            print("Clicking Toggle...")
            toggle_btn.click()

            # Now "ExamBuilder" (in sidebar) should be visible
            print("Waiting for Sidebar content...")
            page.wait_for_selector("text=ExamBuilder", timeout=2000)

            # Check if overlay appeared
            print("Checking Overlay...")
            overlay = page.locator(".bg-black\\/50")
            assert overlay.is_visible()

            # Close via Overlay
            print("Closing via Overlay...")
            overlay.click()

            # Overlay should disappear
            page.wait_for_timeout(500)
            assert not overlay.is_visible()

            # Screenshot
            page.screenshot(path="verification/mobile_sidebar_success.png")
            print("Screenshot saved to verification/mobile_sidebar_success.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/mobile_sidebar_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_mobile_sidebar()
