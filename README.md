# FitSMS Node.js SDK

[![npm version](https://img.shields.io/npm/v/fitsms.svg)](https://www.npmjs.com/package/fitsms)
[![license](https://img.shields.io/npm/l/fitsms.svg)](https://github.com/yourusername/fitsms)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/fitsms/pulls)

A high-performance, Promise-based Node.js wrapper for the [FitSMS.lk](https://fitsms.lk) API. This SDK provides a clean interface for sending SMS, checking delivery status, and managing account balances.

---

## 🚀 Features

- **Bearer Token Auth**: Secure authentication via headers.
- **Flexible Recipients**: Supports strings, comma-separated lists, and arrays.
- **Real-time Status**: Retrieve delivery reports using message UIDs.
- **Balance Monitoring**: Track remaining SMS units.
- **Lightweight**: Minimal dependencies.

---

## 📦 Installation

```bash
npm install fitsms
```

---

## 🛠 Usage

### Initialization

```js
const FitSMS = require("fitsms");

const sms = new FitSMS("YOUR_BEARER_TOKEN", "The Change");
```

---

### Sending SMS

```js
async function sendAlert() {
  try {
    const recipients = ["94XXXXXXXXX", "94XXXXXXXX"];

    const response = await sms.send(
      recipients,
      "This is a test message from FitSMS SDK",
    );

    console.log("Success:", response.data.uid);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

---

### Checking Message Status

```js
const status = await sms.getStatus("606812e63f78b");
console.log("Delivery Status:", status.data.status);
```

---

### Checking Balance

```js
const balance = await sms.getBalance();
console.log("Remaining Units:", balance.data);
```

---

## 📖 API Reference

| Method       | Parameters                | Description         |
| ------------ | ------------------------- | ------------------- |
| send()       | recipients, message, type | Sends an SMS        |
| getStatus()  | uid                       | Get delivery status |
| getBalance() | none                      | Get SMS balance     |
| getProfile() | none                      | Get account profile |

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 👨‍💻 Maintainer

Maintained by [Global Cloud Media (pvt) Ltd.](https://globalcloudmedia.lk)
