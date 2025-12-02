
// This type definition is a stand-in for the one provided by Cloudflare's environment.
// It allows the function to be type-checked without needing the full `@cloudflare/workers-types` package.
type PagesFunction<Env = unknown> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

// Define the environment variables the function expects for QuickBooks integration.
// In a real application, these would be securely stored in the Cloudflare environment.
interface Env {
  QUICKBOOKS_CLIENT_ID: string;
  QUICKBOOKS_CLIENT_SECRET: string;
  QUICKBOOKS_ACCESS_TOKEN: string; // This would typically be managed via an OAuth2 flow.
  QUICKBOOKS_REALM_ID: string;
  QUICKBOOKS_API_BASE_URL: string; // e.g., 'https://sandbox-quickbooks.api.intuit.com'
}

// NOTE: These are placeholder types. In a real app, you would import these
// from your shared types file or define them more robustly.
interface CustomerInfo {
    firstName: string;
    lastName: string;
    email: string;
}
interface SuitePricing {
    itemPrices: any[];
}
interface RequestPayload {
    customerInfo: CustomerInfo;
    suitePricing: SuitePricing;
    paperCosts: any;
    finalGrandTotal: number;
}

/**
 * Cloudflare Pages function to create an estimate in QuickBooks.
 *
 * This function is designed to be called from the frontend after a quote has been
 * successfully submitted. It takes the customer and quote details, transforms them
 * into the format required by the QuickBooks API, and creates an estimate.
 *
 * --- REAL-WORLD IMPLEMENTATION NOTES ---
 * 1.  **Authentication**: QuickBooks uses OAuth 2.0. A real implementation would require
 *     a robust token management system (storing and refreshing access tokens). For this
 *     example, we assume an access token is available in the environment variables.
 * 2.  **Customer Matching**: Before creating an estimate, you should first search for an
 *     existing customer in QuickBooks by email. If they exist, use their ID. If not, create
 *     a new customer record first, then use the new ID to associate with the estimate.
 * 3.  **Error Handling**: The error handling should be more granular to handle specific
 *     API error codes from QuickBooks (e.g., authentication failures, validation errors).
 * 4.  **Configuration**: API URLs (sandbox vs. production) and other settings should be
 *     managed via environment variables.
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const payload: RequestPayload = await request.json();
    const { customerInfo, suitePricing } = payload;

    // --- Step 1: Data Validation ---
    if (!customerInfo || !suitePricing || !suitePricing.itemPrices) {
      return new Response(JSON.stringify({ error: 'Missing required payload data.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // --- Step 2: Map Application Data to QuickBooks Estimate Format ---
    const lineItems = suitePricing.itemPrices.map((item: any, index: number) => {
        // Here, we construct a detailed description for each line item.
        // This makes the estimate clear and easy to understand for both the business and the customer.
        let description = '';
        if (item.type === 'card') {
            const options = item.options;
            description = `${item.name}: ${options.quantity}x ${options.size} on ${options.paper} (${options.paperWeight}lb).`;
            // Add more details like printing methods, finishing, etc.
        } else if (item.type === 'envelope') {
             const options = item.options;
            description = `${item.name}: ${options.quantity}x ${options.size} ${options.type} envelopes.`;
        }

      return {
        Id: (index + 1).toString(),
        LineNum: index + 1,
        Description: description,
        Amount: item.total,
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          // In a real scenario, you might map these to specific QuickBooks "Products/Services".
          // For simplicity, we'll just use the amount and description.
          // Qty: item.options.quantity,
          // UnitPrice: item.total / item.options.quantity,
        },
      };
    });

    const quickBooksEstimatePayload = {
      Line: lineItems,
      CustomerRef: {
        // This is where you'd put the ID of the matched/created QuickBooks customer.
        // For this simulation, we'll just use the name.
        name: `${customerInfo.firstName} ${customerInfo.lastName}`
      },
      // IMPORTANT: This ensures the estimate is created without sending an email to the customer.
      EmailStatus: "NotSet", 
      BillEmail: {
        Address: customerInfo.email
      }
    };
    
    // --- Step 3: (Simulated) API Call to QuickBooks ---
    // In a real application, you would uncomment and complete the code block below.

    /*
    const { QUICKBOOKS_API_BASE_URL, QUICKBOOKS_REALM_ID, QUICKBOOKS_ACCESS_TOKEN } = env;

    if (!QUICKBOOKS_API_BASE_URL || !QUICKBOOKS_REALM_ID || !QUICKBOOKS_ACCESS_TOKEN) {
      console.error('Server configuration error: Missing QuickBooks environment variables.');
      return new Response(JSON.stringify({ error: 'Server is not configured for QuickBooks integration.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const quickbooksEndpoint = `${QUICKBOOKS_API_BASE_URL}/v3/company/${QUICKBOOKS_REALM_ID}/estimate`;

    const apiResponse = await fetch(quickbooksEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${QUICKBOOKS_ACCESS_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quickBooksEstimatePayload),
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.json();
        console.error('QuickBooks API Error:', errorBody);
        return new Response(JSON.stringify({ error: 'Failed to create estimate in accounting software.' }), {
            status: 502, // Bad Gateway
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const responseData = await apiResponse.json();
    */

    // Simulate a successful API response.
    const responseData = {
        message: 'Successfully created estimate.',
        estimate: quickBooksEstimatePayload, // Return the payload for debugging/confirmation.
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in /create-quickbooks-estimate function:', error);
    return new Response(JSON.stringify({ error: 'An unexpected server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
