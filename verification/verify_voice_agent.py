from playwright.sync_api import sync_playwright

def verify_voice_agent():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")
            page.wait_for_selector("text=ExamBuilder", timeout=10000)

            # 1. Verify Microphone Icon Logic
            print("Testing Voice Agent...")
            voice_btn = page.locator("button[title='AI Voice Agent']")
            assert voice_btn.is_visible()

            # Click to activate
            voice_btn.click()
            print("Clicked Voice Agent.")

            # Verify listening state (Transcript "Listening...")
            print("Verifying 'Listening...' state...")
            page.wait_for_selector("text=Listening...", timeout=5000)

            # Verify processed command "Add 5 hard questions"
            print("Verifying command processing...")
            page.wait_for_selector("text=Add 5 hard questions", timeout=5000)

            # Verify action (questions added)
            # Wait for transcript to disappear
            page.wait_for_selector("text=Add 5 hard questions", state="detached", timeout=5000)
            print("Command processed.")

            # Check if questions are in the paper
            # Look for title of first draft question
            # q1: What is the capital of Bangladesh?
            print("Checking for question in paper...")
            # We look for it inside the exam paper container
            # Using partial text match
            assert page.is_visible("text=What is the capital of Bangladesh?")

            # Screenshot
            page.screenshot(path="verification/voice_agent_success.png")
            print("Screenshot saved to verification/voice_agent_success.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/voice_agent_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_voice_agent()
