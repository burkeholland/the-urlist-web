import type { APIRoute } from 'astro';
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

// Helper function to add timeout to fetch with proper redirect handling
async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      redirect: 'follow',
      follow: 20, // Allow up to 20 redirects
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; The-Urlist-Bot/1.0)'
      }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Generate a basic metadata object from URL
function generateFallbackMetadata(url: string) {
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

export const GET: APIRoute = async ({ url }) => {
  try {
    const targetUrl = url.searchParams.get('url');
    
    if (!targetUrl) {
      return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const response = await fetchWithTimeout(targetUrl);
      const html = await response.text();
      const finalUrl = response.url || targetUrl; // Use final redirect URL
      const metadata = await scraper({ html, url: finalUrl });

      console.log(`Metadata API scraped for ${targetUrl} -> ${finalUrl}:`, {
        title: metadata.title,
        description: metadata.description?.substring(0, 100),
        image: metadata.image
      });

      // If metadata is incomplete, merge with fallback data
      const fallback = generateFallbackMetadata(finalUrl);
      const finalMetadata = {
        title: metadata.title || fallback.title,
        description: metadata.description || fallback.description,
        image: metadata.image || fallback.image
      };

      return new Response(JSON.stringify(finalMetadata), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (fetchError) {
      console.error(`Failed to fetch metadata for ${targetUrl}:`, fetchError.message);
      // If fetching fails, return fallback metadata
      const fallback = generateFallbackMetadata(targetUrl);
      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    const isTimeout = error.name === 'AbortError';
    const status = isTimeout ? 504 : 500;
    const message = isTimeout ? 'Request timed out' : error.message;

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};