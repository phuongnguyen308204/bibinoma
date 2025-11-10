from fastapi import APIRouter, HTTPException
from datetime import datetime
import json
from .schemas import ChatRequest, ChatResponse
from .prompts import PLANNING_SYSTEM_PROMPT
from .services import vietnam_now, summarize_current_memories
from .openai_client import client

def get_vietnamese_weekday(weekday_num):
    """Convert weekday number to Vietnamese weekday name"""
    weekdays = {
        0: "Thứ Hai",    
        1: "Thứ Ba",     
        2: "Thứ Tư",    
        3: "Thứ Năm",    
        4: "Thứ Sáu",    
        5: "Thứ Bảy",    
        6: "Chủ Nhật"    
    }
    return weekdays.get(weekday_num, "Thứ Hai")


router = APIRouter()


def extract_habits_from_message(message: str):
    """Extract user habits/preferences from ONLY the current request message.

    Returns a list of strings; does not persist anything.
    """
    try:
        prompt = (
            "NHIỆM VỤ: Trích xuất THÓI QUEN và SỞ THÍCH từ tin nhắn hiện tại.\n"
            "- Chỉ dựa vào NỘI DUNG TIN NHẮN NÀY, không dùng ngữ cảnh khác.\n"
            "- Trả về JSON: {\"habits\": [\"...\"]}. Không giải thích thêm.\n\n"
            f"TIN NHẮN: \"{message}\"\n\n"
            "GỢI Ý NHẬN DIỆN:\n"
            "- Lịch trình/giờ giấc lặp lại (vd: 8h đi học, 12h ăn trưa)\n"
            "- Sở thích tích cực (vd: thích đọc sách, tập gym buổi sáng)\n"
            "- Sở thích tiêu cực (vd: không thích nghe nhạc, ghét đọc sách)\n"
            "- Chuyển cụm thời gian thành thói quen (vd: 15h-17h đi học)\n"
        )
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.2,
        )
        content = resp.choices[0].message.content or "{}"
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "").strip()
        elif content.startswith("```"):
            content = content.replace("```", "").strip()
        data = json.loads(content)
        habits = data.get("habits", [])
        return [h for h in habits if isinstance(h, str) and h.strip()]
    except Exception:
        return []


@router.post("/planning", response_model=ChatResponse)
async def planning_chat(request: ChatRequest):
    try:
        now = vietnam_now()
        current_date = now.strftime('%Y-%m-%d')
        current_time = now.strftime('%H:%M')
        current_hour = now.hour
        current_minute = now.minute
        current_weekday = get_vietnamese_weekday(now.weekday())
        

        memories_context = ""
        has_plan_today = False
        saved_issue = ""
        extracted_habits = extract_habits_from_message(request.message)
        try:
            print("[planning] extracted habits:", extracted_habits)
        except Exception:
            pass
        
        if hasattr(request, 'existing_issue') and request.existing_issue:
            saved_issue = request.existing_issue

        if request.memories:
            memories_context = summarize_current_memories(request.memories)
            
            for memory in request.memories:
                if "plans_data:" in memory:
                    try:
                        parts = memory.split("plans_data:", 1)
                        if len(parts) > 1:
                            plans_data = json.loads(parts[1])
                            if "timestamp" in plans_data:
                                plan_date = datetime.fromisoformat(plans_data["timestamp"].replace('Z', '+00:00')).strftime('%Y-%m-%d')
                                if plan_date == current_date:
                                    has_plan_today = True
                            if "issue" in plans_data and plans_data["issue"]:
                                saved_issue = plans_data["issue"]
                    except Exception:
                        pass

        if request.memories:
            memories_context += f"\nNgày hiện tại: {current_date}\n"
            memories_context += f"Giờ hiện tại: {current_time} ({current_hour} giờ {current_minute} phút)\n"
            memories_context += f"QUAN TRỌNG: Bạn PHẢI sử dụng chính xác thời gian này: {current_hour} giờ {current_minute} phút. KHÔNG được sử dụng thời gian khác!\n"
            
            if extracted_habits:
                memories_context += f"\nTHÓI QUEN VÀ SỞ THÍCH CỦA NGƯỜI DÙNG CHO {current_weekday}:\n"
                for habit in extracted_habits:
                    memories_context += f"- {habit}\n"
                memories_context += f"QUAN TRỌNG VỀ THÓI QUEN:\n"
                memories_context += f"1. BẮT BUỘC phải NHẮC LẠI những thói quen này trong câu trả lời trước khi lập kế hoạch\n"
                memories_context += f"2. Ví dụ: 'Tôi nhớ hôm nay ({current_weekday}) bạn thường [liệt kê từng habit], mình sẽ tối ưu kế hoạch dựa trên những thói quen này nhé!'\n"
                memories_context += f"3. Sau đó hãy SUY LUẬN và TỐI ƯU kế hoạch dựa trên những thông tin này, KHÔNG copy y chang mà hãy tạo ra kế hoạch PHÙ HỢP và HIỆU QUẢ hơn\n"
                memories_context += f"4. Ví dụ suy luận: 'tập gym buổi sáng' → sắp xếp hoạt động thể chất phù hợp với vấn đề, 'thích đọc sách' → thêm thời gian học tập liên quan đến vấn đề\n"
                memories_context += f"5. QUAN TRỌNG - XỬ LÝ SỞ THÍCH TIÊU CỰC: Nếu có thói quen 'không thích' thì TRÁNH đề xuất hoạt động đó\n"
                memories_context += f"   - 'không thích nghe nhạc' → TRÁNH đề xuất hoạt động âm nhạc, thay bằng hoạt động khác\n"
                memories_context += f"   - 'không thích tập gym' → đề xuất hoạt động thể chất khác (đi bộ, yoga tại nhà)\n"
                memories_context += f"   - 'không thích dậy sớm' → sắp xếp kế hoạch phù hợp với giờ dậy muộn hơn\n"

            if has_plan_today:
                memories_context += f"QUAN TRỌNG: Người dùng đã có kế hoạch cho hôm nay ({current_date}). Nếu người dùng muốn tối ưu kế hoạch hôm nay thì xem xét thông tin từ người dùng và cập nhật kế hoạch mới tốt hơn, đè lên kế hoạch cũ."
            else:
                if current_hour < 6:
                    time_period = "sáng sớm"
                elif current_hour < 12:
                    time_period = "sáng"
                elif current_hour < 18:
                    time_period = "chiều"
                else:
                    time_period = "tối"

                if saved_issue:
                    memories_context += f"QUAN TRỌNG: Người dùng đã có vấn đề rõ ràng: '{saved_issue}'. BẮT BUỘC phải đưa ra kế hoạch chi tiết đầy đủ. Nếu người dùng đề cập vấn đề khác hoàn toàn, TỪ CHỐI tạo kế hoạch cho vấn đề mới. Nhắc nhẹ nhàng rằng bạn đang hỗ trợ vấn đề đầu tiên và họ cần tự xóa dữ liệu để bắt đầu lập kế hoạch cho vấn đề khác. Nếu người dùng cung cấp thông tin bổ sung (như lịch trình, hoạt động cụ thể, cảm xúc hiện tại) thì TRỰC TIẾP tối ưu kế hoạch hôm nay dựa trên tình hình thực tế, KHÔNG cần giải thích hay hỏi lại."
                else:
                    memories_context += (
                        "QUAN TRỌNG: Chưa có issue được lưu. TUYỆT ĐỐI KHÔNG lập kế hoạch. "
                        "Chỉ đặt một câu hỏi ngắn gọn, thân thiện yêu cầu người dùng nêu rõ vấn đề/nội dung hoặc lý do cần lập kế hoạch. "
                        "KHÔNG đưa ra danh sách công việc, lịch trình hay bất kỳ kế hoạch nào. "
                        "Hãy thể hiện sự quan tâm và sẵn sàng hỗ trợ khi họ chia sẻ vấn đề."
                    )

        system_prompt_with_memories = PLANNING_SYSTEM_PROMPT + memories_context
        messages = [{"role": "system", "content": system_prompt_with_memories}]

        if request.chat_history:
            recent_history = request.chat_history[-10:] if len(request.chat_history) > 10 else request.chat_history
            for msg in recent_history:
                messages.append({"role": msg.role, "content": msg.content})

        if 0 <= current_hour <= 5:
            time_period = "SÁNG SỚM"
        elif 6 <= current_hour <= 11:
            time_period = "SÁNG"
        elif 12 <= current_hour <= 17:
            time_period = "CHIỀU"
        elif 18 <= current_hour <= 21:
            time_period = "TỐI"
        else:
            time_period = "ĐÊM"
        
        user_message_with_time = f"{request.message}\n\n[THỜI GIAN HIỆN TẠI: {current_hour} giờ {current_minute} phút {time_period} - {current_date}]"
        messages.append({"role": "user", "content": user_message_with_time})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=1500,
            temperature=0.6,
        )

        assistant_message = response.choices[0].message.content

        current_memories_text = ""
        if request.memories:
            current_memories_text = "\n\nKý ức hiện tại đã lưu:\n" + "".join([f"- {m}\n" for m in request.memories])

        memories_prompt = f"""
            NHIỆM VỤ: Trích xuất KẾ HOẠCH và VẤN ĐỀ của người dùng từ cuộc trò chuyện.

            QUY TẮC:
            1. NẾU NOMA TẠO KẾ HOẠCH (có thời gian + hoạt động): LƯU TẤT CẢ
            2. NẾU NOMA CHỈ TRÒ CHUYỆN: trả về {{}}

            PHÂN TÍCH PHẢN HỒI:
            {assistant_message}

            HƯỚNG DẪN TRÍCH XUẤT KẾ HOẠCH:
            - Tìm TẤT CẢ dòng có format: "số. **thời gian**: hoạt động"
            - Ví dụ: "1. **6:00-8:00**: Dậy sớm, tập thể dục"
            - Trích xuất thành: "6:00-8:00: Dậy sớm, tập thể dục"
            - PHẢI lấy HET, không được bỏ sót

            TRÍCH XUẤT VẤN ĐỀ:
            - Phân tích TOÀN BỘ cuộc trò chuyện để tìm vấn đề thực tế
            - Tin nhắn hiện tại: "{request.message}"
            - Lịch sử chat: {[f"{msg.role}: {msg.content}" for msg in request.chat_history]}
            - Tìm vấn đề chính từ các tin nhắn trước đó, KHÔNG chỉ tin nhắn cuối cùng
            - Nếu người dùng nói "ok", "được", "có" → tìm vấn đề từ tin nhắn trước đó
            - Ví dụ: nếu có "chia tay" trong lịch sử → issue: "Chia tay người yêu"
            - Ví dụ: nếu có "stress" trong lịch sử → issue: "Stress và áp lực"
            - Tóm tắt vấn đề chính từ TOÀN BỘ cuộc trò chuyện, KHÔNG dùng "Hỗ trợ lập kế hoạch"
            - QUAN TRỌNG: KHÔNG tạo hoặc thay đổi issue chỉ vì người dùng nêu thói quen/sở thích (vd: "t thích đi dạo"). CHỈ thay đổi issue khi người dùng NÓI RÕ muốn bắt đầu/chuyển sang vấn đề mới
            - CÁC CỤM TỪ CHO PHÉP thay đổi issue: "bắt đầu vấn đề mới", "đổi vấn đề", "đổi chủ đề", "tạo vấn đề mới", "start new issue", "change issue"

            LƯU Ý: KHÔNG trích xuất hay lưu thói quen/sở thích trong bước này.

            {current_memories_text}

            TRẢ VỀ JSON:
            - Có kế hoạch: {{"issue": "VẤN ĐỀ THỰC TẾ", "plans": [{{"date": "{now.strftime('%Y-%m-%d')}", "plans": ["6:00-7:30: Dậy sớm, tập thể dục nhẹ", "7:30-8:30: Ăn sáng, đọc tin tức", "8:30-11:00: Làm việc cá nhân quan trọng", "11:00-12:00: Nghỉ ngơi, thư giãn", "12:00-13:30: Ăn trưa, nghỉ ngơi", "13:30-15:00: Đi dạo, thư giãn", "15:00-17:00: Làm việc cá nhân", "17:00-18:00: Nghỉ ngơi, uống trà", "18:00-19:00: Ăn tối", "19:00-19:30: Coi phim ngắn", "19:30-22:00: Thư giãn, chuẩn bị ngủ"], "timestamp": "{now.isoformat()}"}}]}}
            - Không có: {{}}
            
            LƯU Ý: KHÔNG lưu thói quen/sở thích trong memories; chỉ lưu kế hoạch và vấn đề nếu có.
        """

        memories_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": memories_prompt}],
            max_tokens=1500,
            temperature=0.3,
        )

        try:
            memories_text = memories_response.choices[0].message.content
            if memories_text.startswith("```json"):
                memories_text = memories_text.replace("```json", "").replace("```", "").strip()
            elif memories_text.startswith("```"):
                memories_text = memories_text.replace("```", "").strip()
            memories_dict = json.loads(memories_text)
            if isinstance(memories_dict, dict) and "habits" in memories_dict:
                memories_dict.pop("habits", None)
            if "plans" in memories_dict:
                if not memories_dict["plans"] or len(memories_dict["plans"]) == 0:
                    memories_dict = {}
        except Exception:
            memories_dict = {}

        if extracted_habits:
            if not isinstance(memories_dict, dict) or not memories_dict:
                memories_dict = {}
            memories_dict["habits"] = extracted_habits

        if "issue" in memories_dict and memories_dict["issue"]:
            noma_with_guidance = assistant_message + "\n\n[💬 Tâm sự với Bibi](/chat/heart-to-heart)"
        else:
            noma_with_guidance = assistant_message

        return ChatResponse(user=request.message, noma=noma_with_guidance, memories=memories_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/planning_greeting", response_model=ChatResponse)
async def planning_greeting(request: ChatRequest):
    try:
        saved_issue = (request.existing_issue or "").strip()
        if not saved_issue and request.memories:
            try:
                for mem in request.memories:
                    if isinstance(mem, str) and mem.startswith("plans_data:"):
                        data = json.loads(mem.split("plans_data:", 1)[1])
                        if isinstance(data, dict) and data.get("issue"):
                            saved_issue = str(data["issue"]).strip()
                            break
            except Exception:
                pass

        base = "Bạn là Noma - trợ lý lập kế hoạch nhưng nói chuyện tự nhiên. Hãy tạo MỘT câu hỏi ngắn gọn, thân thiện để hỏi thăm hôm nay. Không xuống dòng, không markdown, không giải thích."
        if saved_issue:
            base += f"\n\nBối cảnh: Vấn đề đã lưu của người dùng là: '{saved_issue}'. Có thể nhắc ngắn gọn nếu phù hợp."

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": PLANNING_SYSTEM_PROMPT}, {"role": "user", "content": base}],
            max_tokens=80,
            temperature=0.6,
        )
        assistant_message = response.choices[0].message.content
        return ChatResponse(user="", noma=assistant_message, memories={})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

