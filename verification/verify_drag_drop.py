from playwright.sync_api import sync_playwright

def verify_drag_and_drop():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")
            page.wait_for_selector("text=ExamBuilder", timeout=10000)

            # The default selected subject is 'Math' (mock data q3)
            # q3: Solve for x: 2x + 5 = 15

            # Locate a question card
            print("Locating question card...")
            # We use a partial text locator to be safe
            question_card = page.locator("text=Solve for x").first

            # Ensure it is visible before interacting
            if not question_card.is_visible():
                print("Question card not visible! Checking filters or data.")
                # Maybe change filter to All?
                # For now let's dump page content or just fail
                raise Exception("Target question card not found")

            # Locate drop zone (A4 paper)
            print("Locating drop zone...")
            drop_zone = page.locator("text=Drag questions here").first

            # Perform drag and drop
            print("Performing Drag and Drop...")
            question_card.drag_to(drop_zone)

            # Verify the question appears in the list (numbered list index "1.")
            print("Verifying drop...")
            # We wait for the item to appear in the paper.
            # The paper renders "1. Title"
            page.wait_for_selector("text=1.", timeout=5000)
            assert page.is_visible("text=Solve for x")

            # Screenshot
            page.screenshot(path="verification/drag_drop_success.png")
            print("Screenshot saved to verification/drag_drop_success.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/drag_drop_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_drag_and_drop()
