# Letterpress Price Calculator

This application provides an elegant and interactive way to estimate the cost of letterpress printing jobs. Users can select quantities, paper types, ink colors, and various finishing options to get a detailed, real-time price quote.

This document breaks down how the pricing calculations work and where to find the relevant code for manual adjustments.

## Suite Building

The calculator is designed to intelligently build a typical invitation suite.

- **Adding Cards**: The first card defaults to A7. Subsequent cards default to smaller sizes (A2, then 4-Bar) which is common for insert cards like RSVP or Details cards.
- **Adding Envelopes**: The first envelope added is a standard A7 mailing envelope. A second envelope will default to an A2 size, suitable for an RSVP card. The names are also defaulted to "Envelopes" and "RSVP Envelopes" respectively for clarity.

All options can be manually adjusted after an item is added to the suite.

## Core Calculation Logic

The pricing is divided into two main categories: **Cards** and **Envelopes**. The logic for both is primarily located in two key files:

-   `src/config.ts`: This file is the central hub for all variables. It contains base labor rates, impressions per hour, setup costs, paper costs, card specifications (like yield and plate sizes), and envelope costs. **This is the first place you should look to adjust pricing.**
-   `src/pricing.ts`: This file contains the core calculation functions, `calculateCardPrice` and `calculateEnvelopePrice`. These functions take the user's selected options and the variables from `config.ts` to compute the final price for an item.

The `src/useSuiteCalculator.ts` hook orchestrates these calculations for the entire suite of items added by the user, providing individual item totals and a grand total.

---

## Card Pricing Explained

The price for a single card item is an aggregation of several cost components. The core logic resides in the `calculateCardPrice` function within `src/pricing.ts`.

### 1. Setup Costs

Setup cost covers the time it takes to prepare the press for a run. It's calculated based on the number of unique "passes" (e.g., each ink color, foil color, or blind deboss is one pass).

-   **Formula**: `(Letterpress Passes * Letterpress Setup Hours + Foil Passes * Foil Setup Hours) * Base Labor Rate`
-   **Variables in `config.ts`**:
    -   `letterpressSetupHours`
    -   `foilSetupHours`
    -   `baseLaborRate`

### 2. Plate Costs

Printing plates are created for each unique design pass. The cost depends on the plate material (photopolymer for ink, copper for foil) and the size of the plate.

-   **Formula**: `(Ink Passes * Plate Inches * Photopolymer Cost) + (Foil Passes * Plate Inches * Copper Cost)`
-   **Variables in `config.ts`**:
    -   `photopolymerPlateCost` (per square inch)
    -   `copperPlateCost` (per square inch)
    -   `INITIAL_CARD_SPECS`: This object maps each card size (e.g., 'a7') to its `plateInches`.

### 3. Paper Costs

Paper cost is determined by the total number of large "parent sheets" needed for the job. This calculation is one of the most complex.

-   **Total Pieces Needed**: `Quantity + Makeready Sheets + Waste`
    -   `baseMakereadySheets`: A flat number of sheets for initial press setup.
    -   `additionalProcessMakereadySheets`: Extra sheets for each additional process (e.g., a second color, foil, die-cutting).
    -   `runWastePercentage`: A percentage of the quantity to account for errors during the run.
-   **Sheets Needed**: `Total Pieces Needed / Yield`
    -   **Yield** is the number of cards that can be cut from a single parent sheet. This is a critical variable.
-   **Final Cost**:
    -   For standard paper: `Sheets Needed * Cost Per Sheet`.
    -   For handmade paper: `Total Pieces Needed * Per-Piece Cost`.
-   **Variables in `config.ts`**:
    -   `INITIAL_PAPER_COSTS`: Defines the cost per sheet for different paper stocks and weights.
    -   `INITIAL_HANDMADE_PAPER_COSTS`: Defines the cost per piece for handmade paper sizes.
    -   `INITIAL_CARD_SPECS`: Defines the `yield` for each card size and paper weight combination.

### 4. Run Labor Costs

This is the cost of the time the press is physically running to print the cards.

-   **Formula**: `(Impressions / Impressions Per Hour) * Base Labor Rate`
-   **Variables in `config.ts`**:
    -   `letterpressIPH` (Impressions Per Hour)
    -   `foilIPH`
    -   `baseLaborRate`

### 5. Finishing & Other Costs

-   **Digital Printing**: A flat setup fee plus a per-piece cost based on card size.
    -   Variables: `digitalPrintingSetupCost`, `INITIAL_DIGITAL_PRINTING_COSTS`
-   **Duplexing (2-ply stock)**: A flat setup fee plus a run cost based on quantity.
    -   Variables: `duplexSetupCost`, `duplexIPH`
-   **Edge Painting**: A flat setup fee plus a per-piece cost.
    -   Variables: `edgePaintSetup`, `edgePaintPerPiece`
-   **Die Cutting**: A setup cost plus a run cost. Custom shapes have an additional base fee.
    -   Variables: `dieCutSetupHours`, `dieCutIPH`, `customDieBaseCost`

---

## Envelope Pricing Explained

Envelope pricing is simpler and is handled by the `calculateEnvelopePrice` function in `src/pricing.ts`.

1.  **Blank Envelope Cost**: This is the base cost of the physical envelopes. If a printing service (like return address or guest addressing) is selected, this cost also includes a buffer for setup and waste.
    -   **Formula (no printing)**: `Quantity * Cost Per Envelope`
    -   **Formula (with printing)**: `(Quantity + Makeready + Waste) * Cost Per Envelope`
    -   **Variables in `config.ts`**:
        -   `INITIAL_ENVELOPE_COSTS`: The per-piece cost for each envelope size.
        -   `envelopePrintingMakeready`: A flat number of extra envelopes for press setup.
        -   `envelopePrintingWastePercentage`: A percentage of the quantity to account for spoilage.

2.  **Return Address Printing**:
    -   **Letterpress/Foil**: A flat setup fee plus a per-piece run cost.
        -   Variables: `letterpressReturnAddressSetup`, `letterpressReturnAddressRun`, `foilReturnAddressSetup`, `foilReturnAddressRun`
    -   **Digital**: A simple per-piece cost.
        -   Variable: `digitalReturnAddress`

3.  **Guest Addressing**: A per-piece cost for digital printing of recipient addresses on the outer envelope. An additional, separate cost can be applied for inner envelopes.
    -   **Variables in `config.ts`**: `digitalGuestAddress`, `digitalInnerGuestAddress`

4.  **Envelope Liners**: A per-piece cost for the printed liner, plus an optional additional cost for assembly (gluing the liner into the envelope).
    -   **Variables in `config.ts`**: `INITIAL_ENVELOPE_LINER_COSTS`, `envelopeLinerAssemblyCost`

---

## How to Modify Pricing & Calculations

### To Change Rates, Costs, or Specs (Easy)

-   **File**: `src/config.ts`
-   **Action**: Modify the values within the exported constant objects (e.g., `INITIAL_CALCULATION_VARS`, `INITIAL_PAPER_COSTS`, `INITIAL_CARD_SPECS`). The variable names are descriptive and map directly to the logic described above. This is where 99% of pricing updates should happen.

### To Change the Calculation Formulas (Advanced)

-   **File**: `src/pricing.ts`
-   **Action**: If you need to change *how* costs are calculated (e.g., adding a new pricing factor or changing a formula), you will need to edit the JavaScript logic within the `calculateCardPrice` or `calculateEnvelopePrice` functions.

---

## Server-Side Features & Setup

This section covers the setup required for server-side features, which are implemented using Cloudflare Functions.

### "Share This Quote" Feature

The "Share This Quote" feature allows users to generate a short, stable URL that they can share with others. When opened, this URL will load the exact quote configuration. This is achieved without embedding all the data in the URL, making it clean and secure.

-   **How it works**: When a user clicks "Share", the frontend sends the current quote data to a serverless function (`/api/create-share-link`). This function generates a unique, random ID, saves the quote data to a **Cloudflare KV store** with the ID as the key, and returns only the ID to the frontend. The frontend then constructs a clean URL (e.g., `.../?id=k8fH7nZp`). When this URL is visited, another function (`/api/get-quote`) retrieves the data from KV using the ID.

#### Required Cloudflare Setup

To enable this feature, you must configure a Cloudflare KV namespace and bind it to your Pages project. This is a one-time setup.

1.  **Step 1: Create a KV Namespace**
    *   In your Cloudflare Dashboard, go to **Workers & Pages > KV**.
    *   Click **Create a namespace**.
    *   Name it `price-calculator-quotes`.
    *   Click **Add**.

2.  **Step 2: Bind the Namespace to Your Pages Project**
    *   Navigate to your Pages project's **Settings > Functions**.
    *   Scroll to **KV namespace bindings** and click **Add binding**.
    *   For **Variable name**, you **must** enter `QUOTES_KV`. The code depends on this exact name.
    *   For **KV namespace**, select the `price-calculator-quotes` namespace you just created.
    *   Click **Save**.

Cloudflare will automatically trigger a new deployment. Once complete, the feature will be live.

### Serverless Functions (`/functions` directory)

This project uses Cloudflare Functions to handle backend logic securely.

-   `/api/create-share-link.ts`: Handles the creation of shareable quote links by storing quote data in the KV store.
-   `/api/get-quote.ts`: Retrieves a shared quote's data from the KV store using its unique ID.
-   `/submit-quote.ts`: Receives the user's contact information and the finalized quote, then creates a support ticket in Freshdesk. Requires `FRESHDESK_API_KEY` and `FRESHDESK_DOMAIN` environment variables.
-   `/create-quickbooks-estimate.ts`: (Internal use) Pushes a finalized quote to QuickBooks Online as an estimate. Requires various `QUICKBOOKS_*` environment variables for authentication.

---

## Integrations

This section details how the calculator integrates with third-party services.

### QuickBooks Online: Create an Estimate

#### 1. Feature Overview

The primary goal of this feature is to bridge the gap between quoting and accounting by allowing the business owner to push a finalized quote from this calculator directly into their QuickBooks Online account as a formal **Estimate**.

This streamlines the workflow, reduces manual data entry, eliminates copy-paste errors, and formalizes the sales process.

#### 2. User Workflow

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

#### 3. Technical Implementation Details

*   **Backend Logic**: This integration **must** be handled by a serverless function (see `functions/create-quickbooks-estimate.ts`). This is critical for securely storing and using API credentials.
*   **Authentication**: QuickBooks uses **OAuth 2.0**. A robust server-side token management system is required to handle the initial authorization flow and subsequent token refreshes. For this application, a long-lived access token is assumed to be available in the environment.
*   **Environment Variables**: The function requires secure environment variables for:
    *   `QUICKBOOKS_CLIENT_ID`
    *   `QUICKBOOKS_CLIENT_SECRET`
    *   `QUICKBOOKS_REALM_ID`
    *   `QUICKBOOKS_ACCESS_TOKEN` (and `REFRESH_TOKEN`)
    *   `QUICKBOOKS_API_BASE_URL` (for sandbox vs. production)
*   **Data Mapping**: The serverless function is responsible for transforming the `suitePricing` JSON object from the application into the structured format required by the QuickBooks API for an `Estimate` object, including mapping all card and envelope details into line items.