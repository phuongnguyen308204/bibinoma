from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    message: str
    memories: Optional[List[str]] = []
    chat_history: Optional[List[ChatMessage]] = []
    existing_issue: Optional[str] = ""


class ChatResponse(BaseModel):
    user: str
    noma: str
    memories: Dict[str, Any]


