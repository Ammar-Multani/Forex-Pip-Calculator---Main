/**
 * Web-only utility functions for PDF generation and download
 */

/**
 * Convert HTML string to a downloadable PDF using pure browser APIs
 * This works by using print-to-PDF functionality with a hidden iframe
 */
export const htmlToPdf = async (
  html: string,
  filename: string = "document.pdf"
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Create a hidden iframe
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // Write content to iframe
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        console.error("Could not access iframe document");
        resolve(false);
        return;
      }

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${filename}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
              }
              @media print {
                body { margin: 0; }
                @page { size: auto; margin: 10mm; }
              }
            </style>
          </head>
          <body>
            ${html}
            <script>
              // Auto prompt print dialog when loaded
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      doc.close();

      // Handle iframe print events
      iframe.onload = () => {
        setTimeout(() => {
          try {
            if (iframe.contentWindow) {
              // Add message explaining how to save as PDF
              const messageDiv = document.createElement("div");
              messageDiv.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 9999;
                font-size: 14px;
              `;
              messageDiv.innerHTML =
                'To save as PDF, select "Save as PDF" in the print dialog';
              iframe.contentDocument?.body.appendChild(messageDiv);

              // Use print dialog - this allows saving as PDF on most browsers
              iframe.contentWindow.print();

              // Clean up
              setTimeout(() => {
                document.body.removeChild(iframe);
                resolve(true);
              }, 1000);
            }
          } catch (error) {
            console.error("Print dialog error:", error);
            document.body.removeChild(iframe);
            resolve(false);
          }
        }, 500);
      };
    } catch (error) {
      console.error("Error creating PDF:", error);
      resolve(false);
    }
  });
};

/**
 * Create a Blob download that triggers browser download dialog
 */
export const downloadBlob = (
  content: string,
  filename: string,
  mimeType: string = "text/plain"
) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);

  return true;
};

/**
 * Download HTML as a file
 */
export const downloadHtml = (
  html: string,
  filename: string = "document.html"
) => {
  return downloadBlob(html, filename, "text/html");
};
