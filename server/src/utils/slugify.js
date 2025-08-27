// Convert a string into a URL-friendly slug
export const slugify = (s) =>
  s.toLowerCase().trim()                // Lowercase and remove surrounding whitespace
   .replace(/[^a-z0-9\s-]/g, '')       // Remove invalid characters
   .replace(/\s+/g, '-')                // Replace spaces with hyphens
   .replace(/-+/g, '-');                // Collapse multiple hyphens into one
