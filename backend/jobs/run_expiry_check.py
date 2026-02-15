import asyncio
from jobs.expiry_notifier import run_expiry_check_and_email

if __name__ == "__main__":
    asyncio.run(run_expiry_check_and_email())