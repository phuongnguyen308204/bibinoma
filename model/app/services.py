from datetime import datetime
from typing import List, Dict, Any
import pytz


def vietnam_now():
    try:
        vn_tz = pytz.timezone('Asia/Ho_Chi_Minh')
        now = datetime.now(vn_tz)
    except Exception:
        now = datetime.now()
    return now


def summarize_current_memories(memories: List[str]) -> str:
    if not memories:
        return ""
    lines = ["\n\nKý ức từ các cuộc trò chuyện trước:"]
    for memory in memories:
        lines.append(f"- {memory}")
    return "\n".join(lines)


