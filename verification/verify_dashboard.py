from playwright.sync_api import sync_playwright

def verify_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")
            page.wait_for_selector("text=ExamBuilder", timeout=10000)

            # Check for Sidebar
            print("Checking Sidebar...")
            assert page.is_visible("text=Question Bank")
            assert page.is_visible("text=Drafts")
            assert page.is_visible("text=Settings")

            # Check for Main Layout
            print("Checking Layout...")
            assert page.is_visible("text=Source Panel (Phase 2)")
            assert page.is_visible("text=Target Area (Phase 2)")

            # Screenshot
            page.screenshot(path="verification/dashboard_layout.png")
            print("Screenshot saved to verification/dashboard_layout.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_dashboard()
