from fastapi import APIRouter, HTTPException
from datetime import datetime
from .schemas import ChatRequest, ChatResponse
from .prompts import HEART_TO_HEART_SYSTEM_PROMPT
from .openai_client import client


router = APIRouter()


@router.post("/heart_to_heart", response_model=ChatResponse)
async def heart_to_heart_chat(request: ChatRequest):
    try:
        memories_context = ""
        if request.memories:
            normalized = []
            import json
            for m in request.memories:
                try:
                    if isinstance(m, str) and m.strip().startswith("{"):
                        parsed = json.loads(m)
                        text = parsed.get("memory") or m
                    elif isinstance(m, dict):
                        text = m.get("memory") or str(m)
                    else:
                        text = str(m)
                except Exception:
                    text = str(m)
                if text:
                    normalized.append(text)
            if normalized:
                memories_context = "\n\nKý ức từ các cuộc trò chuyện trước:\n" + "".join([f"- {m}\n" for m in normalized])

        system_prompt_with_memories = HEART_TO_HEART_SYSTEM_PROMPT + memories_context

        messages = [{"role": "system", "content": system_prompt_with_memories}]

        if request.chat_history:
            recent_history = request.chat_history[-10:] if len(request.chat_history) > 10 else request.chat_history
            for msg in recent_history:
                messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": request.message})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=500,
            temperature=0.8,
        )

        assistant_message = response.choices[0].message.content

        current_memories_text = ""
        if request.memories:
            current_memories_text = "\n\nKý ức hiện tại đã lưu (để tham khảo tránh trùng lặp):\n" + "\n".join([f"- {m}" for m in request.memories])

        memories_prompt = f"""
                Nhiệm vụ: Từ cặp câu sau (user + Bibi), hãy trích xuất MỘT câu tiếng Việt ngắn gọn mô tả thông tin quan trọng nhất nên lưu làm memory dài hạn.
                - Nếu không có gì đáng lưu, trả về {{}} rỗng.
                - Ví dụ câu: "User tên Nguyên", "User mới chia tay và rất buồn", "User thích chạy bộ sáng".
                - Tránh trùng lặp với danh sách memories hiện có (nếu cùng nội dung, coi như đã có).

                User: {request.message}
                Bibi: {assistant_message}
                {current_memories_text}

                Hãy trả về JSON đúng chuẩn:
                {{
                  "memory": "<một_câu_tiếng_Việt_ngắn>",
                  "timestamp": "{datetime.now().isoformat()}"
                }}
                Nếu không có gì để lưu, trả về {{}}.
                """

        memories_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": memories_prompt}],
            max_tokens=200,
            temperature=0.3,
        )

        try:
            memories_text = memories_response.choices[0].message.content or "{}"
            if memories_text.startswith("```json"):
                memories_text = memories_text.replace("```json", "").replace("```", "").strip()
            elif memories_text.startswith("```"):
                memories_text = memories_text.replace("```", "").strip()
            import json
            parsed = json.loads(memories_text)
            if isinstance(parsed, dict) and parsed.get("memory"):
                memories_dict = {"memory": parsed.get("memory"), "timestamp": parsed.get("timestamp") or datetime.now().isoformat()}
            else:
                memories_dict = {}
        except Exception:
            memories_dict = {}

        if memories_dict and "memory" in memories_dict and memories_dict["memory"]:
            bibi_with_guidance = assistant_message + "\n\n[📋 Lên kế hoạch với Noma](/chat/planning)"
        else:
            bibi_with_guidance = assistant_message

        return ChatResponse(user=request.message, noma=bibi_with_guidance, memories=memories_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



@router.post("/heart_to_heart_greeting", response_model=ChatResponse)
async def heart_to_heart_greeting(request: ChatRequest):
    try:
        latest_memory_text = ""
        if request.memories:
            import json
            from datetime import datetime as dt
            latest_ts = None
            for m in request.memories:
                try:
                    if isinstance(m, str) and m.strip().startswith("{"):
                        parsed = json.loads(m)
                    elif isinstance(m, dict):
                        parsed = m
                    else:
                        parsed = {"memory": str(m)}
                except Exception:
                    parsed = {"memory": str(m)}

                mem_text = (parsed.get("memory") or "").strip()
                ts_raw = (parsed.get("timestamp") or "").strip()
                ts_val = None
                if ts_raw:
                    try:
                        ts_val = dt.fromisoformat(ts_raw)
                    except Exception:
                        ts_val = None

                if mem_text:
                    if latest_ts is None and latest_memory_text == "":
                        latest_memory_text = mem_text
                    if ts_val is not None:
                        if latest_ts is None or ts_val > latest_ts:
                            latest_ts = ts_val
                            latest_memory_text = mem_text

        if latest_memory_text:
            context_line = f"Bối cảnh gần nhất: '{latest_memory_text}'."
        else:
            context_line = ""

        prompt = (
            "Bạn là Bibi - người bạn tâm sự ấm áp.\n"
            "NHIỆM VỤ: Tạo đúng MỘT câu hỏi hỏi thăm ngắn gọn, đồng cảm cho hôm nay.\n"
            "BẮT BUỘC: Nếu có bối cảnh, PHẢI nhắc NGẮN tới bối cảnh đó trong chính câu hỏi.\n"
            "VÍ DỤ: 'Bibi nhớ chuyện chia tay gần đây của bạn, hôm nay bạn thấy sao rồi?'\n"
            "ĐỊNH DẠNG: Một câu duy nhất, không xuống dòng, không markdown, không giải thích.\n"
            f"{context_line}"
        )

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=80,
            temperature=0.3,
        )

        assistant_message = response.choices[0].message.content
        return ChatResponse(user="", noma=assistant_message, memories={})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")