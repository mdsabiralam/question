from playwright.sync_api import sync_playwright

def verify_preview_logic():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")
            page.wait_for_selector("text=ExamBuilder", timeout=10000)

            # Open Preview
            print("Opening Preview...")
            page.locator("button[title='Validate & Preview']").click()

            # Check for error message
            print("Verifying Error Messages...")
            # We expect errors for all groups because paper is empty.
            # Default config: MCQ (20), Short Answer (8), Creative (3).
            # Error format: "Expected [N] [Type] questions..."

            assert page.is_visible("text=Expected 20 MCQ questions")
            assert page.is_visible("text=Expected 8 Short Answer questions")
            assert page.is_visible("text=Expected 3 Creative questions")

            print("Validation errors confirmed.")

            # Screenshot
            page.screenshot(path="verification/preview_logic_success.png")
            print("Screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/preview_logic_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_preview_logic()
