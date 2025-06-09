import * as tus from "tus-js-client";

/**
 * Upload a video to Vimeo using tus protocol with robust error handling
 * @param {Object} options - Upload configuration options
 * @param {string} options.signedUrl - The pre-signed upload URL
 * @param {File|Blob} options.file - The video file to upload
 * @param {number} options.fileSize - Total file size in bytes
 * @param {Object} [options.metadata] - Optional file metadata
 * @returns {Promise<string>} - Promise resolving to the uploaded video URI
 */

export function uploadToVimeoWithTus({
  signedUrl,
  file,
  fileSize,
  metadata = {},
  onProgress = () => {},
  onSuccess = () => {},
  onError = () => {},
}) {
  return new Promise((resolve, reject) => {
    // Validate inputs
    if (!signedUrl || !file || !fileSize) {
      const error = new Error("Missing required parameters");
      onError(error);
      return reject(error);
    }
    console.log(signedUrl, file, fileSize);
    const upload = new tus.Upload(file, {
      uploadUrl: signedUrl,
      metadata: {
        filename: file.name,
        filetype: file.type,
        ...metadata,
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        onProgress(Number(percentage));
      },
      onSuccess: () => {
        onSuccess();
        resolve();
      },

      onError: (error) => {
        console.error("TUS Upload Error:", error);

        if (error.name === "DetailedError") {
          console.error("Detailed Error:", {
            originalRequest: error.originalRequest,
            message: error.message,
            responseCode: error.response?.status,
            responseText: error.response?.responseText,
          });
        }

        onError(error);
        reject(error);
      },
    });
    upload.start();
  });
}
