# 🏠 RoomMateX – Room & Roommate Matching Platform

A secure, scalable full-stack web application designed to help users find compatible rooms and roommates within a specific location.

RoomMateX focuses on **preference-based matching, trust, and safety**, making shared living more comfortable and reliable.

---

## 📌 Project Overview

RoomMateX is built to solve common shared-living problems by providing:

- Reliable room and roommate discovery  
- Preference-based compatibility matching  
- A trust system powered by reviews and admin moderation  

The platform supports **two primary roles**:

- 👤 **User** – Room seekers & room owners  
- 🛡️ **Admin** – Platform moderator for safety, verification, and trust  

---

## 🎯 Objectives

- Provide a reliable platform for room & roommate matching  
- Reduce conflicts using lifestyle and preference matching  
- Ensure safety through authentication, admin moderation, and reviews  
- Design a scalable system with future expansion and revenue potential  

---

## 🌟 Key Features & Functionality

### 👤 User Features

- User registration and secure login  
- Email / OTP-based verification  
- Profile creation including:
  - Age and profession  
  - Hobbies and lifestyle preferences  
  - Budget range  
- Add, update, and delete room listings  
- Search rooms and roommates by location  
- Compatibility score based on preferences  
- In-app communication (chat-ready architecture)  
- View trust score and user reviews  
- Submit reviews after verified room stay  

---

### 🛡️ Admin Features

- Separate admin dashboard  
- View and manage all users  
- Verify or reject user accounts  
- Monitor and moderate room listings  
- Handle reports and complaints  
- Block or suspend malicious users  
- Maintain overall platform safety and trust  

---

## 🔐 Authentication & Security

- Password hashing using bcrypt / passlib  
- JWT-based authentication  
- Role-based access control (User / Admin)  
- Protected API routes  
- Report and block functionality  

---

## ⭐ Review & Trust System

- Reviews allowed only after verified interactions  
- Ratings based on:
  - Cleanliness  
  - Behavior  
  - Communication  
- Overall trust score displayed on user profiles  
- Repeated negative reviews trigger admin actions  

---

## 🏗️ System Architecture
React (Frontend)
↓
FastAPI (Backend – REST APIs)
↓
PostgreSQL (Database)


## 🛠️ Technology Stack

### 🌐 Frontend
- React.js (JavaScript)  
- HTML5, CSS3  
- Tailwind CSS / Bootstrap  
- Axios / Fetch API  


### ⚙️ Backend
- Python  
- FastAPI  
- RESTful API architecture  
- JWT authentication  


### 🗄️ Database
- PostgreSQL  
- SQLAlchemy ORM


## 🚀 Future Enhancements
- AI/ML-based roommate recommendation  
- Real-time chat system  
- Mobile application (Android / iOS)  
- Identity verification system  
- Payment integration for premium features


## 👥 Project Contributors
- **Frontend Development:** Mahek Saradva  
- **Backend Development:** Aayush Savaliya  


⭐ If you like this project, don’t forget to star the repository!
