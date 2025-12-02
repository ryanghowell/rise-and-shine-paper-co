

import React, { useState, useEffect } from 'react';
import { SuitePricing, SubmissionState, QuoteOptions, EnvelopeQuoteOptions } from './types';
import { SIZES, INITIAL_PAPER_COSTS } from './config';
import { formatCurrency } from './utils';

type QuickBooksState = 'idle' | 'creating' | 'success' | 'error';

const SubmissionFormComponent: React.FC<{
    suitePricing: SuitePricing,
    paperCosts: typeof INITIAL_PAPER_COSTS,
    onReset: () => void,
    finalGrandTotal: number,
    onClose: () => void,
}> = ({ suitePricing, paperCosts, onReset, finalGrandTotal, onClose }) => {
    const SUBMISSION_ENDPOINT = '/submit-quote';
    const QB_ENDPOINT = '/create-quickbooks-estimate';

    const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
    const [quickBooksState, setQuickBooksState] = useState<QuickBooksState>('idle');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [userNotes, setUserNotes] = useState('');
    const [artworkFiles, setArtworkFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [qbError, setQbError] = useState<string | null>(null);
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        // Prevent scrolling on the body when the modal is open
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        // Cleanup function to restore scrolling when the modal is closed
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []); // Empty dependency array ensures this runs only on mount and unmount


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setArtworkFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setArtworkFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !userEmail) {
            setError('Please fill out all required fields.');
            return;
        }
        
        setSubmissionState('submitting');
        setError(null);

        let quoteSummary = `Quote Details:\n\n`;
        suitePricing.itemPrices.forEach(item => {
            quoteSummary += `----------------------------------------\n`;

            if (item.type === 'card') {
                const options = item.options;
                const paperInfo = paperCosts[options.paper];
                const sizeInfo = SIZES[options.size];
                const isHandmade = options.paper === 'handmade';
                const effectivePaperWeight = options.size.endsWith('f') || isHandmade ? 110 : options.paperWeight;
                
                const printingMethods: string[] = [];
                if (options.digitalPrintingFront && options.digitalPrintingBack) {
                    printingMethods.push('Digital (Double-Sided)');
                } else if (options.digitalPrintingFront) {
                    printingMethods.push('Digital (Front)');
                } else if (options.digitalPrintingBack) {
                    printingMethods.push('Digital (Back)');
                }
                if (options.inkColorsFront > 0) printingMethods.push(`${options.inkColorsFront} Ink (Front)`);
                if (options.foilColorsFront > 0) printingMethods.push(`${options.foilColorsFront} Foil (Front)`);
                if (options.blindDebossFront) printingMethods.push('Blind Deboss (Front)');
                if (options.blindEmbossFront) printingMethods.push('Blind Emboss (Front)');
                if (options.inkColorsBack > 0) printingMethods.push(`${options.inkColorsBack} Ink (Back)`);
                if (options.foilColorsBack > 0) printingMethods.push(`${options.foilColorsBack} Foil (Back)`);
                if (options.blindDebossBack) printingMethods.push('Blind Deboss (Back)');
                if (options.blindEmbossBack) printingMethods.push('Blind Emboss (Back)');
                const printingSummary = printingMethods.length > 0 ? printingMethods.join(' + ') : 'No Printing';

                quoteSummary += `Item: ${item.name} | Total: ${formatCurrency(item.total)}\n`;
                quoteSummary += `Specs: ${options.quantity} x ${sizeInfo.name} on ${paperInfo.name}${isHandmade ? '' : ` (${effectivePaperWeight}lb)`}\n`;
                quoteSummary += `Printing: ${printingSummary}\n`;
                
                let finishingSummary = [];
                if (item.edgePaintCost > 0) {
                    finishingSummary.push(`Edge Painting (${formatCurrency(item.edgePaintCost)})`);
                }
                // Fix: `options.dieCut` is now correctly typed as `item.type` is 'card', resolving the error.
                if (options.dieCut !== 'none') {
                    const dieCutLabel = options.dieCut === 'custom' ? 'Custom Die Cutting' : 'Stock Die Cutting';
                    finishingSummary.push(`${dieCutLabel} (${formatCurrency(item.dieCutCost)})`);
                }
                 if (item.duplexCost > 0) {
                    finishingSummary.push(`Duplexing (${formatCurrency(item.duplexCost)})`);
                }
                if(finishingSummary.length > 0) {
                  quoteSummary += `Finishing: ${finishingSummary.join(' + ')}\n`;
                }
            } else if (item.type === 'envelope') {
                const options = item.options as EnvelopeQuoteOptions;
                const sizeInfo = SIZES[options.size];
                const envelopeDetails: string[] = [];
                envelopeDetails.push(options.type === 'double' ? 'Double Envelopes' : 'Single Envelopes');
                if (options.returnAddressPrinting !== 'none') {
                    const printMethod = options.returnAddressPrinting.charAt(0).toUpperCase() + options.returnAddressPrinting.slice(1);
                    const locationInfo = (options.size === 'a2' || options.size === 'four_bar')
                        ? ` (${options.returnAddressLocation})`
                        : '';
                    envelopeDetails.push(`Return Address: ${printMethod}${locationInfo}`);
                }
                if (options.guestAddressing) {
                    envelopeDetails.push('Guest Addressing');
                }
                if (options.innerGuestAddressing) {
                    envelopeDetails.push('Inner Guest Addressing');
                }
                if (options.liner) {
                    const assembly = options.linerAssembly ? ' (Assembled)' : ' (Unassembled)';
                    envelopeDetails.push(`Envelope Liners${assembly}`);
                }
                quoteSummary += `Item: ${item.name} | Total: ${formatCurrency(item.total)}\n`;
                quoteSummary += `Specs: ${options.quantity} x ${sizeInfo.name.replace('Card', '')} Envelopes\n`;
                quoteSummary += `Options: ${envelopeDetails.join(' + ')}\n`;
            }

            quoteSummary += `\n`;
        });
        
        quoteSummary += `----------------------------------------\n`;
        quoteSummary += `GRAND TOTAL: ${formatCurrency(finalGrandTotal)}\n\n`;
        quoteSummary += `Production Speed: Standard (15-20 business days, plus shipping)\n`;

        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('phoneNumber', phoneNumber);
        formData.append('email', userEmail);
        formData.append('deliveryDate', deliveryDate || 'Not specified');
        formData.append('notes', userNotes);
        formData.append('quote_summary', quoteSummary);
        
        artworkFiles.forEach(file => {
          formData.append('attachment', file);
        });

        try {
            const response = await fetch(SUBMISSION_ENDPOINT, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setSubmissionState('success');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Form submission failed. The server responded with an error.');
            }

        } catch (err) {
            console.error("Error submitting quote:", err);
            setError(err instanceof Error ? err.message : "Sorry, we couldn't send your quote. Please check your connection and try again later.");
            setSubmissionState('error');
        }
    };

    const handleCreateQuickBooksEstimate = async () => {
        setQuickBooksState('creating');
        setQbError(null);

        try {
            const payload = {
                customerInfo: {
                    firstName,
                    lastName,
                    email: userEmail,
                },
                suitePricing,
                paperCosts,
                finalGrandTotal,
            };

            const response = await fetch(QB_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create QuickBooks estimate.');
            }

            setQuickBooksState('success');

        } catch (err) {
            console.error("Error creating QuickBooks estimate:", err);
            setQbError(err instanceof Error ? err.message : "An unknown error occurred.");
            setQuickBooksState('error');
        }
    };


    const handleStartNewQuote = () => {
        onReset();
        setSubmissionState('idle');
        setQuickBooksState('idle');
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setUserEmail('');
        setDeliveryDate('');
        setUserNotes('');
        setArtworkFiles([]);
        setError(null);
        setQbError(null);
        onClose();
    };

    const content = submissionState === 'success' ? (
        <div className="text-center p-6 bg-white">
            <h3 className="text-lg font-bold font-serif text-green-950">Thank You, {firstName}!</h3>
            <p className="mt-2 text-sm text-green-900">Your request has been sent successfully. We'll review the details and get back to you at <span className="font-semibold">{userEmail}</span> within one business day.</p>
            <div className="mt-6 space-y-3">
                <button
                    onClick={handleStartNewQuote}
                    className="w-full bg-green-900 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-950 transition-colors shadow-sm"
                >
                    Start a New Quote
                </button>
                <div className="border-t border-stone-200 pt-3">
                    <button
                        onClick={handleCreateQuickBooksEstimate}
                        disabled={quickBooksState !== 'idle' && quickBooksState !== 'error'}
                        className="w-full bg-white text-stone-700 font-semibold py-2 px-4 rounded-md border border-stone-300 hover:bg-stone-50 transition-colors shadow-sm disabled:bg-stone-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {quickBooksState === 'creating' && (
                            <svg className="animate-spin h-5 w-5 text-stone-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {quickBooksState === 'success' && (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                           </svg>
                        )}
                        {quickBooksState === 'idle' && 'Create QuickBooks Estimate'}
                        {quickBooksState === 'creating' && 'Creating...'}
                        {quickBooksState === 'success' && 'Estimate Created!'}
                        {quickBooksState === 'error' && 'Retry QuickBooks Estimate'}
                    </button>
                    {qbError && <p className="text-xs text-red-600 mt-2">{qbError}</p>}
                    <p className="text-xs text-stone-500 mt-2">This is an internal action and will not notify the customer.</p>
                </div>
            </div>
        </div>
    ) : (
        <form onSubmit={handleSubmit} className="w-full" noValidate>
            <div className="flex justify-between items-center p-4 border-b border-stone-200 bg-white rounded-t-lg">
                <h3 className="text-lg font-semibold font-serif text-stone-800">Ready for a formal quote?</h3>
                <button type="button" onClick={onClose} aria-label="Close" className="text-stone-400 hover:text-stone-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <label htmlFor="firstName" className="block text-xs font-medium text-stone-600">First Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="mt-1 block w-full px-2 py-1.5 text-xs bg-white border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-green-900 focus:border-green-900"
                            placeholder="Alex"
                            required
                            disabled={submissionState === 'submitting'}
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-xs font-medium text-stone-600">Last Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="mt-1 block w-full px-2 py-1.5 text-xs bg-white border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-green-900 focus:border-green-900"
                            placeholder="Smith"
                            required
                            disabled={submissionState === 'submitting'}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-stone-600">Contact Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userEmail}
                        onChange={e => setUserEmail(e.target.value)}
                        className="mt-1 block w-full px-2 py-1.5 text-xs bg-white border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-green-900 focus:border-green-900"
                        placeholder="your.email@example.com"
                        required
                        disabled={submissionState === 'submitting'}
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-medium text-stone-600">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="mt-1 block w-full px-2 py-1.5 text-xs bg-white border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-green-900 focus:border-green-900"
                        placeholder="(555) 123-4567"
                        disabled={submissionState === 'submitting'}
                    />
                </div>
                <div>
                    <label htmlFor="delivery-date" className="block text-xs font-medium text-stone-600">When do you need your project delivered?</label>
                    <div className="relative mt-1">
                        <input
                            type="date"
                            id="delivery-date"
                            name="delivery-date"
                            value={deliveryDate}
                            onChange={e => setDeliveryDate(e.target.value)}
                            className={`block w-full px-2 py-1.5 text-xs pr-8 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-900 focus:border-green-900 ${deliveryDate ? 'text-stone-800' : 'text-stone-400'} cursor-pointer`}
                            min={today}
                            disabled={submissionState === 'submitting'}
                        />
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-1 text-xs text-stone-500">Current turnaround is approximately four weeks, and may vary depending on the season.</p>
                </div>
                <div>
                    <label htmlFor="artwork" className="block text-xs font-medium text-stone-600">Attach Files (Artwork, Photos, etc.)</label>
                    <div className="mt-1">
                        <label className="w-full flex justify-center items-center gap-2 cursor-pointer bg-white border border-stone-300 rounded-md shadow-sm px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span>Add Files...</span>
                            <input
                                type="file"
                                id="artwork"
                                name="artwork"
                                onChange={handleFileChange}
                                className="sr-only"
                                accept="image/*,.pdf,.ai,.eps"
                                multiple
                                disabled={submissionState === 'submitting'}
                            />
                        </label>
                    </div>
                     {artworkFiles.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                            {artworkFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-stone-100 p-1.5 rounded-md text-xs">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-stone-700 truncate" title={file.name}>{file.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(index)}
                                        className="text-stone-500 hover:text-red-600 transition-colors shrink-0"
                                        aria-label={`Remove ${file.name}`}
                                        disabled={submissionState === 'submitting'}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                 <div>
                    <label htmlFor="notes" className="block text-xs font-medium text-stone-600">Notes or Questions</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={userNotes}
                        onChange={e => setUserNotes(e.target.value)}
                        rows={2}
                        className="mt-1 block w-full px-2 py-1.5 text-xs bg-white border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-green-900 focus:border-green-900"
                        placeholder="Anything else we should know?"
                        disabled={submissionState === 'submitting'}
                    />
                </div>
            </div>
            <div className="p-4 bg-stone-100 border-t border-stone-200 rounded-b-lg">
                {error && <p className="text-xs text-red-600 text-center mb-2">{error}</p>}
                <button
                    type="submit"
                    disabled={submissionState === 'submitting' || !firstName || !lastName || !userEmail}
                    className="w-full bg-green-900 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-green-950 transition-colors shadow-sm disabled:bg-stone-400 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                >
                    {submissionState === 'submitting' ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </>
                    ) : 'Send Estimate for Review'}
                </button>
            </div>
        </form>
    );
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-stone-50 rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                {content}
            </div>
        </div>
    );
}

export const SubmissionForm = React.memo(SubmissionFormComponent);