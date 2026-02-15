from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os

# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME="zerowastekitchenteam@gmail.com",
    MAIL_PASSWORD="eixd jour krjk ksaf",
    MAIL_FROM="zerowastekitchenteam@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="Zero Waste Kitchen",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

# Create FastMail instance
fm = FastMail(conf)