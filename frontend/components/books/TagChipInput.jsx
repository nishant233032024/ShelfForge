"use client";

import { useState } from "react";
import { MAX_BOOK_TAGS } from "@/lib/constants";

export default function TagChipInput({ tags, onChange }) {
  const [tagDraft, setTagDraft] = useState("");

  function addTag(rawTag) {
    const normalizedTag = rawTag.trim().toLowerCase();

    if (!normalizedTag) {
      return;
    }

    if (tags.includes(normalizedTag)) {
      setTagDraft("");
      return;
    }

    if (tags.length >= MAX_BOOK_TAGS) {
      return;
    }

    onChange([...tags, normalizedTag]);
    setTagDraft("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(tagDraft.replace(",", ""));
    }
  }

  function removeTag(tagToRemove) {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  }

  return (
    <div className="space-y-2">
      <label htmlFor="tagDraft" className="block text-sm font-medium text-ink">
        Tags
      </label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => removeTag(tag)}
            className="inline-flex items-center gap-1 rounded-full border border-ink/20 bg-white px-2.5 py-1 text-xs text-ink"
            aria-label={`Remove tag ${tag}`}
          >
            {tag}
            <span aria-hidden="true">×</span>
          </button>
        ))}
      </div>
      <input
        id="tagDraft"
        value={tagDraft}
        onChange={(event) => setTagDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          tags.length >= MAX_BOOK_TAGS
            ? "Tag limit reached"
            : "Type a tag and press Enter"
        }
        disabled={tags.length >= MAX_BOOK_TAGS}
        className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 disabled:opacity-60"
      />
      <p className="text-xs text-ink/50">
        {tags.length}/{MAX_BOOK_TAGS} tags · press Enter or comma to add
      </p>
    </div>
  );
}
