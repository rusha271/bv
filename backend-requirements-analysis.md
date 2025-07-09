# Backend Requirements Analysis - Brahma Vastu Project

## 🔍 Frontend Analysis Summary

### Existing Pages & Features
1. **Home Page** (`/`) - Floor plan upload and AI verification
2. **Blog Page** (`/blog`) - Vastu tips and content (tabs for Videos, Books, Tips, Posts)
3. **Contact Page** (`/contact`) - Contact form and consultant information
4. **Crop Page** (`/crop`) - Image cropping functionality
5. **Chakra Overlay Page** (`/chakra-overlay`) - Chakra/Vastu overlay on floor plans

### Forms & User Interactions
1. **File Upload Form** - Floor plan image upload with AI validation
2. **Contact Form** - Consultation request form
3. **Auth Forms** - Login/Signup with social OAuth (Google, Facebook, Apple)
4. **Chatbot** - AI-powered chat interface

### Client-Side Logic & API Calls
1. **Floor Plan Processing** - TensorFlow.js for image validation
2. **Image Cropping** - Client-side image manipulation
3. **Chatbot Integration** - POST to `/api/chat` endpoint
4. **OAuth Integration** - Google, Facebook, Apple sign-in
5. **Theme Management** - Light/dark mode persistence
6. **Chat Polling** - Real-time chat functionality

### Data Models & Contexts
1. **PlanetaryData** - Planetary information for Vastu calculations
2. **VastuTips** - Blog content and tips
3. **User Authentication** - OAuth user data
4. **Chat Messages** - Chatbot conversation history
5. **Form Data** - Contact forms and user inputs

---

## 📌 Backend Requirements

### 1. Authentication & User Management

#### Endpoints Required:
- `POST /api/auth/login` - User login with email/password
- `POST /api/auth/register` - User registration
- `POST /api/auth/oauth/google` - Google OAuth callback
- `POST /api/auth/oauth/facebook` - Facebook OAuth callback
- `POST /api/auth/oauth/apple` - Apple OAuth callback
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

#### Pydantic Schemas:
```python
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserRegistration(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OAuthUser(BaseModel):
    email: EmailStr
    full_name: str
    provider: str  # "google", "facebook", "apple"
    provider_id: str
    avatar_url: Optional[str] = None

class UserProfile(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
```

#### Authentication Requirements:
- JWT token-based authentication
- OAuth integration with Google, Facebook, Apple
- Password hashing with bcrypt
- Session management
- Role-based access control (if needed)

### 2. Floor Plan Processing & Analysis

#### Endpoints Required:
- `POST /api/floor-plan/upload` - Upload and process floor plan
- `POST /api/floor-plan/crop` - Crop floor plan image
- `POST /api/floor-plan/analyze` - Vastu analysis of floor plan
- `GET /api/floor-plan/history` - User's floor plan history
- `DELETE /api/floor-plan/{id}` - Delete floor plan

#### Pydantic Schemas:
```python
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class FloorPlanUpload(BaseModel):
    image_data: str  # Base64 encoded image
    image_format: str  # "png", "jpg", "jpeg"
    original_filename: str

class FloorPlanAnalysis(BaseModel):
    id: int
    user_id: int
    original_image_url: str
    cropped_image_url: Optional[str] = None
    analysis_result: Dict[str, Any]
    vastu_score: float
    recommendations: List[str]
    created_at: datetime

class VastuAnalysisResult(BaseModel):
    overall_score: float
    room_analysis: Dict[str, Any]
    direction_analysis: Dict[str, Any]
    recommendations: List[str]
    chakra_positions: List[Dict[str, Any]]
    planet_influences: List[Dict[str, Any]]

class CropRequest(BaseModel):
    image_url: str
    crop_data: Dict[str, float]  # x, y, width, height
```

### 3. Chatbot & AI Integration

#### Endpoints Required:
- `POST /api/chat` - Send message to chatbot (already exists)
- `GET /api/chat/history` - Get user chat history
- `DELETE /api/chat/history` - Clear chat history
- `GET /api/chat/health` - Chatbot health check

#### Pydantic Schemas:
```python
class ChatMessage(BaseModel):
    text: str

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime
    mode: str  # "ai" or "fallback"

class ChatHistory(BaseModel):
    id: int
    user_id: int
    messages: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
```

### 4. Contact & Consultation Management

#### Endpoints Required:
- `POST /api/contact/consultation` - Submit consultation request
- `GET /api/contact/consultations` - Get user's consultations
- `PUT /api/contact/consultation/{id}` - Update consultation status
- `GET /api/contact/consultants` - Get available consultants

#### Pydantic Schemas:
```python
class ConsultationRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    consultation_type: str
    message: str
    preferred_date: Optional[datetime] = None

class Consultation(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    email: EmailStr
    phone: str
    consultation_type: str
    message: str
    status: str  # "pending", "scheduled", "completed", "cancelled"
    created_at: datetime
    updated_at: datetime

class Consultant(BaseModel):
    id: int
    name: str
    title: str
    description: str
    expertise: List[str]
    experience: str
    clients: str
    image_url: str
    video_url: Optional[str] = None
    is_active: bool
```

### 5. Blog & Content Management

#### Endpoints Required:
- `GET /api/blog/tips` - Get Vastu tips
- `GET /api/blog/tips/{id}` - Get specific tip
- `GET /api/blog/categories` - Get tip categories
- `POST /api/blog/tips` - Create new tip (admin)
- `PUT /api/blog/tips/{id}` - Update tip (admin)
- `DELETE /api/blog/tips/{id}` - Delete tip (admin)

#### Pydantic Schemas:
```python
class VastuTip(BaseModel):
    id: int
    title: str
    description: str
    details: str
    category: str
    image_url: str
    is_published: bool
    created_at: datetime
    updated_at: datetime

class VastuTipCreate(BaseModel):
    title: str
    description: str
    details: str
    category: str
    image_url: str
    is_published: bool = True
```

### 6. Planetary Data & Vastu Calculations

#### Endpoints Required:
- `GET /api/vastu/planetary-data` - Get planetary information
- `POST /api/vastu/calculate` - Calculate Vastu for specific location/time
- `GET /api/vastu/remedies` - Get Vastu remedies
- `GET /api/vastu/zodiac-data` - Get zodiac sign information

#### Pydantic Schemas:
```python
class PlanetData(BaseModel):
    name: str
    radius: float
    distance: float
    orbital_period: float
    color: int
    description: str
    facts: str
    mean_longitude: float
    daily_motion: float
    eccentricity: float
    inclination: float
    remedy: str

class VastuCalculation(BaseModel):
    location: Dict[str, float]  # lat, lng
    date_time: datetime
    planetary_positions: List[Dict[str, Any]]
    vastu_recommendations: List[str]
    chakra_alignment: Dict[str, Any]
```

### 7. File Storage & Media Management

#### Endpoints Required:
- `POST /api/media/upload` - Upload images/files
- `GET /api/media/{filename}` - Serve media files
- `DELETE /api/media/{filename}` - Delete media file

#### Pydantic Schemas:
```python
class MediaUpload(BaseModel):
    file_data: str  # Base64 encoded
    filename: str
    content_type: str

class MediaFile(BaseModel):
    id: int
    filename: str
    original_name: str
    file_size: int
    content_type: str
    url: str
    uploaded_by: int
    created_at: datetime
```

---

## 🚀 FastAPI Implementation Plan

### Required Dependencies
```txt
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
sqlalchemy==2.0.23
alembic==1.13.0
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pillow==10.1.0
redis==5.0.1
celery==5.3.4
python-decouple==3.8
httpx==0.25.2
```

### Database Models (SQLAlchemy)
```python
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    full_name = Column(String)
    phone = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    oauth_provider = Column(String, nullable=True)
    oauth_provider_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class FloorPlan(Base):
    __tablename__ = "floor_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    original_image_url = Column(String)
    cropped_image_url = Column(String, nullable=True)
    analysis_result = Column(JSON)
    vastu_score = Column(Float)
    recommendations = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="floor_plans")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String, unique=True, index=True)
    messages = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Consultation(Base):
    __tablename__ = "consultations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    consultation_type = Column(String)
    message = Column(Text)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VastuTip(Base):
    __tablename__ = "vastu_tips"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    details = Column(Text)
    category = Column(String)
    image_url = Column(String)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### Main Application Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── floor_plan.py
│   │   ├── chat.py
│   │   └── consultation.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── floor_plan.py
│   │   ├── chat.py
│   │   └── consultation.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── floor_plan.py
│   │   ├── chat.py
│   │   ├── contact.py
│   │   ├── blog.py
│   │   └── vastu.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── floor_plan_service.py
│   │   ├── chat_service.py
│   │   └── vastu_service.py
│   └── utils/
│       ├── __init__.py
│       ├── image_processing.py
│       ├── ai_analysis.py
│       └── helpers.py
├── alembic/
├── requirements.txt
├── .env
└── docker-compose.yml
```

---

## 📋 Implementation TODO List

### Phase 1: Core Infrastructure
- [ ] Set up FastAPI project structure
- [ ] Configure database (PostgreSQL)
- [ ] Set up authentication system with JWT
- [ ] Implement user registration/login
- [ ] Set up OAuth integration (Google, Facebook, Apple)
- [ ] Configure Redis for caching
- [ ] Set up file storage (local/S3)

### Phase 2: Core Features
- [ ] Floor plan upload and processing
- [ ] Image cropping functionality
- [ ] Vastu analysis engine
- [ ] Chatbot integration (enhance existing)
- [ ] Contact form processing
- [ ] Blog/tips management

### Phase 3: Advanced Features
- [ ] Planetary data calculations
- [ ] Chakra overlay generation
- [ ] Zodiac sign integration
- [ ] Consultation booking system
- [ ] Email notifications
- [ ] Admin dashboard

### Phase 4: Optimization & Production
- [ ] Performance optimization
- [ ] Caching strategies
- [ ] API rate limiting
- [ ] Logging and monitoring
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Security hardening

---

## 🔐 Security Considerations

1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access control
3. **Input Validation**: Pydantic schemas for all inputs
4. **File Upload**: Secure file handling with type validation
5. **Rate Limiting**: Prevent abuse of APIs
6. **CORS**: Proper CORS configuration
7. **Environment Variables**: Secure configuration management

---

## 🚀 Deployment Architecture

### Development
- Local PostgreSQL database
- Redis for caching
- Local file storage
- FastAPI dev server

### Production
- PostgreSQL (managed service)
- Redis (managed service)
- S3 for file storage
- Docker containers
- Load balancer
- SSL certificates

This comprehensive analysis provides a complete roadmap for building the FastAPI backend to support your Next.js frontend application.
