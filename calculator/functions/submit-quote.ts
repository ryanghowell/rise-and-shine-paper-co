// This type definition is a stand-in for the one provided by Cloudflare's environment.
// It allows the function to be type-checked without needing the full `@cloudflare/workers-types` package.
type PagesFunction<Env = unknown> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

// Define the environment variables the function expects for Freshdesk integration.
interface Env {
  FRESHDESK_API_KEY: string;
  FRESHDESK_DOMAIN: string;
}

// Helper function to create a base64-encoded string for Basic Authentication.
function toBase64(str: string): string {
  return btoa(str);
}

// Cloudflare Pages function handler for POST requests to submit the quote.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const incomingFormData = await request.formData();

    // Validate that required Freshdesk environment variables are set.
    if (!env.FRESHDESK_API_KEY || !env.FRESHDESK_DOMAIN) {
      console.error('Server configuration error: Missing Freshdesk environment variables.');
      return new Response(JSON.stringify({ error: 'Server is not configured for ticket creation.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract form data from the user's request.
    const firstName = incomingFormData.get('firstName') as string;
    const lastName = incomingFormData.get('lastName') as string;
    const phoneNumber = incomingFormData.get('phoneNumber') as string;
    const email = incomingFormData.get('email') as string;
    const deliveryDate = incomingFormData.get('deliveryDate') as string;
    const notes = incomingFormData.get('notes') as string;
    const quoteSummary = incomingFormData.get('quote_summary') as string;
    const allAttachments = incomingFormData.getAll('attachment');

    if (!firstName || !lastName || !email || !quoteSummary) {
      return new Response(JSON.stringify({ error: 'Missing required form fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Construct an HTML description for the Freshdesk ticket body for better readability.
    const description = `
      <div>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phoneNumber || 'Not provided'}</p>
        <p><strong>Requested Delivery Date:</strong> ${deliveryDate || 'Not specified'}</p>
        <hr>
        <h3>Notes/Questions:</h3>
        <p>${notes || 'None'}</p>
        <hr>
        <h3>Quote Details:</h3>
        <pre>${quoteSummary}</pre>
      </div>
    `.trim();
    
    // Create a new FormData payload for the Freshdesk API, which requires multipart/form-data for attachments.
    const freshdeskFormData = new FormData();
    freshdeskFormData.append('name', `${firstName} ${lastName}`);
    freshdeskFormData.append('email', email);
    freshdeskFormData.append('phone', phoneNumber);
    freshdeskFormData.append('subject', `New Letterpress Quote Request from ${firstName} ${lastName}`);
    freshdeskFormData.append('description', description);
    freshdeskFormData.append('status', '2'); // 2: Open
    freshdeskFormData.append('priority', '1'); // 1: Low

    // Attach any uploaded files to the Freshdesk ticket.
    for (const file of allAttachments) {
        if (file instanceof File && file.size > 0) {
            freshdeskFormData.append('attachments[]', file, file.name);
        }
    }
    
    const freshdeskEndpoint = `https://${env.FRESHDESK_DOMAIN}/api/v2/tickets`;
    const encodedApiKey = toBase64(`${env.FRESHDESK_API_KEY}:X`);

    // Send the request to the Freshdesk API.
    const freshdeskResponse = await fetch(freshdeskEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedApiKey}`,
      },
      body: freshdeskFormData, // Let the `fetch` API set the `Content-Type` to `multipart/form-data` with the correct boundary.
    });

    if (!freshdeskResponse.ok) {
      const errorBody = await freshdeskResponse.text();
      console.error(`Freshdesk API error: ${freshdeskResponse.statusText}`, errorBody);
      return new Response(JSON.stringify({ error: 'Failed to create ticket via provider.' }), {
        status: 502, // Bad Gateway
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in /submit-quote function:', error);
    return new Response(JSON.stringify({ error: 'An unexpected server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
