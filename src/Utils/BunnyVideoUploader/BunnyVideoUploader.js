import * as tus from "tus-js-client";
function getUnixTimestampPlusOneHour() {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 1); // Add 1 hour
  return Math.floor(currentDate.getTime() / 1000); // Convert to Unix timestamp (seconds)
}

// Helper function to extract token from signedUrl
function extractTokenFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("token");
  } catch (error) {
    console.error("Error extracting token from URL:", error);
    return null;
  }
}

export function uploadToBunnyWithTus({
  signedUrl,
  expirationTime,
  file,
  fileSize,
  videoId,
  libraryId = 388355,
  metadata = {},
  onProgress = () => {},
  onSuccess = () => {},
  onError = () => {},
}) {
  // Extract token from the signedUrl
  const token = extractTokenFromUrl(signedUrl);

  return new Promise((resolve, reject) => {
    // Validate inputs
    if (!signedUrl || !file || !fileSize) {
      const error = new Error("Missing required parameters");
      onError(error);
      return reject(error);
    }

    const upload = new tus.Upload(file, {
      endpoint: "https://video.bunnycdn.com/tusupload",
      retryDelays: [0, 3000, 5000, 10000, 20000, 60000, 60000],
      headers: {
        AuthorizationSignature: token || signedUrl,
        AuthorizationExpire: expirationTime,
        VideoId: videoId,
        LibraryId: libraryId,
      },
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
