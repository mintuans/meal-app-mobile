const aiService = {
  /**
   * Scan receipt using Mindee API
   * @param {string} imageBase64 - Base64 encoded image
   * @returns {Array} - Array of line items
   */
  async scanReceipt(imageBase64) {
    const MINDEE_API_KEY = process.env.MINDEE_API_KEY;
    if (!MINDEE_API_KEY) {
      throw { status: 500, message: 'Mindee API Key is not configured' };
    }

    try {
      // Mindee Receipt API endpoint v5
      const url = 'https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict';
      
      // Gỡ bỏ prefix 'data:image/...;base64,' nếu có
      const bodyBase64 = imageBase64.includes(';base64,') 
        ? imageBase64.split(';base64,')[1] 
        : imageBase64;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${MINDEE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document: bodyBase64
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Mindee API Error:', data);
        throw { status: response.status, message: 'Lỗi từ Mindee OCR' };
      }

      // Trích xuất line_items từ kết quả trả về
      // Lưu ý: Mindee v5 trả về cấu trúc này
      const prediction = data.document.inference.prediction;
      const lineItems = prediction.line_items || [];

      // Chuẩn hóa dữ liệu trả về cho frontend
      return lineItems.map(item => ({
        description: item.description || 'Chưa rõ mặt hàng',
        quantity: item.quantity || 1,
        unit_price: item.unit_price || 0,
        total_amount: item.total_amount || 0
      }));

    } catch (error) {
      console.error('Scan receipt error:', error);
      throw error.status ? error : { status: 500, message: 'Lỗi khi quét hóa đơn' };
    }
  }
};

module.exports = aiService;
