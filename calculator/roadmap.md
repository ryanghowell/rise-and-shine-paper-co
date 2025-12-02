# Application Roadmap: Future Features

This document outlines potential features and integrations for the Letterpress Price Calculator.

## QuickBooks Integration: Create an Estimate

### 1. Feature Overview

The primary goal of this feature is to bridge the gap between quoting and accounting by allowing the business owner to push a finalized quote from this calculator directly into their QuickBooks Online account as a formal **Estimate**.

This streamlines the workflow, reduces manual data entry, eliminates copy-paste errors, and formalizes the sales process.

### 2. User Workflow

1.  **Trigger Point**: After a user (the client) successfully submits their information for a formal quote, the application displays a "Thank You" screen.
2.  **Internal Action**: On this "Thank You" screen, a new button, visible only to the business owner (not the client), will appear: **"Create QuickBooks Estimate"**.
3.  **Process**:
    *   Clicking the button sends the complete quote data (customer info, all line items, totals) to a secure backend function.
    *   The button will enter a "loading" state to provide visual feedback.
    *   The backend function connects to the QuickBooks API.
    *   It first searches for an existing customer using the provided email. If a customer exists, it uses their ID. If not, it creates a new customer record.
    *   It then creates a new **Estimate** (not an Invoice) associated with that customer.
    *   **Crucially, the estimate is created silently, without sending any email notification to the end client.** The API call must be configured to ensure this behavior (e.g., by setting `EmailStatus: "NotSet"`).
4.  **Feedback**:
    *   On success, the button changes to a "success" state (e.g., a checkmark and "Estimate Created!"). A link to the new estimate in QuickBooks could potentially be provided.
    *   On failure, it will show an error state, allowing the user to retry the action.

### 3. Technical Implementation Details

*   **Backend Logic**: This integration **must** be handled by a serverless function (e.g., a new `/create-quickbooks-estimate` endpoint). This is critical for securely storing and using API credentials.
*   **Authentication**: QuickBooks uses **OAuth 2.0**. A robust server-side token management system will be required to handle the initial authorization flow and subsequent token refreshes.
*   **Environment Variables**: The function will require secure environment variables for:
    *   `QUICKBOOKS_CLIENT_ID`
    *   `QUICKBOOKS_CLIENT_SECRET`
    *   `QUICKBOOKS_REALM_ID`
    *   `QUICKBOOKS_ACCESS_TOKEN` (and `REFRESH_TOKEN`)
    *   `QUICKBOOKS_API_BASE_URL` (for sandbox vs. production)
*   **Data Mapping**: The serverless function will be responsible for transforming the `suitePricing` JSON object from the application into the structured format required by the QuickBooks API for an `Estimate` object, including mapping all card and envelope details into line items.
