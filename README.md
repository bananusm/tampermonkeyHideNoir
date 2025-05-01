Markdown

# Reed Hide Jobs

A Tampermonkey script to automatically hide Noir job listings on Reed.co.uk. You can adapit to hide hide other listings as well

## Description

This userscript runs on Reed.co.uk job listing pages (`https://www.reed.co.uk/jobs/*`). It waits for a specific API request to complete and then iterates through the displayed job cards. If a job card contains a link to '/jobs/noir' the script automatically clicks the "Hide Job" button for that listing.

This can be useful for automatically filtering out job postings from certain sources or categories you are not interested in.

## Installation

To use this script, you need a userscript manager like Tampermonkey (for Chrome, Firefox, Edge, Opera) or Greasemonkey (for Firefox).

1.  **Install a userscript manager:** If you don't have one, install Tampermonkey from your browser's extension store.
2.  **Create a new script:** Open your userscript manager's dashboard. Click on the option to create a new script (usually a plus icon or "Create a new script").
3.  **Paste the code:** Delete the default template code and paste the entire script provided below into the editor.
4.  **Save the script:** Save the new script (usually File > Save or a floppy disk icon).

The script will now run automatically when you visit a Reed.co.uk job listing page.

```javascript
// ==UserScript==
// @name          Reed hide jobs
// @namespace     [http://tampermonkey.net/](http://tampermonkey.net/)
// @version       2025-05-01
// @description   try to take over the world! // TODO: Update description
// @author        You // TODO: Replace with your name/alias
// @match         [https://www.reed.co.uk/jobs/](https://www.reed.co.uk/jobs/)*
// @icon          [https://www.google.com/s2/favicons?sz=64&domain=reed.co.uk](https://www.google.com/s2/favicons?sz=64&domain=reed.co.uk)
// @grant         none
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
         const targetUrl = '[https://api.reed.co.uk/api-bff-jobseeker-jobs/profile/](https://api.reed.co.uk/api-bff-jobseeker-jobs/profile/)';
         await waitForRequest(targetUrl);

         console.log('Target request finished! Now running the rest of the code.');

         await new Promise(resolve => setTimeout(resolve, 800)); // Wait for 800 milliseconds

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
```
# How It Works
The script uses PerformanceObserver to detect when a specific API request (https://api.reed.co.uk/api-bff-jobseeker-jobs/profile/) has completed. This helps ensure that the job listings are loaded before the script attempts to modify them.

Once the target request is detected, the script finds all elements with the data-qa="job-card" attribute. For each card, it checks if it contains a link with /jobs/noir in its URL (usually found within the company logo link). If such a link is found and the card is not already marked as hidden, the script triggers a click event on the "Hide Job" button within that card.

A small delay is included between clicking buttons to prevent potential UI issues as it just won't click them all if its too fast

Notes
The script relies on the structure and data-qa attributes of the Reed.co.uk website. If Reed.co.uk changes its website structure, the script may break.
The specific API URL (https://api.reed.co.uk/api-bff-jobseeker-jobs/profile/) is hardcoded. If this URL changes, the script will stop working correctly.
The script includes console.log statements for debugging purposes. You can view these in your browser's developer console.
The script attempts to hide jobs by simulating a click on the "Hide Job" button. This assumes the button exists and is functional.
License
This script is provided as-is, without any warranty. Use at your own risk.

Author
Matt Baran
