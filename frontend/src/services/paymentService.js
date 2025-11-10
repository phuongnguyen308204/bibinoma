const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bibinoma.com';

class PaymentService {
  async create(amount) {
    const response = await fetch(`${API_BASE_URL}/api/v1/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP ${response.status}`);
    }
    return await response.json();
  }
}

export default new PaymentService();


