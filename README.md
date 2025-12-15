# Fitness Microservice

A cloud-native fitness tracking application built with microservices architecture, featuring AI-powered workout recommendations using Google Gemini AI.

## 🏗️ Architecture

This application follows a microservices architecture pattern with the following components:


### Service Communication
- **Synchronous**: REST APIs with WebClient
- **Asynchronous**: Event-driven communication via RabbitMQ
- **Service Discovery**: Netflix Eureka for dynamic service registration and discovery
- **Centralized Configuration**: Spring Cloud Config Server

## 🚀 Technologies

### Core Framework
- **Java 21**: Modern Java LTS version
- **Spring Boot 4.0.0**: Latest Spring Boot framework
- **Spring Cloud 2025.1.0**: Cloud-native tooling
- **Maven**: Dependency management and build automation

### Spring Cloud Components
- **Spring Cloud Config Server**: Centralized configuration management
- **Netflix Eureka**: Service discovery and registration
- **Spring Cloud Config Client**: Dynamic configuration loading

### Data & Messaging
- **MongoDB**: NoSQL database for flexible data storage
- **RabbitMQ (AMQP)**: Message broker for asynchronous communication
- **Spring Data MongoDB**: Database access layer

### Communication
- **Spring WebMVC**: RESTful API development
- **Spring WebFlux**: Reactive programming with WebClient
- **WebClient**: Non-blocking HTTP client for inter-service communication

### AI Integration
- **Google Gemini AI**: AI-powered workout recommendations and fitness insights

### Development Tools
- **Lombok**: Reduces boilerplate code
- **Spring Boot DevTools**: Enhanced development experience

## 📦 Microservices

### 1. Config Server (Port: 8888)
Centralized configuration management for all microservices.

**Responsibilities:**
- Manages application configurations for all services
- Provides environment-specific configurations
- Supports dynamic configuration updates

**Configuration Files:**
- `api-gateway.yml`
- `activity-service.yml`
- `ai-service.yml`
- `user-service.yml`

### 2. Eureka Server (Port: 8761)
Service registry and discovery server.

**Responsibilities:**
- Service registration and health monitoring
- Service discovery for inter-service communication
- Load balancing support

**Dashboard:** http://localhost:8761

### 3. API Gateway (Port: 8080)
Single entry point for all client requests.

**Responsibilities:**
- Routes incoming requests to appropriate microservices
- Load balancing across service instances
- Centralized request handling
- Service discovery integration via Eureka

**Routing Configuration:**
- `/api/users/**` → User Service
- `/api/activities/**` → Activity Service
- `/api/recommendations/**` → AI Service

**Key Components:**
- Spring Cloud Gateway (WebMVC)
- Eureka client for service discovery
- Config Server integration for dynamic routing

### 4. User Service
User management and authentication service.

**Responsibilities:**
- User registration and profile management
- User authentication and authorization
- User role management (UserRole enum)
- Provides user validation for other services

**Key Components:**
- MongoDB for user data persistence
- RESTful APIs for user operations
- User validation endpoints

### 5. Activity Service
Fitness activity tracking and management.

**Responsibilities:**
- Records and manages fitness activities (running, cycling, gym, etc.)
- Activity type management (ActivityType enum)
- User validation before activity creation
- Publishes activity events to RabbitMQ for AI processing

**Key Components:**
- MongoDB for activity data
- RabbitMQ publisher for activity events
- WebClient for user validation
- Integration with User Service

**Activity Types:**
- Running, Walking, Cycling, Swimming, Gym, Yoga, etc.

### 6. AI Service
AI-powered fitness recommendations using Google Gemini.

**Responsibilities:**
- Consumes activity events from RabbitMQ
- Generates personalized workout recommendations
- Analyzes fitness patterns and provides insights
- Stores recommendations in MongoDB

**Key Components:**
- Gemini AI integration for intelligent recommendations
- RabbitMQ consumer (ActivityMessageListener)
- MongoDB for recommendation storage
- Activity analysis and pattern recognition

**AI Features:**
- Personalized workout suggestions
- Fitness goal recommendations
- Activity pattern analysis

## 🛠️ Prerequisites

- **Java 21** or higher
- **Maven 3.8+**
- **MongoDB** (running on default port 27017)
- **RabbitMQ** (running on default port 5672)
- **Google Gemini API Key** (for AI Service)


## 📝 API Documentation

All APIs are accessed through the API Gateway at `http://localhost:8080`.

### User Service
- `POST /api/users/register` - Register new user
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users` - List all users

### Activity Service
- `POST /api/activities` - Create new activity
- `GET /api/activities/{id}` - Get activity by ID
- `GET /api/activities/user/{userId}` - Get user's activities

### AI Service
- `GET /api/recommendations/{userId}` - Get AI recommendations for user
- `GET /api/recommendations` - Get all recommendations

## 🔧 Configuration

Each service is configured through Spring Cloud Config Server. Configuration files are located in:
```
configserver/src/main/resources/config/
├── api-gateway.yml
├── activity-service.yml
├── ai-service.yml
└── user-service.yml
```

### Default Ports
- Config Server: 8888
- Eureka Server: 8761
- API Gateway: 8080
- User Service: (configured in config server)
- Activity Service: (configured in config server)
- AI Service: (configured in config server)

## 🏗️ Project Structure

```
fitness-microservice/
├── configserver/          # Configuration management
├── eureka/               # Service discovery
├── gateway/              # API Gateway
├── userservice/          # User management
├── activityservice/      # Activity tracking
└── aiservice/           # AI recommendations
```

Each microservice follows a standard structure:
```
service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/fitness/{service}/
│   │   │       ├── config/         # Configuration classes
│   │   │       ├── controller/     # REST controllers
│   │   │       ├── dto/           # Data transfer objects
│   │   │       ├── model/         # Domain models
│   │   │       ├── repository/    # Data access layer
│   │   │       └── service/       # Business logic
│   │   └── resources/
│   │       └── application.yml
│   └── test/
└── pom.xml
```


## 📊 Monitoring

- **Eureka Dashboard**: http://localhost:8761 - View registered services and health status
- **RabbitMQ Management**: http://localhost:15672 - Monitor message queues and exchanges

## 📄 License

This project is licensed under the MIT License.
