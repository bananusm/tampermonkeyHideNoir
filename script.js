// ==UserScript==
// @name         Reed hide jobs
// @namespace    http://tampermonkey.net/
// @version      2025-05-01
// @description  Hide Noir job listings on Reed.co.uk
// @author       Matt Baran
// @match        https://www.reed.co.uk/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reed.co.uk
// @grant        none
// ==/UserScript==

 function waitForRequest(url) {
        return new Promise((resolve, reject) => {
            // Check if PerformanceObserver is supported
            if (typeof PerformanceObserver === 'undefined') {
                console.warn('PerformanceObserver is not supported in this browser.');
                // Optionally, resolve immediately or after a timeout if not supported
                // For this example, we'll resolve after a short delay
                setTimeout(resolve, 1000);
                return;
            }

            // Create a PerformanceObserver to listen for resource entries (network requests)
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();

                for (const entry of entries) {
                    // Check if the entry is a resource and its name (URL) matches the target URL
                    if (entry.entryType === 'resource' && entry.name.includes(url)) {
                        console.log(`Detected target request: ${entry.name}`);
                        // Disconnect the observer once the request is found
                        observer.disconnect();
                        // Resolve the promise, indicating the request has finished
                        resolve();
                        return; // Exit the loop
                    }
                }
            });

            // Start observing resource entries
            observer.observe({ entryTypes: ['resource'] });

            // Optional: Set a timeout in case the request never happens
            const timeout = setTimeout(() => {
                console.warn(`Timeout waiting for request: ${url}`);
                observer.disconnect();
                // You might want to reject here if the request is critical
                resolve(); // Resolve even on timeout in this example
            }, 15000); // Adjust timeout duration as needed (e.g., 15 seconds)

            // Clear the timeout if the promise resolves before the timeout
            // This is handled implicitly by the promise resolving, but explicit clearing is also possible.
            // For simplicity, we rely on the promise resolving.
        });
    }

  async function hideJobCards() {

        console.log('Waiting for the specific Reed.co.uk API request...');

        // Replace with the exact URL you are waiting for
        const targetUrl = 'https://api.reed.co.uk/api-bff-jobseeker-jobs/profile/';
        await waitForRequest(targetUrl);

        console.log('Target request finished! Now running the rest of the code.');

        await new Promise(resolve => setTimeout(resolve, 800)); 

        const jobCards = document.querySelectorAll('[data-qa="job-card"]');
        for (const card of jobCards) {
            const companyLogoLink = card.querySelector('[data-qa="company-logo-link"]');
            const hide_job_button = card.querySelector('[data-qa="HideJobBtn"]');

            let isHidden = false; // Flag to indicate if a card is already hidden

            // Iterate through each class in the element's classList
            for (const className of card.classList) {
                if (className.includes("hidden")) {
                    isHidden = true;
                    break; // Exit the inner loop as soon as a matching class is found
                }
            }

            if (isHidden) {
                console.log(`Skipping card with class: ${card.classList}`);
                continue;
            }

            if (companyLogoLink) {
                const linkUrl = companyLogoLink.href;

                if (linkUrl.includes('/jobs/noir')) {
                    //console.log(card);
                    //console.log(hide_job_button);
                    console.log("clicking");
                    hide_job_button.click()
                    await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200 milliseconds before moving to next card
                }
            }
        }
    }

(function() {
    console.log("monkey load")
    hideJobCards()
})();
