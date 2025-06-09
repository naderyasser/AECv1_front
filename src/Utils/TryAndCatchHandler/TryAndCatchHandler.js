/**
 *
 * @param {Function} fn
 * @param {Object} errorConfig
 * @returns {Promise<{ data: any, error: Error | null }>}
 */
export const tryCatch = async (fn, errorConfig = {}) => {
  const {
    logError = true,
    defaultValue = null,
    customErrorMessage = "",
    onError = null,
  } = errorConfig;

  try {
    const result = await fn();
    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.log(error);
    if (logError) {
      console.error("Error occurred:", {
        message: error.message,
        stack: error.stack,
        customMessage: customErrorMessage,
      });
    }

    if (onError && typeof onError === "function") {
      await onError(error);
    }

    return {
      data: defaultValue,
      error: {
        message: customErrorMessage || error.message,
        originalError: error,
      },
    };
  }
};
