// This type definition is a stand-in for the one provided by Cloudflare's environment.
// It allows the function to be type-checked without needing the full `@cloudflare/workers-types` package.
type PagesFunction<Env = unknown> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

// In a real project, this would be imported from a shared types file.
// For simplicity here, we define a basic version.
interface SuiteItem {
  id: number;
  type: 'card' | 'envelope';
  name: string;
  options: any;
}

// Fix: Added stand-in type definitions for Cloudflare's KVNamespace and KVPutOptions to resolve the 'Cannot find name' error.
// A stand-in for Cloudflare's KVPutOptions
interface KVPutOptions {
  expirationTtl?: number;
}

// A stand-in for the Cloudflare KVNamespace type.
interface KVNamespace {
  put(key: string, value: string, options?: KVPutOptions): Promise<void>;
}

// Define the environment binding for the KV namespace.
interface Env {
  QUOTES_KV: KVNamespace;
}

// Helper to generate a short, URL-safe, random ID (8 characters)
const generateId = () => {
  const buffer = new Uint8Array(6); // 6 bytes = 8 base64 characters
  crypto.getRandomValues(buffer);
  // btoa converts the byte string to a base64 string
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-') // URL-safe characters
    .replace(/\//g, '_') // URL-safe characters
    .replace(/=/g, '');  // Remove padding
};

/**
 * Cloudflare Pages function to handle POST requests for creating a shareable quote link.
 * It receives the suite data, generates a unique ID, stores the data in a KV store,
 * and returns the ID.
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    // Fix: Changed `request.json<SuiteItem[]>()` to `(await request.json()) as SuiteItem[]` to fix the generic type error.
    const suite = (await request.json()) as SuiteItem[];

    // Basic validation to ensure we received valid-looking data.
    if (!Array.isArray(suite) || suite.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid suite data provided.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = generateId();
    const suiteJsonString = JSON.stringify(suite);

    // Store the JSON string in the KV namespace with the generated ID as the key.
    // Set an expiration TTL (Time To Live) of 90 days (in seconds).
    const expirationTtl = 90 * 24 * 60 * 60; 
    await env.QUOTES_KV.put(id, suiteJsonString, { expirationTtl });

    // Respond with the generated ID so the client can construct the shareable URL.
    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in /api/create-share-link function:', error);
    return new Response(JSON.stringify({ error: 'Failed to create shareable link.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
