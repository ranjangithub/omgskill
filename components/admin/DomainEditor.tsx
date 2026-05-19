"use client";

import { useState, useTransition } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface FileData {
  path: string;
  label: string;
  content: string | null;
}

interface Entry {
  title: string;
  block: string;
}

interface Section {
  header: string;
  body: string;
  entries: Entry[];
}

interface AddFormState {
  sectionHeader: string;
  filePath: string;
  fields: { key: string; value: string }[];
  title: string;
}

// ── Parsers ────────────────────────────────────────────────────────────────────

function parseSections(markdown: string): Section[] {
  const parts = markdown.split(/\n(?=## )/);
  return parts
    .filter((p) => p.startsWith("## "))
    .map((part) => {
      const lines = part.split("\n");
      const header = lines[0].replace(/^## /, "").trim();
      const body = lines.slice(1).join("\n").trim();
      const entries = parseEntries(body);
      return { header, body, entries };
    });
}

function parseEntries(sectionBody: string): Entry[] {
  const blocks = sectionBody.split(/\n(?=### )/).filter((b) => b.trim());
  return blocks
    .map((block) => {
      const lines = block.trim().split("\n");
      const title = lines[0].replace(/^### /, "").trim();
      if (!title) return null;
      return { title, block: block.trim() };
    })
    .filter(Boolean) as Entry[];
}

function parseBulletLines(body: string): string[] {
  return body
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim());
}

function isBulletSection(body: string): boolean {
  const lines = body.split("\n").filter((l) => l.trim());
  const bulletLines = lines.filter((l) => l.startsWith("- "));
  return bulletLines.length > 0 && !body.includes("### ");
}

// ── Delete helpers ─────────────────────────────────────────────────────────────

function deleteEntryFromMarkdown(markdown: string, title: string): string {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Remove block: optional --- separator + ### title + rest until next --- or ## or end
  let result = markdown.replace(
    new RegExp(`\\n---\\n\\n### ${escaped}[\\s\\S]*?(?=\\n---\\n|\\n## |$)`, "g"),
    ""
  );
  result = result.replace(
    new RegExp(`\\n### ${escaped}[\\s\\S]*?(?=\\n---\\n|\\n## |$)`, "g"),
    ""
  );
  return result.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function deleteBulletFromMarkdown(markdown: string, bulletText: string): string {
  const escaped = bulletText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return markdown.replace(new RegExp(`\\n- ${escaped}`, "g"), "").replace(/\n{3,}/g, "\n\n");
}

// ── Add entry helper ──────────────────────────────────────────────────────────

function buildEntryBlock(title: string, fields: { key: string; value: string }[]): string {
  const fieldLines = fields
    .filter((f) => f.key.trim() && f.value.trim())
    .map((f) => `**${f.key}:** ${f.value}`)
    .join("\n");
  return `### ${title}\n${fieldLines}`;
}

function insertEntryIntoSection(markdown: string, sectionHeader: string, entryBlock: string): string {
  const escaped = sectionHeader.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sectionRegex = new RegExp(`(## ${escaped}[^\\n]*\\n[\\s\\S]*?)(?=\\n## |$)`, "m");
  const match = sectionRegex.exec(markdown);
  if (!match) return markdown.trimEnd() + `\n\n---\n\n${entryBlock}\n`;
  const insertAt = match.index + match[0].trimEnd().length;
  return (
    markdown.slice(0, insertAt).trimEnd() +
    `\n\n---\n\n${entryBlock}\n\n` +
    markdown.slice(insertAt).trimStart()
  );
}

function addBulletToSection(markdown: string, sectionHeader: string, bullet: string): string {
  const escaped = sectionHeader.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sectionRegex = new RegExp(`(## ${escaped}[^\\n]*\\n[\\s\\S]*?)(?=\\n## |$)`, "m");
  const match = sectionRegex.exec(markdown);
  if (!match) return markdown.trimEnd() + `\n- ${bullet}\n`;
  const insertAt = match.index + match[0].trimEnd().length;
  return markdown.slice(0, insertAt).trimEnd() + `\n- ${bullet}\n` + markdown.slice(insertAt).trimStart();
}

// ── Section-specific field templates ──────────────────────────────────────────

function getFieldTemplate(sectionHeader: string): { key: string; value: string }[] {
  const h = sectionHeader.toLowerCase();
  if (h.includes("linkedin") && (h.includes("follow") || h.includes("account"))) {
    return [
      { key: "Why follow", value: "" },
      { key: "LinkedIn", value: "https://www.linkedin.com/in/" },
      { key: "Twitter", value: "" },
    ];
  }
  if (h.includes("twitter") || h.includes("x (")) {
    return [
      { key: "Why follow", value: "" },
      { key: "Twitter", value: "https://twitter.com/" },
    ];
  }
  if (h.includes("blog") || h.includes("publication")) {
    return [
      { key: "Cadence", value: "" },
      { key: "URL", value: "https://" },
      { key: "Why read", value: "" },
    ];
  }
  if (h.includes("newsletter")) {
    return [
      { key: "URL", value: "https://" },
      { key: "Why subscribe", value: "" },
    ];
  }
  if (h.includes("group")) {
    return [
      { key: "Members", value: "" },
      { key: "URL", value: "https://www.linkedin.com/groups/" },
      { key: "Why join", value: "" },
    ];
  }
  if (h.includes("regulatory") || h.includes("standards")) {
    return [
      { key: "URL", value: "https://" },
      { key: "What to watch", value: "" },
    ];
  }
  return [{ key: "URL", value: "https://" }, { key: "Notes", value: "" }];
}

// ── Save to API ────────────────────────────────────────────────────────────────

async function saveFile(
  filePath: string,
  domain: string,
  content: string,
  isSuperuser: boolean,
  pendingMeta?: { operation: "add" | "edit" | "delete"; section: string; entry: string }
): Promise<{ ok: boolean; applied: boolean }> {
  const res = await fetch("/api/admin/file", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: filePath, content, domain, pendingMeta }),
  });
  return res.json();
}

// ── Main component ─────────────────────────────────────────────────────────────

interface Props {
  domain: string;
  industryLabel: string;
  files: FileData[];
  isSuperuser: boolean;
}

export function DomainEditor({ domain, files, isSuperuser }: Props) {
  const [activeFile, setActiveFile] = useState(0);
  const [contents, setContents] = useState<(string | null)[]>(files.map((f) => f.content));
  const [rawMode, setRawMode] = useState(false);
  const [rawDraft, setRawDraft] = useState("");
  const [addForm, setAddForm] = useState<AddFormState | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const currentContent = contents[activeFile] ?? "";
  const currentFile = files[activeFile];

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  async function applyChange(
    newContent: string,
    operation: "add" | "edit" | "delete",
    section: string,
    entry: string
  ) {
    const newContents = [...contents];
    newContents[activeFile] = newContent;

    const result = await saveFile(currentFile.path, domain, newContent, isSuperuser, {
      operation,
      section,
      entry,
    });

    if (result.ok) {
      setContents(newContents);
      showToast(result.applied ? "✓ Saved" : "⏳ Submitted for approval");
    } else {
      showToast("Error saving — try again");
    }
  }

  async function saveRaw() {
    startTransition(async () => {
      const result = await saveFile(currentFile.path, domain, rawDraft, isSuperuser);
      if (result.ok) {
        const newContents = [...contents];
        newContents[activeFile] = rawDraft;
        setContents(newContents);
        setRawMode(false);
        showToast(result.applied ? "✓ Saved" : "⏳ Submitted for approval");
      } else {
        showToast("Error saving");
      }
    });
  }

  const sections = parseSections(currentContent);

  return (
    <div className="space-y-4">
      {/* File tab selector */}
      {files.length > 1 && (
        <div className="flex gap-2">
          {files.map((f, i) => (
            <button
              key={f.path}
              onClick={() => { setActiveFile(i); setRawMode(false); setAddForm(null); }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeFile === i
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* No file yet */}
      {!currentContent && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
          <p className="text-sm font-bold text-slate-700 mb-1">File not generated yet</p>
          <p className="text-xs text-slate-400">Run <code className="bg-slate-100 px-1.5 py-0.5 rounded">/omgstack resources {domain}</code></p>
        </div>
      )}

      {/* Raw mode editor */}
      {currentContent && rawMode && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
            <span className="text-xs font-bold text-slate-700">Raw Markdown Editor</span>
            <div className="flex gap-2">
              <button
                onClick={() => setRawMode(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveRaw}
                disabled={isPending}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
          <textarea
            className="w-full p-4 font-mono text-xs text-slate-700 bg-white resize-none outline-none"
            style={{ minHeight: "60vh" }}
            defaultValue={currentContent}
            onChange={(e) => setRawDraft(e.target.value)}
            spellCheck={false}
          />
        </div>
      )}

      {/* Structured section view */}
      {currentContent && !rawMode && (
        <div className="space-y-4">
          {sections.map((section) => (
            <SectionCard
              key={section.header}
              section={section}
              isSuperuser={isSuperuser}
              isAdding={addForm?.sectionHeader === section.header && addForm?.filePath === currentFile.path}
              onDeleteEntry={(title) => {
                const newContent = deleteEntryFromMarkdown(currentContent, title);
                applyChange(newContent, "delete", section.header, title);
              }}
              onDeleteBullet={(bullet) => {
                const newContent = deleteBulletFromMarkdown(currentContent, bullet);
                applyChange(newContent, "delete", section.header, bullet);
              }}
              onAddClick={() =>
                setAddForm({
                  sectionHeader: section.header,
                  filePath: currentFile.path,
                  title: "",
                  fields: getFieldTemplate(section.header),
                })
              }
              addForm={addForm?.sectionHeader === section.header && addForm?.filePath === currentFile.path ? addForm : null}
              onAddFormChange={(form) => setAddForm(form)}
              onAddSubmit={() => {
                if (!addForm) return;
                const isBullet = isBulletSection(section.body);
                let newContent: string;
                if (isBullet) {
                  const bulletText = addForm.fields[0]?.value ?? addForm.title;
                  newContent = addBulletToSection(currentContent, section.header, bulletText);
                } else {
                  const block = buildEntryBlock(addForm.title, addForm.fields);
                  newContent = insertEntryIntoSection(currentContent, section.header, block);
                }
                applyChange(newContent, "add", section.header, addForm.title);
                setAddForm(null);
              }}
              onAddCancel={() => setAddForm(null)}
            />
          ))}

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-2">
            {isSuperuser && (
              <button
                onClick={() => {
                  setRawDraft(currentContent);
                  setRawMode(true);
                  setAddForm(null);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-colors shadow-sm"
              >
                ✎ Raw edit
              </button>
            )}
            <span className="text-[11px] text-slate-400 font-mono ml-auto">{currentFile.path}</span>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-xl">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

// ── Section card ───────────────────────────────────────────────────────────────

interface SectionCardProps {
  section: Section;
  isSuperuser: boolean;
  isAdding: boolean;
  addForm: AddFormState | null;
  onDeleteEntry: (title: string) => void;
  onDeleteBullet: (bullet: string) => void;
  onAddClick: () => void;
  onAddFormChange: (form: AddFormState) => void;
  onAddSubmit: () => void;
  onAddCancel: () => void;
}

function SectionCard({
  section,
  isAdding,
  addForm,
  onDeleteEntry,
  onDeleteBullet,
  onAddClick,
  onAddFormChange,
  onAddSubmit,
  onAddCancel,
}: SectionCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const hasBullets = isBulletSection(section.body);
  const bullets = hasBullets ? parseBulletLines(section.body) : [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Section header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3 text-left"
      >
        <span className="text-sm font-black text-slate-800">{section.header}</span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
            {hasBullets ? bullets.length : section.entries.length}
          </span>
          <span className="text-slate-400 text-sm">{collapsed ? "›" : "⌄"}</span>
        </div>
      </button>

      {!collapsed && (
        <div className="divide-y divide-slate-50">
          {/* Bullet list mode (e.g. RSS Feeds section) */}
          {hasBullets && bullets.map((bullet, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700 leading-relaxed break-all">{bullet}</p>
              </div>
              <button
                onClick={() => { onDeleteEntry(bullet); onDeleteBullet(bullet); }}
                className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Delete"
              >
                🗑
              </button>
            </div>
          ))}

          {/* Structured entry mode (### blocks) */}
          {!hasBullets && section.entries.map((entry, i) => (
            <EntryRow key={i} entry={entry} onDelete={() => onDeleteEntry(entry.title)} />
          ))}

          {/* Empty state */}
          {!hasBullets && section.entries.length === 0 && !isAdding && (
            <div className="px-4 py-3 text-xs text-slate-400 italic">No entries yet</div>
          )}

          {/* Add form */}
          {isAdding && addForm && (
            <AddEntryForm
              form={addForm}
              section={section}
              isBullet={hasBullets}
              onChange={onAddFormChange}
              onSubmit={onAddSubmit}
              onCancel={onAddCancel}
            />
          )}

          {/* Add button */}
          {!isAdding && (
            <div className="px-4 py-3">
              <button
                onClick={onAddClick}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-xs font-bold text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                + Add entry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Entry row ──────────────────────────────────────────────────────────────────

function EntryRow({ entry, onDelete }: { entry: Entry; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);

  const fieldLines = entry.block
    .split("\n")
    .slice(1)
    .filter((l) => l.startsWith("**"))
    .map((l) => l.replace(/\*\*/g, "").trim());

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-2">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex-1 min-w-0 text-left"
        >
          <p className="text-xs font-bold text-slate-800 leading-tight">{entry.title}</p>
          {!expanded && fieldLines[0] && (
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{fieldLines[0]}</p>
          )}
        </button>
        <button
          onClick={onDelete}
          className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
          title="Delete"
        >
          🗑
        </button>
      </div>

      {expanded && (
        <div className="mt-2 rounded-xl bg-slate-50 p-3 space-y-1">
          {fieldLines.map((line, i) => (
            <p key={i} className="text-[11px] text-slate-600">{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Add entry form ─────────────────────────────────────────────────────────────

interface AddEntryFormProps {
  form: AddFormState;
  section: Section;
  isBullet: boolean;
  onChange: (form: AddFormState) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function AddEntryForm({ form, isBullet, onChange, onSubmit, onCancel }: AddEntryFormProps) {
  return (
    <div className="px-4 py-4 bg-indigo-50 border-t border-indigo-100">
      <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-3">
        New entry
      </p>

      {isBullet ? (
        // Bullet mode: just one line input
        <input
          type="text"
          placeholder="https://example.com/feed — Description"
          value={form.fields[0]?.value ?? ""}
          onChange={(e) =>
            onChange({ ...form, fields: [{ key: "line", value: e.target.value }] })
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      ) : (
        // Structured mode
        <div className="space-y-2.5">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-slate-500">Title / Name *</label>
            <input
              type="text"
              placeholder="e.g. Eric Topol | Founder, Scripps Research"
              value={form.title}
              onChange={(e) => onChange({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          {form.fields.map((field, i) => (
            <div key={i}>
              <label className="mb-1 block text-[11px] font-bold text-slate-500">{field.key}</label>
              {field.key.toLowerCase().includes("why") || field.key.toLowerCase().includes("notes") ? (
                <textarea
                  rows={2}
                  placeholder={field.key}
                  value={field.value}
                  onChange={(e) => {
                    const updated = [...form.fields];
                    updated[i] = { ...updated[i], value: e.target.value };
                    onChange({ ...form, fields: updated });
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none resize-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              ) : (
                <input
                  type="text"
                  placeholder={field.key}
                  value={field.value}
                  onChange={(e) => {
                    const updated = [...form.fields];
                    updated[i] = { ...updated[i], value: e.target.value };
                    onChange({ ...form, fields: updated });
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              )}
            </div>
          ))}

          {/* Add custom field */}
          <button
            onClick={() => onChange({ ...form, fields: [...form.fields, { key: "", value: "" }] })}
            className="text-xs text-indigo-500 hover:text-indigo-700 font-bold"
          >
            + Add field
          </button>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={!isBullet && !form.title.trim()}
          className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors shadow-sm shadow-indigo-200"
        >
          Add entry
        </button>
      </div>
    </div>
  );
}
