import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { apiService } from '@/utils/apiService';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import BookIcon from '@mui/icons-material/Book';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

// Yup schemas for validation
const bookSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  author: yup.string().required('Author is required'),
  summary: yup.string().required('Summary is required'),
  pdf: yup
    .mixed()
    .required('PDF file is required')
    .test('fileType', 'Please upload a PDF file', (value) => value instanceof File && value.type === 'application/pdf'),
  rating: yup.number().min(0).max(5).nullable(),
  pages: yup.number().integer().positive().nullable(),
  price: yup.number().positive().nullable(),
  publication_year: yup.number().integer().nullable(),
  publisher: yup.string().nullable(),
  category: yup.string().nullable(),
  isbn: yup.string().nullable(),
});

const videoSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  video: yup.mixed<File>().required('Video file is required').test('is-video', 'Must be a video file', (value) => value && value.type.startsWith('video/')),
  category: yup.string().optional(),
});

const tipSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  category: yup.string().nullable(),
  image: yup
    .mixed<File>()
    .required("Image is required")
    .test("fileType", "Only image files are allowed", (file) =>
      file ? ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type) : false
    )
    .test("fileSize", "File size must be less than 5MB", (file) =>
      file ? file.size <= 5 * 1024 * 1024 : false
    ),
});

const categories = [
  'Vastu Tips',
  'Home Consultation',
  'Tutorial',
  'General',
];

export default function PostUploadSection({ onUpload }: { onUpload?: () => void }) {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const [bookFileName, setBookFileName] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Add theme and device type
  const { theme } = useThemeContext();
  const { isMobile, isTablet, isDesktop } = useDeviceType();

  // Book form
  const {
    control: bookControl,
    handleSubmit: handleBookSubmit,
    reset: resetBook,
    setValue: setBookValue,
    formState: { errors: bookErrors },
  } = useForm({
    resolver: yupResolver(bookSchema),
  });

  // Video form
  const {
    control: videoControl,
    handleSubmit: handleVideoSubmit,
    reset: resetVideo,
    setValue: setVideoValue,
    formState: { errors: videoErrors },
  } = useForm({
    resolver: yupResolver(videoSchema),
  });

  // Tip form
  const {
    control: tipControl,
    handleSubmit: handleTipSubmit,
    reset: resetTip,
    setValue: setTipValue,
    formState: { errors: tipErrors },
  } = useForm({
    resolver: yupResolver(tipSchema),
  });

  // Handlers
  const handleBookFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      (setBookValue as any)('pdf', file);
      setBookFileName(file.name);
    }
  };

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoValue('video', file);
      setVideoPreview(URL.createObjectURL(file));
      
      // Generate thumbnail from video
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.currentTime = 1;
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setVideoThumbnail(canvas.toDataURL('image/png'));
        }
      };
    }
  };

  const handleTipImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTipValue('image', file);
    }
  };

  const onBookSubmit = async (data: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('author', data.author);
      formData.append('summary', data.summary);
      formData.append('pdf', data.pdf); // Back to original field name
      if (data.rating) formData.append('rating', String(data.rating));
      if (data.pages) formData.append('pages', String(data.pages));
      if (data.price) formData.append('price', String(data.price));
      if (data.publication_year) formData.append('publication_year', String(data.publication_year));
      if (data.publisher) formData.append('publisher', data.publisher);
      if (data.category) formData.append('category', data.category);
      if (data.isbn) formData.append('isbn', data.isbn);
  
      // Debug: Log FormData contents
      console.log('Book FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
      }
  
      const response = await apiService.books.create(formData as any);
      if (response) {
        setSuccess('Book uploaded successfully!');
        resetBook();
        setBookFileName(null);
        onUpload?.();
      } else {
        setError('Failed to upload book.');
      }
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage = error.message || 'An error occurred while uploading the book.';
      setError(errorMessage);
    }
  };
  
  const onVideoSubmit = async (data: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    setError('');
    try {
      const formData = new FormData();
  
      // Append required fields with validation
      if (!data.title) throw new Error('Title is required');
      formData.append('title', data.title);
  
      if (!data.description) throw new Error('Description is required');
      formData.append('description', data.description);
  
      if (!(data.video instanceof File)) throw new Error('Video file is not a valid File object');
      console.log('Video file details:', {
        name: data.video.name,
        size: data.video.size,
        type: data.video.type
      });
      formData.append('video', data.video); // Back to original field name
  
      // Create thumbnail file from canvas
      if (videoThumbnail) {
        // Convert base64 to blob and create a file
        const response = await fetch(videoThumbnail);
        const blob = await response.blob();
        const thumbnailFile = new File([blob], 'thumbnail.png', { type: 'image/png' });
        formData.append('thumbnail', thumbnailFile);
        console.log('Thumbnail file created:', {
          name: thumbnailFile.name,
          size: thumbnailFile.size,
          type: thumbnailFile.type
        });
      }
  
      if (data.category) {
        formData.append('category', data.category);
      }
  
      // Debug: Log FormData contents
      console.log('Video FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
      }
  
      // Call API
      const response = await apiService.videos.create(formData);
  
      if (response) {
        setSuccess('Video uploaded successfully!');
        resetVideo();
        setVideoPreview(null);
        setVideoThumbnail(null);
        onUpload?.();
      } else {
        setError('Failed to upload video: No response from server.');
      }
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        'An error occurred while uploading the video.';
      setError(errorMessage);
    }
  };
  
  const onTipSubmit = async (data: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    setError('');
  
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("category", data.category);
      if (data.image instanceof File) {
        formData.append("image", data.image); 
        console.log('Image file details:', {
          name: data.image.name,
          size: data.image.size,
          type: data.image.type
        });
      } else {
        console.warn("No valid image file selected");
      }
  
      // Debug: Log FormData contents
      console.log('Tip FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
      }
  
      const response = await apiService.tips.create(formData);
      if (response) {
        setSuccess("Tip uploaded successfully!");
        resetTip();
        onUpload?.();
      } else {
        setError("Failed to upload tip: No response from server.");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      let errorMessage = error.message || "An error occurred while uploading the tip.";
      if (error.response?.status === 404) {
        errorMessage = "Tip upload endpoint not found. Please contact support.";
      } else if (error.response?.status === 401) {
        errorMessage = "Unauthorized: Please log in to upload a tip.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.detail || "Invalid input data.";
      }
      setError(errorMessage);
    }
  };
  
  

  return (
    <Box
      sx={{
        width: '100%',
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: theme.palette.primary.main,
          letterSpacing: 1,
          textAlign: 'center',
        }}
      >
        Share Your Knowledge
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        aria-label="Post upload tabs"
        sx={{
          mb: 2,
          background: theme.palette.background.paper,
          borderRadius: 2,
          minHeight: isMobile ? 44 : 56,
          boxShadow: theme.palette.mode === 'dark' ? '0 2px 16px #23234f' : '0 2px 16px #e5e7eb',
        }}
        centered
      >
        <Tab icon={<BookIcon />} label="Book" sx={{ fontWeight: 700, fontSize: isMobile ? '0.95rem' : isTablet ? '1.05rem' : '1.15rem', color: theme.palette.text.primary, minHeight: isMobile ? 44 : 56 }} />
        <Tab icon={<VideoLibraryIcon />} label="Video" sx={{ fontWeight: 700, fontSize: isMobile ? '0.95rem' : isTablet ? '1.05rem' : '1.15rem', color: theme.palette.text.primary, minHeight: isMobile ? 44 : 56 }} />
        <Tab icon={<TipsAndUpdatesIcon />} label="Tip" sx={{ fontWeight: 700, fontSize: isMobile ? '0.95rem' : isTablet ? '1.05rem' : '1.15rem', color: theme.palette.text.primary, minHeight: isMobile ? 44 : 56 }} />
      </Tabs>
      <Card
        sx={{
          width: isMobile ? '100%' : 480,
          borderRadius: 4,
          boxShadow: theme.palette.mode === 'dark' ? '0 4px 24px #23234f' : '0 4px 24px #e5e7eb',
          background: theme.palette.background.paper,
          border: `1.5px solid ${theme.palette.divider}`,
          mt: 1,
        }}
        elevation={isMobile ? 1 : 3}
      >
        <CardContent>
          {tab === 0 && (
            <form onSubmit={handleBookSubmit(onBookSubmit)} className="space-y-4 animate-fadein">
              <Controller name="title" control={bookControl} render={({ field }) => (
                <TextField {...field} label="Title" fullWidth error={!!bookErrors.title} helperText={bookErrors.title?.message} />
              )} />
              <Controller name="author" control={bookControl} render={({ field }) => (
                <TextField {...field} label="Author" fullWidth error={!!bookErrors.author} helperText={bookErrors.author?.message} />
              )} />
              <Controller name="summary" control={bookControl} render={({ field }) => (
                <TextField {...field} label="Summary" fullWidth multiline rows={3} error={!!bookErrors.summary} helperText={bookErrors.summary?.message} />
              )} />
              <Controller
                name="pdf"
                control={bookControl}
                render={({ field }) => (
                  <>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleBookFile}
                      style={{ display: 'block', marginBottom: 8 }}
                    />
                    {bookErrors.pdf && (
                      <Typography color="error" variant="body2">{bookErrors.pdf.message}</Typography>
                    )}
                    {bookFileName && (
                      <Typography variant="body2" color="text.secondary">
                        Selected File: {bookFileName}
                      </Typography>
                    )}
                  </>
                )}
              />
              <Controller name="rating" control={bookControl} render={({ field }) => (
                <TextField {...field} label="Rating" type="number" fullWidth error={!!bookErrors.rating} helperText={bookErrors.rating?.message} />
              )} />
              <Controller name="pages" control={bookControl} render={({ field }) => (
                <TextField {...field} label="Pages" type="number" fullWidth error={!!bookErrors.pages} helperText={bookErrors.pages?.message} />
              )} />
              <Controller name="price" control={bookControl} render={({ field }) => (
                <TextField {...field} label="Price" type="number" fullWidth error={!!bookErrors.price} helperText={bookErrors.price?.message} />
              )} />
              <Controller name="publication_year" control={bookControl} render={({ field }) => (
                <TextField {...field} label="Publication Year" type="number" fullWidth error={!!bookErrors.publication_year} helperText={bookErrors.publication_year?.message} />
              )} />
              <Controller name="publisher" control={bookControl} render={({ field }) => (
                <TextField {...field} label="Publisher" fullWidth error={!!bookErrors.publisher} helperText={bookErrors.publisher?.message} />
              )} />
              <Controller name="category" control={bookControl} render={({ field }) => (
                <TextField {...field} label="Category" select fullWidth error={!!bookErrors.category} helperText={bookErrors.category?.message} >
                  <MenuItem value="">None</MenuItem>
                  {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </TextField>
              )} />
              <Controller name="isbn" control={bookControl} render={({ field }) => (
                <TextField {...field} label="ISBN" fullWidth error={!!bookErrors.isbn} helperText={bookErrors.isbn?.message} />
              )} />
              <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth sx={{ mt: 2, py: 1.5, fontWeight: 600 }}>
                {loading ? 'Uploading...' : 'Upload Book'}
              </Button>
            </form>
          )}
          {tab === 1 && (
            <form onSubmit={handleVideoSubmit(onVideoSubmit)} className="space-y-4 animate-fadein">
              <Controller
                name="title"
                control={videoControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    error={!!videoErrors.title}
                    helperText={videoErrors.title?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={videoControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!videoErrors.description}
                    helperText={videoErrors.description?.message}
                  />
                )}
              />
              <Controller
                name="video"
                control={videoControl}
                render={({ field: { onChange, value } }) => (
                  <Box>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFile}
                      style={{ display: 'block', marginBottom: 8 }}
                    />
                    {videoErrors.video && (
                      <Typography color="error" variant="body2">
                        {videoErrors.video.message}
                      </Typography>
                    )}
                    {value && (
                      <Typography variant="body2" color="text.secondary">
                        Selected Video: {value.name}
                      </Typography>
                    )}
                  </Box>
                )}
              />
              {videoPreview && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">Preview:</Typography>
                  <video src={videoPreview} ref={videoRef} controls width="100%" style={{ maxHeight: 100 }} />
                </Box>
              )}
              {videoThumbnail && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">Thumbnail:</Typography>
                  <img src={videoThumbnail} alt="Video Thumbnail" width="100%" style={{ maxHeight: 100 }} />
                </Box>
              )}
              <Controller
                name="category"
                control={videoControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Category"
                    select
                    fullWidth
                    error={!!videoErrors.category}
                    helperText={videoErrors.category?.message}
                  >
                    <MenuItem value="">None</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                sx={{ mt: 2, py: 1.5, fontWeight: 600 }}
              >
                {loading ? 'Uploading...' : 'Upload Video'}
              </Button>
            </form>
          )}
          {tab === 2 && (
            <form onSubmit={handleTipSubmit(onTipSubmit)} className="space-y-4 animate-fadein">
              <Controller name="title" control={tipControl} render={({ field }) => (
                <TextField {...field} label="Title" fullWidth error={!!tipErrors.title} helperText={tipErrors.title?.message} />
              )} />
              <Controller name="content" control={tipControl} render={({ field }) => (
                <TextField {...field} label="Content" fullWidth multiline rows={3} error={!!tipErrors.content} helperText={tipErrors.content?.message} />
              )} />
              <Controller name="category" control={tipControl} render={({ field }) => (
                <TextField {...field} label="Category" select fullWidth error={!!tipErrors.category} helperText={tipErrors.category?.message} >
                  <MenuItem value="">None</MenuItem>
                  {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </TextField>
              )} />
              <Controller
                name="image"
                control={tipControl}
                render={({ field }) => (
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    fullWidth
                    error={!!tipErrors.image}
                    helperText={tipErrors.image?.message}
                    onChange={handleTipImage}
                  />
                )}
              />
              <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth sx={{ mt: 2, py: 1.5, fontWeight: 600 }}>
                {loading ? 'Uploading...' : 'Upload Tip'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')}>
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
} 