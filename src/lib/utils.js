import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a URL-friendly slug from a string
 */
export function generateSlug(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-");    // Replace spaces with hyphens
}

/**
 * Ensures a slug is unique in the specified table
 */
export async function getUniqueSlug(table, name, db) {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const result = await db.query(
      `SELECT id FROM ${table} WHERE slug = $1 LIMIT 1`,
      [slug]
    );

    if (result.rowCount === 0) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
}
/**
 * Returns the base URL for the application
 */
export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return 'http://localhost:3000';
}
