const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bibinoma.com';

class ChatService {
  async sendMessage(message, memories = [], chatType = 'planning', chatHistory = []) {
    try {
      const endpoint = chatType === 'planning' ? '/noma' : '/bibi';
      const response = await fetch(`${API_BASE_URL}/api/v1/chat${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: message,
          memories: memories,
          chat_history: chatHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
    return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async saveNewDayPrompt(text, chatType = 'planning') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/new-day-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: chatType,
          text
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error saving new day prompt:', error);
      return null;
    }
  }

  async getChatHistory(chatType = 'planning') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/history?type=${chatType}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting chat history:', error);
      return null;
    }
  }

  async getMemories(chatType = 'planning') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/memories?type=${chatType}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.memories || [];
    } catch (error) {
      console.error('Error getting memories:', error);
      return [];
    }
  }

  async deleteMemoryByIndex(index, chatType = 'planning') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/memory?type=${chatType}&index=${index}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.memories || [];
    } catch (error) {
      console.error('Error deleting memory:', error);
      throw error;
    }
  }

  async deleteHabit(weekday, habitIndex) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/habit?weekday=${encodeURIComponent(weekday)}&habit_index=${habitIndex}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  }

  async deleteChatData() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/data`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting chat data:', error);
      throw error;
    }
  }

  async deleteBibiData() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/bibi-data`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting Bibi data:', error);
      throw error;
    }
  }

  async deleteNomaData() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/noma-data`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting Noma data:', error);
      throw error;
    }
  }
}

export default new ChatService();
