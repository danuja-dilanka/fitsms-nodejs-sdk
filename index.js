const axios = require("axios");

class FitSMS {
  /**
   * @param {string} apiToken - Your Bearer Token
   * @param {string} senderId - Your approved Sender ID (e.g., "The Change")
   */
  constructor(apiToken, senderId) {
    if (!apiToken || !senderId) {
      throw new Error("FitSMS: API Token and Sender ID are required.");
    }
    this.apiToken = apiToken;
    this.senderId = senderId;

    // FitSMS uses different versions for different features
    this.v3Base = "https://app.fitsms.lk/api/v3";
    this.v4Base = "https://app.fitsms.lk/api/v4";

    // Default Headers
    this.headers = {
      Authorization: `Bearer ${this.apiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * Send an SMS (v3 API)
   * @param {string|string[]} recipients - e.g., "9476111,9476222"
   * @param {string} message - The SMS body
   */
  async send(recipients, message, type = "plain") {
    const recipientList = Array.isArray(recipients)
      ? recipients.join(",")
      : recipients;

    try {
      const response = await axios.post(
        `${this.v3Base}/send/sms`,
        {
          recipient: recipientList,
          sender_id: this.senderId,
          type: type,
          message: message,
        },
        { headers: this.headers },
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `FitSMS Send Failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Check status of an existing SMS (v3 API)
   * @param {string} uid - The unique message ID
   */
  async getStatus(uid) {
    try {
      const response = await axios.get(`${this.v3Base}/sms/${uid}`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `FitSMS Status Check Failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Retrieve account balance and SMS units (v4 API)
   */
  async getBalance() {
    try {
      const response = await axios.get(`${this.v4Base}/balance`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `FitSMS Balance Check Failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Retrieve full profile information (v4 API)
   */
  async getProfile() {
    try {
      const response = await axios.get(`${this.v4Base}/me`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `FitSMS Profile Retrieval Failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}

module.exports = FitSMS;
