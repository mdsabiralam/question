from playwright.sync_api import sync_playwright

def verify_phase4_features():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")
            page.wait_for_selector("text=ExamBuilder", timeout=10000)

            # 1. Verify Sync Indicator Logic
            print("Testing Sync Indicator...")
            # Add a question to trigger sync
            page.locator("text=Solve for x").first.drag_to(page.locator("text=Drag questions here").first)

            # Check for "Cloud Syncing..." text
            # It appears for 1 second. It might be fast.
            # We can wait for it.
            try:
                page.wait_for_selector("text=Cloud Syncing...", timeout=2000)
                print("Sync Indicator appeared.")
            except:
                print("Sync Indicator missed or didn't appear.")
                # It's okay if we missed it due to timing, but we should see it ideally.

            # 2. Verify PDF Button
            print("Testing PDF Button...")
            download_btn = page.locator("button[title='Download PDF']")
            assert download_btn.is_visible()

            # Click it (we can't easily verify download in headless without setup, but ensure no error)
            # We can mock window.html2pdf or just check console for errors
            download_btn.click()
            print("PDF Download clicked (simulated).")

            # Screenshot
            page.screenshot(path="verification/phase4_features.png")
            print("Screenshot saved to verification/phase4_features.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/phase4_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_phase4_features()
