export const base64ToFile = (
    base64String: string, 
    filename: string, 
    mimeType: string
  ): File => {
    try {
      // Remove data URL prefix if present
      const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
      
      // Validate base64 format
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
        throw new Error('Invalid base64 format');
      }
      
      // Convert to bytes
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      return new File([byteArray], filename, { type: mimeType });
    } catch (error) {
      throw new Error(`Failed to convert base64 to file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  export const validateImageFormat = (format: string): boolean => {
    const allowedFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
    return allowedFormats.includes(format.toLowerCase());
  };
  
  export const getImageMimeType = (format: string): string => {
    const formatMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif'
    };
    return formatMap[format.toLowerCase()] || 'image/jpeg';
  };