from fastapi import APIRouter
from datetime import datetime
import pytz


router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Bibinoma Chat API is running"}


@router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}


@router.get("/time")
async def get_current_time():
    try:
        vn_tz = pytz.timezone('Asia/Ho_Chi_Minh')
        now = datetime.now(vn_tz)
    except Exception:
        now = datetime.now()
    return {
        "current_time": now.strftime('%H:%M:%S'),
        "current_date": now.strftime('%Y-%m-%d'),
        "hour": now.hour,
        "minute": now.minute,
        "raw_datetime": str(now),
        "raw_datetime_now": str(datetime.now())
    }


