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

// Helper function to add timeout to fetch with proper headers
async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheUrlist/1.0; +https://theurlist.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
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
      const metadata = await scraper({ html, url: targetUrl });

      // If metadata is incomplete, merge with fallback data
      const fallback = generateFallbackMetadata(targetUrl);
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