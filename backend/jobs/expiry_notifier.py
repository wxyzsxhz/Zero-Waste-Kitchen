from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from collections import defaultdict

from database import ingredient_collection, user_collection
from email_config import fm
from fastapi_mail import MessageSchema

from bson import ObjectId

TZ = ZoneInfo("Asia/Yangon")

# 0 = only today. Use 3 or 7 if you want “nearly expiring”
NEARLY_DAYS = 0


def parse_date_yyyy_mm_dd(s: str):
    # Your expiryDate should be like "2026-02-17"
    return datetime.strptime(s, "%Y-%m-%d").date()


async def send_expiry_email(email: str, items: list[dict], today_str: str):
    # Build an HTML list
    rows = ""
    for i in items:
        rows += f"""
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">{i.get("name","")}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align:center;">
                {i.get("quantity","")} {i.get("unit","")}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align:center;">
                {i.get("expiryDate","")}
            </td>
        </tr>
        """

    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <div style="background-color: #4CAF50; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Zero-Waste Kitchen</h1>
        </div>

        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
            <h2 style="color: #333; margin-top: 0;">Ingredients expiring soon</h2>

            <p style="color: #555; line-height: 1.6;">
                Here are the ingredients that are expiring soon (checked on {today_str}):
            </p>

            <table style="width:100%; border-collapse: collapse; background: white; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                <thead>
                    <tr style="background:#e8f5e9;">
                        <th style="padding: 10px; text-align:left;">Ingredient</th>
                        <th style="padding: 10px; text-align:center;">Amount</th>
                        <th style="padding: 10px; text-align:center;">Expiry</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>

            <p style="color: #777; font-size: 14px; margin-top: 20px;">
                Tip: Use them soon to reduce waste.
            </p>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="Ingredients expiring soon - Zero-Waste Kitchen",
        recipients=[email],
        body=html,
        subtype="html",
    )
    await fm.send_message(message)


async def run_expiry_check_and_email():
    today = datetime.now(TZ).date()
    cutoff = today + timedelta(days=NEARLY_DAYS)
    today_str = today.strftime("%Y-%m-%d")

    # Only fetch ingredients with expiryDate and user_id
    cursor = ingredient_collection.find({
        "expiryDate": {"$ne": None},
        "user_id": {"$exists": True, "$ne": None},
    })

    expiring_by_user = defaultdict(list)

    async for ing in cursor:
        user_id = ing.get("user_id")
        exp_str = ing.get("expiryDate")

        if not user_id or not exp_str:
            continue

        try:
            exp = parse_date_yyyy_mm_dd(exp_str)
        except Exception:
            continue

        if today <= exp <= cutoff:
            expiring_by_user[user_id].append({
                "name": ing.get("name", ""),
                "quantity": ing.get("quantity", ""),
                "unit": ing.get("unit", ""),
                "expiryDate": exp_str,
            })

    # If no expiring items -> send nothing
    if not expiring_by_user:
        print("[expiry_notifier] No expiring ingredients today. No email sent.")
        return

    # Send ONE email per user
    for user_id, items in expiring_by_user.items():
        user = None
        # 1) try ObjectId lookup (most common)
        try:
            user = await user_collection.find_one({"_id": ObjectId(str(user_id))})
        except Exception:
            pass
        # 2) fallback: string _id lookup
        if not user:
            user = await user_collection.find_one({"_id": str(user_id)})

        # 3) fallback: maybe users store it in "user_id"
        if not user:
            user = await user_collection.find_one({"user_id": str(user_id)})

        if not user:
            print(f"[expiry_notifier] No user found for user_id={user_id}. Skipping email.")
            continue
            # IMPORTANT: user_id in ingredients might be stored as string.
            # Your users might store _id as ObjectId.
            # Try both lookups.
            user = await user_collection.find_one({"_id": user_id})
            if not user:
                user = await user_collection.find_one({"_id": str(user_id)})

            if not user:
                print(f"[expiry_notifier] No user found for user_id={user_id}. Skipping email.")
                continue

        email = user.get("email")
        if not email:
            print(f"[expiry_notifier] User {user_id} has no email. Skipping.")
            continue

        try:
            await send_expiry_email(email, items, today_str)
            print(f"[expiry_notifier] Sent expiry email to {email} with {len(items)} items.")
        except Exception as e:
            print(f"[expiry_notifier] Failed sending email to {email}: {e}")