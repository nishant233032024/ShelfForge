"use client";

import { useEffect, useState } from "react";
import { BOOK_STATUS_OPTIONS, MAX_BOOK_NOTES } from "@/lib/constants";
import { validateBookForm } from "@/lib/validators";
import InputField from "@/components/shared/InputField";
import TextAreaField from "@/components/shared/TextAreaField";
import SelectField from "@/components/shared/SelectField";
import Button from "@/components/shared/Button";
import InlineMessage from "@/components/shared/InlineMessage";
import TagChipInput from "./TagChipInput";

const EMPTY_FORM = {
  title: "",
  author: "",
  status: "want_to_read",
  tags: [],
  notes: "",
};

export default function BookFormModal({
  isOpen,
  mode = "create",
  initialBook = null,
  isSaving = false,
  onClose,
  onSubmit,
}) {
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "edit" && initialBook) {
      setFormValues({
        title: initialBook.title,
        author: initialBook.author,
        status: initialBook.status,
        tags: initialBook.tags || [],
        notes: initialBook.notes || "",
      });
    } else {
      setFormValues(EMPTY_FORM);
    }

    setFormError("");
  }, [isOpen, mode, initialBook]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const validationMessage = validateBookForm(formValues);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    try {
      await onSubmit(formValues);
    } catch (error) {
      setFormError(error.message || "Unable to save book");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-form-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-paper p-5 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="book-form-title" className="text-lg font-semibold text-ink">
              {mode === "edit" ? "Edit book" : "Add a book"}
            </h2>
            <p className="mt-1 text-sm text-ink/70">
              Keep the details simple and useful for later filtering.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-ink/20 bg-white px-2 py-1 text-sm text-ink"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="title"
            label="Title"
            value={formValues.title}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, title: event.target.value }))
            }
            required
          />
          <InputField
            id="author"
            label="Author"
            value={formValues.author}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, author: event.target.value }))
            }
            required
          />
          <SelectField
            id="status"
            label="Status"
            value={formValues.status}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, status: event.target.value }))
            }
            options={BOOK_STATUS_OPTIONS}
            required
          />
          <TagChipInput
            tags={formValues.tags}
            onChange={(nextTags) =>
              setFormValues((current) => ({ ...current, tags: nextTags }))
            }
          />
          <TextAreaField
            id="notes"
            label="Notes (optional)"
            value={formValues.notes}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, notes: event.target.value }))
            }
            placeholder="A line about why this book matters to you"
            maxLength={MAX_BOOK_NOTES}
            hint={`${formValues.notes.length}/${MAX_BOOK_NOTES}`}
          />

          {formError ? <InlineMessage>{formError}</InlineMessage> : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : mode === "edit" ? "Save changes" : "Add book"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
