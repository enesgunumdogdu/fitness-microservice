# Fitness Microservice

[![CI/CD](https://github.com/enesgunumdogdu/fitness-microservice/actions/workflows/deploy.yml/badge.svg?branch=prod)](https://github.com/enesgunumdogdu/fitness-microservice/actions/workflows/deploy.yml?query=branch%3Aprod+event%3Apush)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Cloud-native, microservices-based fitness tracking platform with **AI-powered workout recommendations** and a **self-hosted JWT authentication service**.

Public portfolio project demonstrating Spring Cloud microservices, event-driven design, and a modern React client. Suitable for local development and study; production deployments require hardening beyond the defaults in this repo.

---

## 📋 Overview

Fitness Microservice is a modern, scalable fitness tracking system built with **Spring Boot microservices** and a **React frontend**. It leverages **Google Gemini AI** for personalized workout recommendations and an in-house **JWT auth-service** (RS256, JWKS-published) for authentication — no third-party identity provider required.

The system follows cloud-native principles such as service discovery, centralized configuration, API gateway security, and event-driven communication.

---

## 🚀 Tech Stack

### Backend
- **Java 21**, Spring Boot 3.3, Spring Cloud 2023.0
- **Spring Cloud Gateway** – API Gateway, validates JWTs as an OAuth2 Resource Server (JWKS)
- **Netflix Eureka** – Service Discovery
- **Spring Cloud Config** – Centralized Configuration
- **Spring Security** – Custom auth (registration / login / refresh / logout) issuing RS256 JWTs
- **Nimbus JOSE + JWT** – JWT signing, JWKS publication
- **Flyway** – Versioned database migrations (User Service)
- **PostgreSQL** – Relational database (User Service)
- **MongoDB** – NoSQL database (Activity & AI Services)
- **RabbitMQ** – Message broker
- **WebClient** – Reactive HTTP client
- **Google Gemini AI** – AI recommendations

### Frontend
- **React 19** + **Vite 7.2** – Modern build tool
- **Material-UI 7.3** – UI components
- **Custom AuthContext** – `localStorage`-backed session, single-flight refresh, Axios `Bearer` interceptor with 401 → refresh → retry
- **Axios** – HTTP client
- **React Router 7.10** – Client-side routing

---

## 🏗️ Architecture

### Presentation Layer
- React Frontend
- Custom email/password forms (no external IdP redirect)

### Gateway & Security Layer
- Spring Cloud Gateway with OAuth2 Resource Server JWT validation
- JWKS resolved from the in-house auth-service at `/.well-known/jwks.json`

### Infrastructure Layer
- Eureka Server (Service Discovery)
- Config Server (Centralized Config)

### Business Services
- **User Service** – user accounts + auth endpoints (`/api/auth/register|login|refresh|logout`), JWKS publication
- **Activity Service** – fitness activity tracking
- **AI Service** – workout recommendations via Gemini AI

### Data & Messaging
- **PostgreSQL** for user data persistence (schema managed by Flyway)
- **MongoDB** for activity and recommendation data
- **RabbitMQ** for asynchronous, event-driven communication

---

## 📦 Microservices

| Service          | Port | Description                                                  |
|------------------|------|--------------------------------------------------------------|
| Config Server    | 8888 | Centralized configuration management                          |
| Eureka Server    | 8761 | Service discovery and monitoring                              |
| API Gateway      | 8080 | Secure entry point and routing (JWT validation via JWKS)      |
| User Service     | 8081 | User management, auth endpoints, JWKS                         |
| Activity Service | 8082 | Fitness activity tracking                                     |
| AI Service       | 8083 | AI-powered recommendations                                    |

---

## 📁 Project Structure

```
fitness-microservice/
├── frontend/          # React application
├── configserver/      # Centralized configuration
├── eureka/            # Service discovery
├── gateway/           # API Gateway & security
├── userservice/       # User management + auth
├── activityservice/   # Activity tracking
└── aiservice/         # AI recommendations
```

---

## 🛠️ Prerequisites

- **Java 21+**, Maven 3.8+
- **Node.js 20+**, npm
- **Docker / Docker Compose** – for local infrastructure
- **PostgreSQL** (5433 in dev compose)
  - Database: `fitness_user_db`
- **MongoDB** (27017)
- **RabbitMQ** (5672, management UI on 15672)
- **Google Gemini API Key**

---

## 🚀 Getting Started

### 1. Start infrastructure services

```bash
docker compose -f docker-compose.dev.yml up -d
```

This brings up PostgreSQL, MongoDB and RabbitMQ.

### 2. Configure environment variables

```bash
export GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start backend services in order

1. Config Server
2. Eureka Server
3. API Gateway
4. User, Activity and AI Services

On first boot the User Service runs **Flyway migrations** automatically (`V1__init.sql` creates the `users` and `refresh_tokens` tables). Subsequent boots run `Schema "public" is up to date`.

### 4. Start frontend

```bash
cd frontend
npm install
npm run dev
```

**Application URL:** http://localhost:5173

---

## 🔐 Security

- **Custom JWT auth-service** (`userservice`) — `POST /api/auth/register|login|refresh|logout`
- **RS256** signed access tokens (15 min TTL) + opaque refresh tokens (30 days TTL, hashed at rest, single-use rotation)
- **JWKS** published at `/.well-known/jwks.json`; gateway validates tokens via Spring Security OAuth2 Resource Server
- **bcrypt** password hashing
- Refresh-token revocation on logout, re-use detection rejects rotated tokens

---

## 🗄️ Database Migrations

The User Service uses **Flyway** for schema management:

- Migrations live in `userservice/src/main/resources/db/migration/`
- `spring.jpa.hibernate.ddl-auto=validate` — Hibernate never auto-modifies the schema in any environment
- `flyway.baseline-on-migrate=true` makes the integration safe on pre-existing volumes
- New schema changes ship as `V2__*.sql`, `V3__*.sql`, … (never edit `V1__init.sql` post-merge — Flyway will fail the checksum)

---

## 📊 Monitoring & Management

- **Eureka Dashboard:** http://localhost:8761
- **RabbitMQ Management UI:** http://localhost:15672
- **JWKS endpoint (User Service):** http://localhost:8081/.well-known/jwks.json (the API Gateway validates JWTs against this URI; see `configserver/.../api-gateway*.yml`)

---

## ✨ Features

- Self-hosted JWT authentication (no third-party redirect)
- Fitness activity tracking (running, walking, cycling)
- AI-powered personalized workout recommendations
- Event-driven microservices architecture
- Centralized configuration and service discovery
- Versioned schema migrations via Flyway
- Modern, responsive React UI

---

## 📄 License

[MIT License](LICENSE)
