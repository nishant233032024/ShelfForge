function sanitizeTags(rawTags) {
  if (!Array.isArray(rawTags)) {
    return [];
  }

  const normalizedTags = rawTags
    .filter((tag) => typeof tag === "string")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  return [...new Set(normalizedTags)].slice(0, 8);
}

module.exports = sanitizeTags;
