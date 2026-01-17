from playwright.sync_api import sync_playwright

def verify_group_instructions():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")
            page.wait_for_selector("text=ExamBuilder", timeout=10000)

            # Add Short Answer Question (Math, q3)
            print("Adding Short Answer question...")
            short_answer = page.locator("text=Solve for x").first
            drop_zone = page.locator("text=Drag questions here").first
            short_answer.drag_to(drop_zone)
            page.wait_for_selector("text=Short Answer Questions")

            # Verify Instruction Text
            print("Verifying Instruction Text...")
            instruction = page.locator("text=Answer any ৫ questions")
            if not instruction.is_visible():
                print("Bengali instruction not found...")
                raise Exception("Default instruction not visible")

            assert instruction.is_visible()

            # Change Format to English and Verify
            print("Changing format to English...")
            header_group = page.locator("[class*='group/header']")
            header_group.hover()
            settings_group = page.locator("[class*='group/settings']")
            settings_group.hover()

            # Target the select inside the settings dropdown
            # It contains option 'English'
            settings_select = page.locator("select:has(option[value='english'])")
            settings_select.select_option("english")

            # Verify English Text
            print("Verifying English Instruction...")
            assert page.locator("text=Answer any 5 questions").is_visible()

            # Screenshot
            page.screenshot(path="verification/group_instructions.png")
            print("Screenshot saved to verification/group_instructions.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/group_instructions_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_group_instructions()
