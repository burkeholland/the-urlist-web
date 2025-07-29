#!/usr/bin/env node

// Simple test script to verify metadata fetching
// Usage: node test-fetch.js <url>

import { fetchWithEnhancedHeaders } from '../src/utils/fetch.js';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage()
]);

async function testMetadata(url) {
  console.log(`Testing metadata fetch for: ${url}\n`);
  
  try {
    const response = await fetchWithEnhancedHeaders(url);
    const html = await response.text();
    const metadata = await scraper({ html, url });
    
    console.log('✅ Success! Fetched metadata:');
    console.log(JSON.stringify({
      title: metadata.title,
      description: metadata.description,
      image: metadata.image
    }, null, 2));
    
  } catch (error) {
    console.log('❌ Failed to fetch metadata:');
    console.error(error.message);
  }
}

const url = process.argv[2];
if (!url) {
  console.log('Usage: node test-fetch.js <url>');
  console.log('Example: node test-fetch.js https://battle.net');
  process.exit(1);
}

testMetadata(url);