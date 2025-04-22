import { isWeb } from "../utils/platform";

// PDF options interface
interface PDFOptions {
  html: string;
  fileName?: string;
  directory?: string;
  base64?: boolean;
  width?: number;
  height?: number;
}

// PDF creation result interface
interface PDFResult {
  filePath?: string;
  base64?: string;
  success: boolean;
  error?: string;
}

/**
 * Create PDF from HTML content with platform-specific implementations
 */
export const createPDF = async (options: PDFOptions): Promise<PDFResult> => {
  try {
    if (isWeb) {
      return await webCreatePDF(options);
    } else {
      // Import the native module only on native platforms
      const RNHTMLtoPDF = await import("react-native-html-to-pdf").then(
        (m) => m.default
      );

      const result = await RNHTMLtoPDF.convert({
        html: options.html,
        fileName: options.fileName || "document",
        directory: options.directory || "Documents",
        base64: options.base64 || false,
        width: options.width,
        height: options.height,
      });

      return {
        filePath: result.filePath,
        base64: result.base64,
        success: true,
      };
    }
  } catch (error) {
    console.error("Error creating PDF:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Web implementation for PDF creation and download
 */
const webCreatePDF = async (options: PDFOptions): Promise<PDFResult> => {
  try {
    // First try jsPDF with html2canvas if available
    if (typeof window !== "undefined") {
      try {
        // Try to dynamically import jsPDF library
        const jsPDFModule = await import("jspdf");
        if (jsPDFModule && jsPDFModule.default) {
          return await generatePDFWithJsPDF(options);
        }
      } catch (e) {
        console.log("jsPDF not available, trying web utilities");
      }
    }

    // Second try using web utilities
    try {
      const webPdfUtils = await import("../utils/webPdf");
      const success = await webPdfUtils.htmlToPdf(
        options.html,
        `${options.fileName || "document"}.pdf`
      );

      return {
        success,
        filePath: `${options.fileName || "document"}.pdf`,
      };
    } catch (e) {
      console.log(
        "Web PDF utilities not available, falling back to print method"
      );
    }

    // Last resort: fallback to print-based PDF creation
    return await printBasedPDF(options);
  } catch (error) {
    console.error("Error creating PDF on web:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Generate PDF using the browser's print functionality
 */
const printBasedPDF = async (options: PDFOptions): Promise<PDFResult> => {
  return new Promise((resolve) => {
    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.visibility = "hidden";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    iframe.onload = () => {
      try {
        // Write content to iframe
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) throw new Error("Could not access iframe document");

        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${options.fileName || "Document"}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                }
                @media print {
                  body { margin: 0; }
                }
              </style>
            </head>
            <body>
              ${options.html}
            </body>
          </html>
        `);
        doc.close();

        // Add info text to let user know how to save
        const infoDiv = doc.createElement("div");
        infoDiv.style.position = "fixed";
        infoDiv.style.top = "10px";
        infoDiv.style.left = "10px";
        infoDiv.style.backgroundColor = "rgba(0,0,0,0.7)";
        infoDiv.style.color = "white";
        infoDiv.style.padding = "10px";
        infoDiv.style.borderRadius = "5px";
        infoDiv.style.zIndex = "9999";
        infoDiv.style.fontSize = "14px";
        infoDiv.innerHTML =
          'To save as PDF, select "Save as PDF" in the print dialog';
        infoDiv.style.display = "none"; // Hide in print
        doc.body.appendChild(infoDiv);

        // Print the iframe content after a short delay
        setTimeout(() => {
          try {
            iframe.contentWindow?.print();
            setTimeout(() => {
              // Clean up the iframe after printing
              document.body.removeChild(iframe);
              resolve({
                success: true,
                filePath: `${options.fileName || "document"}.pdf`,
              });
            }, 1000);
          } catch (e) {
            document.body.removeChild(iframe);
            resolve({
              success: false,
              error: "Print dialog could not be opened",
            });
          }
        }, 500);
      } catch (error) {
        document.body.removeChild(iframe);
        resolve({
          success: false,
          error: error.message,
        });
      }
    };
  });
};

/**
 * Generate and download PDF using html2canvas and jsPDF
 * Note: Requires 'jspdf' and 'html2canvas' libraries
 */
const generatePDFWithJsPDF = async (
  options: PDFOptions
): Promise<PDFResult> => {
  try {
    // Dynamically import the required libraries
    const jsPDFModule = await import("jspdf");
    const html2canvasModule = await import("html2canvas");

    const jsPDF = jsPDFModule.default;
    const html2canvas = html2canvasModule.default;

    // Create a temporary container to render the HTML
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.innerHTML = options.html;
    document.body.appendChild(container);

    // Render the HTML to canvas
    const canvas = await html2canvas(container);

    // Create PDF
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF
    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

    // Save the PDF
    const fileName = `${options.fileName || "document"}.pdf`;
    pdf.save(fileName);

    // Clean up
    document.body.removeChild(container);

    return {
      success: true,
      filePath: fileName,
    };
  } catch (error) {
    console.error("Error generating PDF with jsPDF:", error);
    // Try other fallback methods
    try {
      const webPdfUtils = await import("../utils/webPdf");
      const success = await webPdfUtils.htmlToPdf(
        options.html,
        `${options.fileName || "document"}.pdf`
      );

      return {
        success,
        filePath: `${options.fileName || "document"}.pdf`,
      };
    } catch (e) {
      // Fall back to print method if all else fails
      return await printBasedPDF(options);
    }
  }
};
