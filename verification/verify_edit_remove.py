from playwright.sync_api import sync_playwright

def verify_editing_and_removing():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")
            page.wait_for_selector("text=ExamBuilder", timeout=10000)

            # Add a question (mock q3: Solve for x)
            print("Adding question...")
            question = page.locator("text=Solve for x").first
            drop_zone = page.locator("text=Drag questions here").first
            question.drag_to(drop_zone)
            page.wait_for_selector("text=Short Answer Questions")

            # Click to edit
            print("Entering edit mode...")
            question_in_paper = page.locator("#exam-paper .group").filter(has_text="Solve for x").first
            # Note: The question in paper might have different selector structure now
            # We look for the text inside the paper container
            paper_item = page.locator("text=Solve for x").nth(1) # 0 is in sidebar, 1 is in paper
            paper_item.click()

            # Verify input appears
            print("Verifying edit input...")
            input_field = page.locator("input[type='text'][value='Solve for x: 2x + 5 = 15']")
            assert input_field.is_visible()

            # Change text
            print("Editing text...")
            input_field.fill("Solve for x: 2x = 10")

            # Save (Check button)
            print("Saving...")
            page.locator("button:has(.lucide-check)").click()

            # Verify new text
            print("Verifying new text...")
            assert page.is_visible("text=Solve for x: 2x = 10")

            # Remove (Trash button) - appears on hover
            print("Removing question...")
            paper_item_new = page.locator("text=Solve for x: 2x = 10").first
            paper_item_new.hover()
            page.locator("button[title='Remove Question']").click()

            # Verify removed (empty state returns)
            print("Verifying removal...")
            assert page.is_visible("text=Drag questions here")

            # Screenshot
            page.screenshot(path="verification/edit_remove_success.png")
            print("Screenshot saved to verification/edit_remove_success.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/edit_remove_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_editing_and_removing()
