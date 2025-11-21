// Placeholder – integrate any SMS provider (Twilio, MSG91 etc.)
module.exports = {
  sendSMS: async (phone, message) => {
    console.log(`📲 [SMS MOCK] To: ${phone} | Msg: ${message}`);
    return true;
  },
};
