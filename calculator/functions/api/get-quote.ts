// This type definition is a stand-in for the one provided by Cloudflare's environment.
// It allows the function to be type-checked without needing the full `@cloudflare/workers-types` package.
type PagesFunction<Env = unknown> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

// Fix: Added a stand-in type definition for Cloudflare's KVNamespace to resolve the 'Cannot find name' error.
// A stand-in for the Cloudflare KVNamespace type.
interface KVNamespace {
  get(key: string): Promise<string | null>;
}

// Define the environment binding for the KV namespace.
interface Env {
  QUOTES_KV: KVNamespace;
}

/**
 * Cloudflare Pages function to handle GET requests for retrieving a shared quote.
 * It reads the 'id' from the query parameters, fetches the corresponding data
 * from the KV store, and returns it.
 */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'No quote ID provided.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Retrieve the stored quote data from the KV namespace using the provided ID.
    const suiteJsonString = await env.QUOTES_KV.get(id);

    if (suiteJsonString === null) {
      // If the key doesn't exist (or has expired), return a 404 Not Found response.
      return new Response(JSON.stringify({ error: 'Quote not found or has expired.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If the data is found, return it directly. The content type should match
    // how it was stored (JSON).
    return new Response(suiteJsonString, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in /api/get-quote function:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch quote data.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
