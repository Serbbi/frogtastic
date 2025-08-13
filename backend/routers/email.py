import os

import resend
from fastapi import APIRouter

router = APIRouter(prefix="/email", tags=["email"])


@router.post("/send")
async def send_email():
    resend.api_key = os.environ["RESEND_API_KEY"]

    params: resend.Emails.SendParams = {
        "from": "Serban <tonieserban@yahoo.ro>",
        "to": ["etret161@gmail.com"],
        "subject": "Buna dragoste!",
        "html": "<strong>vii des pe aici?</strong>",
    }

    email = resend.Emails.send(params)
    print(email)
