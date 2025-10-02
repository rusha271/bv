# 🚀 AWS Deployment Guide for bharmaspace.com

## Overview
This guide will help you deploy your Brahma Vastu application to AWS with your domain `bharmaspace.com`.

## ✅ What's Already Configured

### 1. Domain Configuration
- **Primary Domain**: `bharmaspace.com`
- **API Subdomain**: `api.bharmaspace.com`
- **Environment Variables**: All configured for production
- **SEO & Meta Tags**: Updated for your domain
- **Sitemap & Robots**: Configured for bharmaspace.com

### 2. GitHub Actions CI/CD Pipeline
- **Docker Build**: Automated Docker image creation
- **Environment Variables**: All production variables set
- **AWS Deployment**: Ready for your AWS instance

## 🔧 AWS Setup Requirements

### 1. EC2 Instance Setup
```bash
# Install Docker on your AWS EC2 instance
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### 2. Domain Configuration
1. **Point your domain to AWS**:
   - Go to your GoDaddy DNS settings
   - Create an A record: `bharmaspace.com` → `YOUR_AWS_IP`
   - Create a CNAME record: `api.bharmaspace.com` → `bharmaspace.com`

### 3. SSL Certificate Setup
```bash
# Install Certbot for SSL
sudo apt install certbot -y
sudo certbot certonly --standalone -d bharmaspace.com -d api.bharmaspace.com
```

## 🚀 Deployment Process

### 1. Automatic Deployment (Recommended)
Your GitHub Actions pipeline will automatically:
- Build the Docker image
- Push to Docker Hub
- Deploy to your AWS instance

### 2. Manual Deployment
If you need to deploy manually:

```bash
# Pull the latest image
docker pull rushabh046/brahma_vastu:latest

# Stop existing container
docker stop bv-container || true
docker rm bv-container || true

# Run new container with environment variables
docker run -d -p 80:3000 \
  --name bv-container \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_SITE_URL=https://bharmaspace.com \
  -e NEXT_PUBLIC_API_URL=https://api.bharmaspace.com \
  -e NEXT_PUBLIC_TWITTER_HANDLE=@divyavastu \
  -e NEXT_PUBLIC_FACEBOOK_PAGE=https://facebook.com/divyavastu \
  -e NEXT_PUBLIC_INSTAGRAM_PAGE=https://instagram.com/divyavastu \
  -e NEXT_PUBLIC_SITE_NAME="Brahma Vastu" \
  -e NEXT_PUBLIC_SITE_DESCRIPTION="Professional Vastu Shastra consultation services. Get instant Vastu analysis of your floor plan, expert tips, remedies, and comprehensive guidance for your home and office." \
  -e NEXT_PUBLIC_SITE_KEYWORDS="Vastu Shastra,Vastu Consultation,Floor Plan Analysis,Home Vastu,Office Vastu,Vastu Expert,Vastu Tips,Vastu Remedies,Brahma Vastu,Vastu Analysis,Vastu Check,Vastu Services" \
  -e NEXT_PUBLIC_CONTACT_EMAIL=contact@bharmaspace.com \
  -e NEXT_PUBLIC_COMPANY_NAME="Brahma Vastu" \
  -e NEXT_PUBLIC_COMPANY_ADDRESS="India" \
  -e NEXT_PUBLIC_COMPANY_FOUNDED=2024 \
  rushabh046/brahma_vastu:latest
```

## 🔍 Verification Steps

### 1. Check Application Status
```bash
# Check if container is running
docker ps

# Check application logs
docker logs bv-container

# Test the application
curl http://localhost:3000
```

### 2. Domain Testing
- Visit `https://bharmaspace.com` in your browser
- Check that all pages load correctly
- Verify SSL certificate is working
- Test the admin dashboard at `https://bharmaspace.com/dashboard`

## 🛠️ Troubleshooting

### Common Issues

1. **Container won't start**:
   ```bash
   docker logs bv-container
   ```

2. **Domain not resolving**:
   - Check DNS settings in GoDaddy
   - Wait for DNS propagation (up to 24 hours)

3. **SSL certificate issues**:
   ```bash
   sudo certbot renew --dry-run
   ```

4. **Application not accessible**:
   - Check AWS Security Groups
   - Ensure port 80 and 443 are open
   - Verify Docker container is running

## 📋 Environment Variables Summary

All these variables are automatically set in your deployment:

```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://bharmaspace.com
NEXT_PUBLIC_API_URL=https://api.bharmaspace.com
NEXT_PUBLIC_TWITTER_HANDLE=@divyavastu
NEXT_PUBLIC_FACEBOOK_PAGE=https://facebook.com/divyavastu
NEXT_PUBLIC_INSTAGRAM_PAGE=https://instagram.com/divyavastu
NEXT_PUBLIC_SITE_NAME=Brahma Vastu
NEXT_PUBLIC_SITE_DESCRIPTION=Professional Vastu Shastra consultation services...
NEXT_PUBLIC_SITE_KEYWORDS=Vastu Shastra,Vastu Consultation,Floor Plan Analysis...
NEXT_PUBLIC_CONTACT_EMAIL=contact@bharmaspace.com
NEXT_PUBLIC_COMPANY_NAME=Brahma Vastu
NEXT_PUBLIC_COMPANY_ADDRESS=India
NEXT_PUBLIC_COMPANY_FOUNDED=2024
```

## 🎯 Next Steps

1. **Set up your AWS EC2 instance**
2. **Configure your domain DNS settings**
3. **Push your code to the main branch** (this will trigger deployment)
4. **Set up SSL certificate**
5. **Configure your backend API**

Your application is now ready for deployment to `bharmaspace.com`! 🚀

