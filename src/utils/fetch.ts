import fetch from 'node-fetch';

export interface EnhancedFetchOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Enhanced fetch with proper headers, timeout, and retry logic
export async function fetchWithEnhancedHeaders(
  url: string, 
  options: EnhancedFetchOptions = {}
) {
  const {
    timeout = 10000, // Increased from 5s to 10s
    retries = 2,
    retryDelay = 1000
  } = options;

  // Browser-like headers that sites expect
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Upgrade-Insecure-Requests': '1'
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log(`Fetching metadata from ${url} (attempt ${attempt + 1}/${retries + 1})`);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers,
        follow: 5, // Follow up to 5 redirects
        compress: true // Enable gzip/deflate decompression
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`Successfully fetched metadata from ${url} (status: ${response.status})`);
      return response;

    } catch (error: any) {
      clearTimeout(timeoutId);
      lastError = error;
      
      const isTimeout = error.name === 'AbortError';
      const isNetworkError = error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED';
      
      console.error(`Failed to fetch metadata from ${url} (attempt ${attempt + 1}):`, {
        error: error.message,
        code: error.code,
        isTimeout,
        isNetworkError
      });

      // Don't retry on certain errors
      if (!isTimeout && !isNetworkError && error.message.includes('HTTP 4')) {
        console.log(`Not retrying due to client error: ${error.message}`);
        break;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt);
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All attempts failed
  throw lastError || new Error('Unknown error occurred during fetch');
}