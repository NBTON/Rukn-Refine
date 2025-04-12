# 📍 Smart Location Finder – Senior Project

This mobile app helps aspiring entrepreneurs find the best rental locations to open their shops. By analyzing data such as nearby services, demographics, competition, and more, the app recommends smart locations that increase the chances of business success.

Built with **React Native** for iOS/Android, **Node.js** backend, and enhanced using the **Google Places API** and **Machine Learning** models.

---

## 🧠 Project Overview

Many small business owners struggle to find a good location for their shops. This app solves that problem by using real-world data to suggest optimal places based on the type of business.

**Example:**  
If a user wants to open a **flower shop**, the app will:
- Suggest areas close to **hospitals**
- Check areas with **many married couples**
- Analyze **competition** from other flower shops
- Estimate **success potential** using ML

---

## 🌟 Key Features

- ✅ Input desired business type (e.g. flower shop, coffee shop, bookstore)
- 📍 Location suggestions based on:
  - Nearby services (hospitals, schools, offices)
  - Demographics (age, marital status, income)
  - Competition level
  - Foot traffic and visibility
  - Rental price vs. potential revenue
- 🧠 ML model to predict success rate
- 🗺️ Interactive map view of suggestions
- 🔒 Secure user accounts (optional)

---

## ⚙️ Tech Stack

### 💻 Frontend (Mobile)
- **React Native** (cross-platform)
- **Expo** for development & testing
- **React Native Maps** for map features

### 🌐 Backend
- **Node.js + Express** for APIs
- **MongoDB Atlas** or **Firestore** for database
- **dotenv** for environment variables

### 🔍 APIs & Services
- **Google Places API**
- **Google Maps API**
- **Open Data APIs** (for demographics)
- **Python ML model** served via API or Cloud Function

---

## 🔐 Environment Variables

Create a `.env` file in your root directory with the following:

    PORT=3000
    DB_URL=your_database_url
    GOOGLE_API_KEY=your_google_places_api_key
    JWT_SECRET=your_jwt_secret

**Important:** Do **not** upload your real `.env` file to GitHub.

---

## 🚀 Getting Started

### 1. Clone the repository

    git clone https://github.com/MQHANAD/RuknApp.git
    cd RuknApp
    npm install

### 2. Run the app

**Frontend:**

    npx expo start

---

## 👥 Team Members

- [Muhannad Alduraywish] – Mobile Developer
- [OMAR ALSHAHRANI] – Project Manager
- [HAMZA BAAQIL] – Mobile Developer
- [FERAS ALBADER] – ML/data Engineer
- [MOHAMMED ASIRI] – ML/data Engineer

---

## 📌 Project Status

📱 Currently under active development as a senior graduation project.

---

## 📄 License

This project is licensed under the MIT License.
