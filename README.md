# Fitness Microservice

Cloud‑native, microservices‑based fitness tracking platform with **AI‑powered workout recommendations** and **OAuth2 authentication**.

---

## 📋 Overview

Fitness Microservice is a modern, scalable fitness tracking system built with **Spring Boot microservices** and a **React frontend**. It leverages **Google Gemini AI** for personalized workout recommendations and **Keycloak** for secure authentication.

The system follows cloud‑native principles such as service discovery, centralized configuration, API gateway security, and event‑driven communication.

---

## 🚀 Tech Stack

### Backend
- **Java 21**, Spring Boot 4.0.0, Spring Cloud 2025.1.0
- **Spring Cloud Gateway** – API Gateway
- **Netflix Eureka** – Service Discovery
- **Spring Cloud Config** – Centralized Configuration
- **Spring Security** – OAuth2 Resource Server, JWT
- **Keycloak** – OAuth2 / OIDC Identity Provider
- **MongoDB** – NoSQL Database
- **RabbitMQ** – Message Broker
- **WebClient** – Reactive HTTP Client
- **Google Gemini AI** – AI Recommendations

### Frontend
- **React 19** + **Vite 7.2** – Modern Build Tool
- **Material‑UI 7.3** – UI Components
- **Redux Toolkit 2.11** – State Management
- **OAuth2 Authorization Code Flow with PKCE** – Secure Auth
- **Axios** – HTTP Client
- **React Router 7.10** – Client-side Routing

---

## 🏗️ Architecture

### Presentation Layer
- React Frontend
- OAuth2 / JWT based authentication

### Gateway & Security Layer
- Spring Cloud Gateway
- Keycloak integration

### Infrastructure Layer
- Eureka Server (Service Discovery)
- Config Server (Centralized Config)

### Business Services
- **User Service** – user profiles and roles
- **Activity Service** – fitness activity tracking
- **AI Service** – workout recommendations via Gemini AI

### Data & Messaging
- **MongoDB** for persistence
- **RabbitMQ** for asynchronous, event‑driven communication

---

## 📦 Microservices

| Service          | Port | Description                          |
|------------------|------|--------------------------------------|
| Config Server    | 8888 | Centralized configuration management |
| Eureka Server    | 8761 | Service discovery and monitoring     |
| API Gateway      | 8080 | Secure entry point and routing       |
| User Service     | 8081 | User management and roles            |
| Activity Service | 8082 | Fitness activity tracking            |
| AI Service       | 8083 | AI‑powered recommendations           |

---

## 📁 Project Structure

```
fitness-microservice/
├── frontend/          # React application
├── configserver/      # Centralized configuration
├── eureka/            # Service discovery
├── gateway/           # API Gateway & security
├── userservice/       # User management
├── activityservice/   # Activity tracking
└── aiservice/         # AI recommendations
```

---

## 🛠️ Prerequisites

- **Java 21+**, Maven 3.8+
- **Node.js 18+**, npm
- **MongoDB** (27017)
- **RabbitMQ** (5672)
- **Keycloak** (8181)
  - Realm: `fitness-oauth2`
  - Client: `oauth2-pkce-client`
- **Google Gemini API Key**

---

## 🚀 Getting Started

### 1. Start infrastructure services
- MongoDB
- RabbitMQ
- Keycloak

### 2. Configure Gemini API key
```yaml
aiservice/src/main/resources/application.yml
```

### 3. Start backend services in order
- Config Server
- Eureka Server
- API Gateway
- User, Activity and AI Services

### 4. Start frontend
```bash
npm install
npm run dev
```

**Application URL:** http://localhost:5173

---

## 🔐 Security

- OAuth2 Authorization Code Flow with PKCE
- JWT‑based authentication and authorization
- Spring Security OAuth2 Resource Server
- Automatic user synchronization with Keycloak

---

## 📊 Monitoring & Management

- **Eureka Dashboard:** http://localhost:8761
- **RabbitMQ Management UI:** http://localhost:15672
- **Keycloak Admin Console:** http://localhost:8181

---

## ✨ Features

- Secure authentication with OAuth2 / OIDC
- Fitness activity tracking (running, cycling, gym, etc.)
- AI‑powered personalized workout recommendations
- Event‑driven microservices architecture
- Centralized configuration and service discovery
- Modern, responsive React UI

---

## 📄 License

MIT License
