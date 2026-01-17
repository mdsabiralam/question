from playwright.sync_api import sync_playwright

def verify_modal_interaction():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")
            page.wait_for_selector("text=ExamBuilder", timeout=10000)

            # Open Context Menu
            print("Opening Modal...")
            page.locator("#exam-paper-container").click(button="right")

            # Verify Modal Header contains Select
            print("Verifying Type Selector...")
            # We look for a select element inside the modal
            # The modal has "Settings" text
            modal = page.locator("text=Settings").locator("..") # Parent of Settings text should be the header container
            select = modal.locator("select")
            assert select.is_visible()

            # Check default value (MCQ)
            value = select.input_value()
            assert value == "MCQ"
            print("Default type is MCQ.")

            # Change Type to Short Answer
            print("Changing type to Short Answer...")
            select.select_option("Short Answer")

            # Verify modal re-rendered (input values might change if configs differ)
            # Default MCQ: Marks 1
            # Default Short Answer: Marks 5 (from DashboardContext default)

            # Check Marks input
            marks_input = page.locator("label:has-text('Marks per Question') + input")
            marks_value = marks_input.input_value()
            print(f"Marks value after switch: {marks_value}")

            assert marks_value == "5" # Short Answer default

            print("Type switch updated form state successfully.")

            # Screenshot
            page.screenshot(path="verification/modal_interaction_success.png")
            print("Screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/modal_interaction_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_modal_interaction()
