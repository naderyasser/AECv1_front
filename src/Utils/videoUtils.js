export const getEmbedVideoUrl = (url) => {
  if (!url) return null;

  // Handle YouTube URLs
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = extractYoutubeId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // Handle Vimeo URLs
  if (url.includes("vimeo.com")) {
    const vimeoId = url.split("/").pop();
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
  }

  return url;
};

function extractYoutubeId(url) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}
