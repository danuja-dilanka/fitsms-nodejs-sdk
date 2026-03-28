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

    this.v4Base = "https://app.fitsms.lk/api/v4";

    // Default Headers
    this.headers = {
      Authorization: `Bearer ${this.apiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * Send an SMS (v4 API)
   * @param {string|string[]} recipients - e.g., "9476XXXXX,9476XXXXX"
   * @param {string} message - The SMS body
   */
  async send(recipients, message, type = "plain") {
    const allowedTypes = ["plain", "unicode"];
    if (!allowedTypes.includes(type)) {
      throw new Error(
        `FitSMS Validation Error: Invalid type '${type}'. Use 'plain' or 'unicode'.`,
      );
    }

    // 2. Process and Validate Recipients
    let rawList = Array.isArray(recipients)
      ? recipients
      : recipients.split(",");

    const validatedNumbers = rawList.map((num) => {
      // Remove all non-numeric characters (spaces, +, dashes)
      let cleaned = num.replace(/\D/g, "");

      // Convert local 07... format to 947...
      if (cleaned.startsWith("07") && cleaned.length === 10) {
        cleaned = "94" + cleaned.substring(1);
      }

      // Convert 7... format to 947...
      if (cleaned.startsWith("7") && cleaned.length === 9) {
        cleaned = "94" + cleaned;
      }

      // Final Sri Lankan Format Check (947XXXXXXXX)
      const slRegex = /^(94)(7[01245678])\d{7}$/;
      if (!slRegex.test(cleaned)) {
        throw new Error(
          `FitSMS Validation Error: Invalid Sri Lankan number found: ${num}`,
        );
      }

      return cleaned;
    });

    const recipientList = validatedNumbers.join(",");

    try {
      const response = await axios.post(
        `${this.v4Base}/sms/send`,
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
   * Check status of an existing SMS (v4 API)
   * @param {string} ruid - The unique message ID
   */
  async getStatus(ruid, recipient) {
    try {
      const response = await axios.get(`${this.v4Base}/sms/${ruid}`, {
        headers: this.headers,
        params: {
          recipient,
        },
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
