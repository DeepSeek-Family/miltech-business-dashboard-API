export const getImageUrl = (path) => {
  // const baseUrl = import.meta?.env?.VITE_API_URL || "http://10.10.7.8:5005";
  // const baseUrl = import.meta?.env?.VITE_API_URL || "http://31.97.114.108:5004";
  const baseUrl = import.meta?.env?.VITE_API_URL || "https://44kb593x-5004.inc1.devtunnels.ms";

  if (!path || typeof path !== "string") {
    return "/images/default-avatar.png";
  }
  if (path.startsWith("blob:") || path.startsWith("data:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) return `${baseUrl}${path}`;
  return `${baseUrl}/${path}`;
};
