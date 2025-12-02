
import React from 'react';

const timelineSteps = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "1. Finalize Your Quote",
      description: "This is where we are now! Once you submit your estimate, our team will review the details with you, answer any questions, and provide a final, formal quote for your approval.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: "2. Submit Artwork & Payment",
      description: "After you approve the final quote, you'll submit your final artwork files. Payment is also collected at this stage, which officially secures your project in our production queue.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "3. Digital Proof Approval",
      description: "This is the most critical step for you! We will create and send you a final digital PDF proof. You'll need to carefully review every detail. Your approval is our green light to make the printing plates.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "4. Production & Craftsmanship",
      description: "Your 4-week production timeline begins here. Our skilled artisans will mix the ink, press your design, handle any finishing touches like edge painting, and perform meticulous quality checks.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8a1 1 0 001-1zM22 7h-4v8H6l-2 2V5a2 2 0 012-2h14a2 2 0 012 2v2z" />
        </svg>
      ),
      title: "5. Your Order Ships!",
      description: "Once production is complete, we carefully package your beautiful letterpress suite and ship it directly to you. You'll receive a notification and tracking information.",
    },
];
  
const ProcessTimelineComponent = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-3xl mx-auto">
        <div className="p-6">
            <h2 className="text-2xl font-bold text-center font-serif text-stone-800">Our Process</h2>
            <p className="text-center text-sm text-stone-500 mt-1">From Quote to Keepsake</p>
        </div>
        <div className="p-6 space-y-4">
            {timelineSteps.map((step, index) => (
            <div key={step.title} className="flex gap-4 items-start">
                <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    {step.icon}
                </div>
                {index < timelineSteps.length - 1 && (
                    <div className="w-px h-12 bg-stone-200 my-1"></div>
                )}
                </div>
                <div>
                <h4 className="font-semibold text-stone-700">{step.title}</h4>
                <p className="text-sm text-stone-500 mt-1">{step.description}</p>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export const ProcessTimeline = React.memo(ProcessTimelineComponent);