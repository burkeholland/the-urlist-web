import fetch from 'node-fetch';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage()
]);

// Browser headers to bypass basic bot protection
const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

// Helper function to add timeout and headers to fetch with retry logic
async function fetchWithTimeoutAndRetry(url: string, timeout = 10000, maxRetries = 2) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: BROWSER_HEADERS,
        follow: 5, // Follow up to 5 redirects
        compress: true
      });
      
      clearTimeout(id);
      
      if (!response.ok && response.status >= 400) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error: any) {
      clearTimeout(id);
      lastError = error;
      
      // Don't retry on abort (timeout) or 4xx errors
      if (error.name === 'AbortError' || (error.message && error.message.includes('HTTP 4'))) {
        throw error;
      }
      
      // Exponential backoff for retries (except on last attempt)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s delays
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Generate a basic metadata object from URL
export function generateFallbackMetadata(url: string) {
  try {
    const urlObj = new URL(url);
    return {
      title: urlObj.hostname,
      description: `Content from ${urlObj.hostname}`,
      image: null
    };
  } catch {
    return {
      title: url,
      description: 'No description available',
      image: null
    };
  }
}

// Main function to fetch metadata with improved error handling and retry logic
export async function fetchMetadata(targetUrl: string) {
  try {
    const response = await fetchWithTimeoutAndRetry(targetUrl);
    const html = await response.text();
    const metadata = await scraper({ html, url: targetUrl });

    // If metadata is incomplete, merge with fallback data
    const fallback = generateFallbackMetadata(targetUrl);
    return {
      title: metadata.title || fallback.title,
      description: metadata.description || fallback.description,
      image: metadata.image || fallback.image
    };
  } catch (error: any) {
    // If fetching fails, return fallback metadata
    console.warn(`Failed to fetch metadata for ${targetUrl}:`, error.message);
    return generateFallbackMetadata(targetUrl);
  }
}