import type { APIRoute } from 'astro';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import { fetchWithTimeout } from '../../utils/fetch';

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage()
]);

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
    const debug = url.searchParams.get('debug') === 'true';
    
    if (!targetUrl) {
      return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const response = await fetchWithTimeout(targetUrl);
      const html = await response.text();
      
      // Debug logging when requested
      if (debug) {
        console.log(`[Metadata Debug] URL: ${targetUrl}`);
        console.log(`[Metadata Debug] Final URL: ${response.url}`);
        console.log(`[Metadata Debug] Status: ${response.status}`);
        console.log(`[Metadata Debug] HTML length: ${html.length}`);
        console.log(`[Metadata Debug] HTML preview: ${html.substring(0, 500)}...`);
      }
      
      const metadata = await scraper({ html, url: response.url || targetUrl });

      if (debug) {
        console.log(`[Metadata Debug] Scraped metadata:`, metadata);
      }

      // If metadata is incomplete, merge with fallback data
      const fallback = generateFallbackMetadata(targetUrl);
      const finalMetadata = {
        title: metadata.title || fallback.title,
        description: metadata.description || fallback.description,
        image: metadata.image || fallback.image
      };

      if (debug) {
        console.log(`[Metadata Debug] Final metadata:`, finalMetadata);
      }

      return new Response(JSON.stringify(finalMetadata), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (fetchError) {
      console.error(`[Metadata Error] Failed to fetch ${targetUrl}:`, fetchError);
      
      // If fetching fails, return fallback metadata
      const fallback = generateFallbackMetadata(targetUrl);
      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    console.error(`[Metadata Error] General error:`, error);
    
    const isTimeout = error.name === 'AbortError';
    const status = isTimeout ? 504 : 500;
    const message = isTimeout ? 'Request timed out' : error.message;

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};