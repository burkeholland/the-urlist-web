import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import fetch from 'node-fetch';

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage()
]);

interface MetadataResult {
  title: string;
  description: string;
  image: string | null;
}

interface FetchOptions {
  timeout?: number;
  retries?: number;
  userAgent?: string;
}

// Helper function to add timeout and retry logic to fetch
async function fetchWithTimeoutAndRetry(
  url: string, 
  options: FetchOptions = {}
): Promise<Response> {
  const { 
    timeout = 10000, // Increased from 5000 to 10000ms
    retries = 3,
    userAgent = 'Mozilla/5.0 (compatible; UrlistBot/1.0; +https://urlist.io)'
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        follow: 5, // Follow up to 5 redirects
        timeout: timeout
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error as Error;
      
      // Don't retry on certain errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log(`Attempt ${attempt + 1} timed out for ${url}`);
        } else if (error.message.includes('HTTP 4')) {
          // Don't retry on 4xx errors
          throw error;
        } else {
          console.log(`Attempt ${attempt + 1} failed for ${url}: ${error.message}`);
        }
      }
      
      // If this is the last attempt, throw the error
      if (attempt === retries) {
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw lastError!;
}

// Generate a basic metadata object from URL
export function generateFallbackMetadata(url: string): MetadataResult {
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

// Main function to fetch metadata with proper error handling and fallbacks
export async function fetchMetadata(
  url: string, 
  options: FetchOptions = {}
): Promise<MetadataResult> {
  try {
    console.log(`Fetching metadata for: ${url}`);
    
    const response = await fetchWithTimeoutAndRetry(url, options);
    const html = await response.text();
    
    console.log(`Successfully fetched HTML for: ${url} (${html.length} characters)`);
    
    const metadata = await scraper({ html, url });
    
    console.log(`Scraped metadata for ${url}:`, {
      title: metadata.title ? 'found' : 'missing',
      description: metadata.description ? 'found' : 'missing', 
      image: metadata.image ? 'found' : 'missing'
    });

    // If metadata is incomplete, merge with fallback data
    const fallback = generateFallbackMetadata(url);
    const finalMetadata: MetadataResult = {
      title: metadata.title || fallback.title,
      description: metadata.description || fallback.description,
      image: metadata.image || fallback.image
    };

    return finalMetadata;
  } catch (error) {
    console.error(`Failed to fetch metadata for ${url}:`, error);
    
    // Return fallback metadata on any error
    return generateFallbackMetadata(url);
  }
}