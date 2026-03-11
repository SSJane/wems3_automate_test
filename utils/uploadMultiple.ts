// utils/uploadToCase.ts
import type { Locator, Page } from '@playwright/test';

type FilePayload = {
  name: string;
  mimeType?: string;
  buffer: Buffer;
};

/**
 * Upload one or multiple files into the "Upload To Case" widget.
 * Works with: <input type="file">, "Click to browse" file chooser, or drag & drop.
 */
export async function uploadToCase(
  page: Page,
  files: string | string[] | FilePayload | FilePayload[],
  options: {
    /** Container that wraps the upload widget (safer when multiple uploaders exist). */
    scope?: Locator | string;
    /** Selector/locator for the hidden/visible file input (if the app exposes it). */
    input?: Locator | string;
    /** Locator for the "Click to browse" link (fallback if input is not reachable). */
    browseLink?: Locator | string;
    /** Locator for the visible dropzone (used for dnd fallback). */
    dropzone?: Locator | string;
    /** Max wait time for DOM operations (ms). */
    timeout?: number;
  } = {}
): Promise<void> {
  const timeout = options.timeout ?? 10_000;
  const list = Array.isArray(files) ? files : [files];

  // Resolve scope (default: page)
  const scope: Locator =
    typeof options.scope === 'string'
      ? page.locator(options.scope)
      : options.scope ?? page;

  // Default, robust locators derived from your screenshots / semantics
  const defaultDropzone = scope.getByText(/Drag & Drop files here/i).locator('..');
  const defaultBrowseLink = scope.getByRole('link', { name: /Click to browse/i });
  const defaultFileInput = scope.locator('input[type="file"]');

  const dropzone: Locator =
    typeof options.dropzone === 'string'
      ? scope.locator(options.dropzone)
      : options.dropzone ?? defaultDropzone;

  const browseLink: Locator =
    typeof options.browseLink === 'string'
      ? scope.locator(options.browseLink)
      : options.browseLink ?? defaultBrowseLink;

  const fileInput: Locator =
    typeof options.input === 'string'
      ? scope.locator(options.input)
      : options.input ?? defaultFileInput;

  // --- Strategy 1: Prefer direct <input type="file"> if present/attached ---
  if (await fileInput.first().count()) {
    await fileInput.first().waitFor({ state: 'attached', timeout });
    // setInputFiles works even if input is hidden
    await fileInput.first().setInputFiles(list);
    return;
  }

  // --- Strategy 2: Use "Click to browse" and native file chooser ---
  if (await browseLink.count()) {
    const [chooser] = await Promise.all([
      page.waitForEvent('filechooser', { timeout }),
      browseLink.click({ timeout }),
    ]);
    await chooser.setFiles(list);
    return;
  }

  // --- Strategy 3: Drag & Drop fallback ---
  await dropzone.scrollIntoViewIfNeeded();
  await simulateDragAndDropFiles(page, dropzone, list);
}

/**
 * Drag & drop helper. Creates a DataTransfer with File objects
 * and dispatches dragenter/dragover/drop on the dropzone.
 */
async function simulateDragAndDropFiles(
  page: Page,
  dropzone: Locator,
  files: (string | FilePayload)[]
) {
  // Resolve inputs to FilePayloads (browser side needs name/mimeType/buffer)
  const payloads: FilePayload[] = [];
  for (const f of files) {
    if (typeof f === 'string') {
      // Let Playwright read the file and create a payload
      const buf = await page.context().storageState(); // any call to keep TS happy; we'll replace below
    }
  }

  // Convert string paths to FilePayload (Node-side)
  const normalized: FilePayload[] = await Promise.all(
    files.map(async (f) => {
      if (typeof f !== 'string') return f;
      const path = require('path');
      const fs = require('fs');
      const abs = path.isAbsolute(f) ? f : path.resolve(process.cwd(), f);
      const buffer = await fs.promises.readFile(abs);
      return {
        name: path.basename(abs),
        mimeType: guessMime(path.extname(abs)),
        buffer,
      } as FilePayload;
    })
  );

  // Send payloads into the page and dispatch DnD events
  const dz = await dropzone.elementHandle();
  if (!dz) throw new Error('Dropzone not found for drag & drop');

  await dz.evaluate(async (el, filePayloads: FilePayload[]) => {
    const dt = new DataTransfer();

    const toFile = (p: FilePayload) =>
      new File([p.buffer as unknown as BlobPart], p.name, { type: p.mimeType || 'application/octet-stream' });

    filePayloads.forEach((p) => dt.items.add(toFile(p)));

    const fire = (type: string) =>
      el.dispatchEvent(new DragEvent(type, { dataTransfer: dt, bubbles: true, cancelable: true }));

    fire('dragenter');
    fire('dragover');
    fire('drop');
  }, normalized);
}

// Minimal mime guesser (good enough for tests)
function guessMime(ext: string): string {
  const e = ext.toLowerCase().replace('.', '');
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    pdf: 'application/pdf',
    txt: 'text/plain',
    csv: 'text/csv',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
  };
  return map[e] ?? 'application/octet-stream';
}