# API Payload Documentation

This document outlines the exact payloads being sent to the backend for Books, Videos, and Tips uploads.

## 📚 Book Upload Payload

**Endpoint:** `POST /api/blog/books`  
**Content-Type:** `multipart/form-data`

### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Book title |
| `author` | string | Book author name |
| `summary` | string | Book summary/description |
| `pdf` | File | PDF file (application/pdf) |

### Optional Fields
| Field | Type | Description |
|-------|------|-------------|
| `rating` | number | Book rating (0-5) |
| `pages` | number | Number of pages |
| `price` | number | Book price |
| `publication_year` | number | Year of publication |
| `publisher` | string | Publisher name |
| `category` | string | Book category |
| `isbn` | string | ISBN number |

### Example Payload
```javascript
FormData {
  title: "Vastu Shastra for Modern Homes",
  author: "Dr. Rajesh Kumar",
  summary: "A comprehensive guide to applying Vastu principles in modern architecture...",
  pdf: File { name: "vastu_guide.pdf", size: 2048576, type: "application/pdf" },
  rating: "4.5",
  pages: "250",
  price: "29.99",
  publication_year: "2023",
  publisher: "Vastu Publications",
  category: "Vastu Tips",
  isbn: "978-1234567890"
}
```

---

## 🎥 Video Upload Payload

**Endpoint:** `POST /api/blog/videos`  
**Content-Type:** `multipart/form-data`

### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Video title |
| `description` | string | Video description |
| `video` | File | Video file (video/*) |

### Optional Fields
| Field | Type | Description |
|-------|------|-------------|
| `thumbnail` | File | Video thumbnail (image/png) - Auto-generated if not provided |
| `category` | string | Video category |

### Example Payload
```javascript
FormData {
  title: "Vastu Tips for Kitchen Design",
  description: "Learn essential Vastu principles for designing an auspicious kitchen...",
  video: File { name: "kitchen_vastu.mp4", size: 15728640, type: "video/mp4" },
  thumbnail: File { name: "thumbnail.png", size: 245760, type: "image/png" },
  category: "Tutorial"
}
```

---

## 💡 Tip Upload Payload

**Endpoint:** `POST /api/blog/tips`  
**Content-Type:** `multipart/form-data`

### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Tip title |
| `content` | string | Tip content/description |
| `image` | File | Tip image (image/jpeg, image/png, image/webp) |

### Optional Fields
| Field | Type | Description |
|-------|------|-------------|
| `category` | string | Tip category |

### Example Payload
```javascript
FormData {
  title: "Best Direction for Study Room",
  content: "According to Vastu Shastra, the study room should face northeast direction...",
  image: File { name: "study_room_tip.jpg", size: 1024000, type: "image/jpeg" },
  category: "Vastu Tips"
}
```

---

## 🔧 API Service Configuration

### Book API Service
```typescript
books = {
  create: async (data: FormData): Promise<Book> => {
    return api.post<Book>("/api/blog/books", data);
  }
}
```

### Video API Service
```typescript
videos = {
  create: async (data: FormData): Promise<Video> => {
    return api.post<Video>("/api/blog/videos", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(formData) => formData],
    });
  }
}
```

### Tip API Service
```typescript
tips = {
  create: async (
    formData: FormData,
    config: { headers: { "Content-Type": string } } = { 
      headers: { "Content-Type": "multipart/form-data" } 
    }
  ): Promise<Tip> => {
    return api.post<Tip>("/api/blog/tips", formData, config);
  }
}
```

---

## 📋 Error Handling

### Common HTTP Status Codes
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: User not logged in
- **404 Not Found**: Endpoint not found
- **413 Payload Too Large**: File too large
- **415 Unsupported Media Type**: Invalid file format

### Error Response Format
```json
{
  "detail": "Error message description",
  "status_code": 400
}
```

---

## 🎯 Console Logging

The application logs detailed information about each upload:

### Book Upload Logs
```
📚 Book FormData payload:
  title: Vastu Shastra for Modern Homes
  author: Dr. Rajesh Kumar
  summary: A comprehensive guide...
  pdf: File: vastu_guide.pdf (2048576 bytes, application/pdf)
  rating: 4.5
  pages: 250
  price: 29.99
  publication_year: 2023
  publisher: Vastu Publications
  category: Vastu Tips
  isbn: 978-1234567890
```

### Video Upload Logs
```
🎥 Video FormData payload:
  title: Vastu Tips for Kitchen Design
  description: Learn essential Vastu principles...
  video: File: kitchen_vastu.mp4 (15728640 bytes, video/mp4)
  thumbnail: File: thumbnail.png (245760 bytes, image/png)
  category: Tutorial
```

### Tip Upload Logs
```
💡 Tip FormData payload:
  title: Best Direction for Study Room
  content: According to Vastu Shastra...
  image: File: study_room_tip.jpg (1024000 bytes, image/jpeg)
  category: Vastu Tips
```

---

## 🚀 Usage Instructions

1. **Open Browser Developer Tools** (F12)
2. **Navigate to Console Tab**
3. **Upload any content** (Book, Video, or Tip)
4. **Check Console Logs** for detailed payload information
5. **Monitor Network Tab** to see actual HTTP requests

The payloads are automatically logged with emoji prefixes for easy identification:
- 📚 for Books
- 🎥 for Videos  
- 💡 for Tips
