# Backend API Enhancement Prompt for Enhanced Blog/Post System

## Overview
This prompt outlines the required backend API enhancements to support the new enhanced blog/post management system with multiple content types, admin-only access, and rich content creation capabilities.

## Current Issues to Fix
1. **Blog API Error**: The current `/api/blog` endpoint is returning empty objects `{}` instead of proper blog post data
2. **Missing Enhanced Post Structure**: Need to support the new `PostContent` array structure
3. **Admin Access Control**: Need proper role-based access control for post management

## Required API Endpoints

### 1. Enhanced Blog Posts API (`/api/blog`)

#### GET `/api/blog`
- **Purpose**: Retrieve all blog posts with enhanced structure
- **Access**: Public (for published posts), Admin (for all posts including drafts)
- **Response Format**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "content": [
        {
          "type": "text|image|video|link|file",
          "content": "string",
          "metadata": {
            "url": "string (optional)",
            "filename": "string (optional)",
            "size": "number (optional)",
            "duration": "string (optional)",
            "thumbnail": "string (optional)"
          }
        }
      ],
      "author": "string",
      "category": "string",
      "tags": ["string"],
      "status": "draft|published",
      "post_type": "tip|video|book|podcast|article",
      "featured_image": "string (optional)",
      "created_at": "ISO string",
      "updated_at": "ISO string",
      "published_at": "ISO string"
    }
  ]
}
```

#### POST `/api/blog`
- **Purpose**: Create new blog post
- **Access**: Admin only
- **Request Body**:
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "content": [
    {
      "type": "text|image|video|link|file",
      "content": "string",
      "metadata": {
        "url": "string (optional)",
        "filename": "string (optional)",
        "size": "number (optional)",
        "duration": "string (optional)",
        "thumbnail": "string (optional)"
      }
    }
  ],
  "category": "string (optional)",
  "tags": ["string"],
  "status": "draft|published (default: published)",
  "post_type": "tip|video|book|podcast|article (default: article)",
  "featured_image": "string (optional)",
  "author": "string (auto-filled from JWT)"
}
```

#### PUT `/api/blog/{id}`
- **Purpose**: Update existing blog post
- **Access**: Admin only
- **Request Body**: Same as POST

#### DELETE `/api/blog/{id}`
- **Purpose**: Delete blog post
- **Access**: Admin only

#### GET `/api/blog/{id}`
- **Purpose**: Get single blog post
- **Access**: Public (for published), Admin (for all)

### 2. File Upload Endpoints

#### POST `/api/blog/upload/image`
- **Purpose**: Upload image for blog posts
- **Access**: Admin only
- **Request**: Multipart form data with `file` field
- **Response**:
```json
{
  "status": "success",
  "data": {
    "id": "string",
    "filename": "string",
    "url": "string",
    "size": "number",
    "type": "string"
  }
}
```

#### POST `/api/blog/upload/video`
- **Purpose**: Upload video for blog posts
- **Access**: Admin only
- **Request**: Multipart form data with `file` field
- **Response**: Same as image upload

#### POST `/api/blog/upload/audio`
- **Purpose**: Upload audio for blog posts
- **Access**: Admin only
- **Request**: Multipart form data with `file` field
- **Response**: Same as image upload

#### POST `/api/blog/upload/file`
- **Purpose**: Upload generic files for blog posts
- **Access**: Admin only
- **Request**: Multipart form data with `file` field
- **Response**: Same as image upload

### 3. Content Management Endpoints

#### GET `/api/blog/categories`
- **Purpose**: Get all available categories
- **Access**: Public
- **Response**:
```json
{
  "status": "success",
  "data": ["category1", "category2", "category3"]
}
```

#### GET `/api/blog/tags`
- **Purpose**: Get all available tags
- **Access**: Public
- **Response**:
```json
{
  "status": "success",
  "data": ["tag1", "tag2", "tag3"]
}
```

#### GET `/api/blog/search`
- **Purpose**: Search blog posts
- **Access**: Public
- **Query Parameters**: `q` (search query), `category`, `tags`, `post_type`
- **Response**: Same as GET `/api/blog`

## Database Schema Updates

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content JSON NOT NULL, -- Store PostContent array as JSON
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    tags JSON, -- Store as JSON array
    status ENUM('draft', 'published') DEFAULT 'published',
    post_type ENUM('tip', 'video', 'book', 'podcast', 'article') DEFAULT 'article',
    featured_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_post_type (post_type),
    INDEX idx_category (category),
    INDEX idx_author (author),
    INDEX idx_created_at (created_at)
);
```

### File Uploads Table (if not exists)
```sql
CREATE TABLE file_uploads (
    id VARCHAR(36) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type ENUM('image', 'video', 'audio', 'document', 'other') NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_file_type (file_type),
    INDEX idx_uploaded_by (uploaded_by)
);
```

## Authentication & Authorization

### Role-Based Access Control
- **Admin Role**: Full access to all blog operations (CRUD)
- **User Role**: Read-only access to published posts
- **Guest Role**: Read-only access to published posts

### JWT Token Validation
- Validate JWT token on all admin endpoints
- Extract user role from JWT payload
- Check if user has 'admin' role for write operations

### Middleware Implementation
```python
# Example middleware for admin-only endpoints
def require_admin_role(func):
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        try:
            # Decode and validate JWT
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_role = payload.get('role')
            
            if user_role != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
                
            return func(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
    
    return wrapper
```

## Error Handling

### Standard Error Responses
```json
{
  "status": "error",
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details (optional)"
}
```

### Common Error Codes
- `BLOG_POST_NOT_FOUND`: Blog post with given ID not found
- `INVALID_CONTENT_TYPE`: Invalid content type in PostContent array
- `FILE_UPLOAD_FAILED`: File upload failed
- `INSUFFICIENT_PERMISSIONS`: User doesn't have required permissions
- `VALIDATION_ERROR`: Request validation failed

## Content Validation

### PostContent Validation
- Validate `type` field is one of: 'text', 'image', 'video', 'link', 'file'
- Validate `content` field is not empty
- Validate `metadata` structure based on content type
- For 'link' type, validate URL format
- For 'image', 'video', 'file' types, validate file exists and is accessible

### File Upload Validation
- Validate file size limits (images: 10MB, videos: 100MB, audio: 50MB, files: 25MB)
- Validate file types (images: jpg, png, gif, webp; videos: mp4, webm, avi; audio: mp3, wav, ogg)
- Scan uploaded files for malware (if security is a concern)
- Generate unique filenames to prevent conflicts

## Performance Considerations

### Caching
- Cache published blog posts for 5 minutes
- Cache categories and tags for 1 hour
- Use Redis for caching if available

### Database Optimization
- Add proper indexes on frequently queried fields
- Use pagination for blog post listings
- Implement full-text search for blog content

### File Storage
- Use CDN for serving uploaded files
- Implement image optimization/compression
- Generate thumbnails for images and videos

## Migration Strategy

### Existing Data Migration
1. Create migration script to convert existing blog posts to new format
2. Convert existing `content` string to `PostContent` array format
3. Add default values for new fields (status, post_type, etc.)
4. Update existing file references to new file upload system

### Backward Compatibility
- Support both old and new content formats during transition
- Provide API versioning if needed
- Maintain old endpoints with deprecation warnings

## Testing Requirements

### Unit Tests
- Test all CRUD operations for blog posts
- Test file upload functionality
- Test authentication and authorization
- Test content validation

### Integration Tests
- Test complete blog post creation workflow
- Test file upload and content association
- Test search and filtering functionality

### API Tests
- Test all endpoints with valid and invalid data
- Test error handling and response formats
- Test rate limiting and security measures

## Security Considerations

### Input Sanitization
- Sanitize all text content to prevent XSS
- Validate and escape all user inputs
- Use parameterized queries to prevent SQL injection

### File Upload Security
- Validate file types and sizes
- Scan uploaded files for malware
- Store files outside web root
- Use secure file serving endpoints

### Access Control
- Implement proper JWT validation
- Use HTTPS for all API endpoints
- Implement rate limiting
- Log all admin actions for audit trail

## Implementation Priority

### Phase 1 (Critical - Fix Current Issues)
1. Fix the blog API error returning empty objects
2. Implement basic enhanced blog post structure
3. Add admin access control

### Phase 2 (Enhanced Features)
1. Implement file upload endpoints
2. Add content validation
3. Implement search and filtering

### Phase 3 (Optimization)
1. Add caching layer
2. Implement performance optimizations
3. Add comprehensive testing

## Example Implementation (Python/Flask)

```python
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, get_jwt
import json
from datetime import datetime

app = Flask(__name__)
jwt = JWTManager(app)

@app.route('/api/blog', methods=['GET'])
@jwt_required(optional=True)
def get_blog_posts():
    try:
        current_user = get_jwt_identity()
        user_role = get_jwt().get('role', 'user')
        
        # Get query parameters
        status_filter = request.args.get('status')
        post_type = request.args.get('post_type')
        category = request.args.get('category')
        
        # Build query based on user role
        query = "SELECT * FROM blog_posts WHERE 1=1"
        params = []
        
        # Non-admin users can only see published posts
        if user_role != 'admin':
            query += " AND status = 'published'"
        elif status_filter:
            query += " AND status = %s"
            params.append(status_filter)
            
        if post_type:
            query += " AND post_type = %s"
            params.append(post_type)
            
        if category:
            query += " AND category = %s"
            params.append(category)
            
        query += " ORDER BY created_at DESC"
        
        # Execute query and return results
        posts = execute_query(query, params)
        
        return jsonify({
            'status': 'success',
            'data': posts
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/api/blog', methods=['POST'])
@jwt_required()
def create_blog_post():
    try:
        current_user = get_jwt_identity()
        user_role = get_jwt().get('role')
        
        if user_role != 'admin':
            return jsonify({
                'status': 'error',
                'error': 'Admin access required'
            }), 403
            
        data = request.get_json()
        
        # Validate required fields
        if not data.get('title'):
            return jsonify({
                'status': 'error',
                'error': 'Title is required'
            }), 400
            
        # Validate content structure
        content = data.get('content', [])
        if not isinstance(content, list):
            return jsonify({
                'status': 'error',
                'error': 'Content must be an array'
            }), 400
            
        # Create blog post
        post_id = generate_uuid()
        post_data = {
            'id': post_id,
            'title': data['title'],
            'description': data.get('description', ''),
            'content': json.dumps(content),
            'author': current_user,
            'category': data.get('category', ''),
            'tags': json.dumps(data.get('tags', [])),
            'status': data.get('status', 'published'),
            'post_type': data.get('post_type', 'article'),
            'featured_image': data.get('featured_image', ''),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'published_at': datetime.utcnow() if data.get('status') == 'published' else None
        }
        
        # Insert into database
        insert_blog_post(post_data)
        
        return jsonify({
            'status': 'success',
            'data': post_data
        }), 201
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500
```

This comprehensive prompt provides everything needed to implement the enhanced blog/post system with proper error handling, security, and performance considerations.
