from playwright.sync_api import sync_playwright

def verify_grouping():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")
            page.wait_for_selector("text=ExamBuilder", timeout=10000)

            # Add a 'Short Answer' question (mock q3: Solve for x) - Default subject Math
            print("Adding Short Answer question...")
            short_answer = page.locator("text=Solve for x").first
            drop_zone = page.locator("text=Drag questions here").first
            short_answer.drag_to(drop_zone)
            page.wait_for_selector("text=Short Answer Questions")

            # We need to add an MCQ question to verify grouping
            # Default subject is Math. Do we have an MCQ Math question in mock data?
            # q3 is Short Answer. q1, q2, q4, q5 are other subjects.
            # We need to change filter to 'General Knowledge' or 'All' to get an MCQ.

            print("Changing Subject Filter to 'All'...")
            page.select_option("select:has-text('Math')", "All")

            # Now find an MCQ (q1: Capital of Bangladesh)
            print("Adding MCQ question...")
            mcq = page.locator("text=What is the capital of Bangladesh?").first
            mcq.drag_to(drop_zone)

            # Verify Headers exist
            print("Verifying Group Headers...")
            assert page.is_visible("text=Short Answer Questions")
            assert page.is_visible("text=MCQ Questions")

            # Screenshot
            page.screenshot(path="verification/grouping_success.png")
            print("Screenshot saved to verification/grouping_success.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/grouping_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_grouping()
