# ADR-0009: Multimodal Data Handling

- Status: Pending
- Date: 2026-11-26
- Related paths: `lib/server/commerce/ai/voice/processor.ts`, `lib/server/commerce/ai/vision/processor.ts`, `lib/server/commerce/ai/multimodal/storage.ts`, `app/shop/[tenant]/assistant/page.tsx`, `components/commerce/adapters/MultimodalPromptAdapter.tsx`

## Context

How are voice recordings, images, and other multimodal inputs handled in the commerce plane? This determines storage, retention, PII handling, processing pipelines, and compliance.

| Data Type | Source | Processing | Storage | Retention | PII Risk |
|---|---|---|---|---|---|
| Voice (STT) | `SpeechInput` | Real-time streaming STT | Transcript only (encrypted) | 30 days | High — voice biometrics |
| Voice (TTS) | `AudioPlayer` | On-demand generation | Not stored | N/A | Low |
| Images (upload) | `PromptInput` attachments | Vision model analysis | Original + analysis (encrypted) | 90 days | Medium — receipts, products |
| Images (camera) | `PromptInputActionAddScreenshot` | OCR / classification | Analysis only | 30 days | Low |
| Screen capture | `PromptInputActionAddScreenshot` | Context extraction | Analysis only | Session only | Medium — checkout data |

## Decision

**Transcript-first, minimal retention, encrypted at rest.** Voice streams to STT provider; only transcript stored (encrypted). Images processed by vision model; original stored encrypted for 90 days (returns evidence), analysis stored for 30 days. Screen captures processed client-side where possible; only extracted context sent to server. All multimodal data scoped to `tenantId` + `territoryId` with RLS.

## Consequences

- `lib/server/commerce/ai/voice/processor.ts` streams audio to STT (Deepgram/Whisper), returns transcript only
- `lib/server/commerce/ai/vision/processor.ts` accepts image, returns structured analysis (product SKU, receipt data, damage assessment)
- `lib/server/commerce/ai/multimodal/storage.ts` manages encrypted blob storage with automatic expiration
- `MultimodalPromptAdapter` wraps `PromptInput` + `SpeechInput` + `Image` + `AudioPlayer` from ai-elements
- Voice commerce flow: `SpeechInput` → transcript → `PromptInput` → agent → `AudioPlayer` for TTS response
- Receipt OCR for returns: `Image` upload → vision → structured return request → `Return` model
- Compliance: GDPR/CCPA deletion requests purge all multimodal data; voice biometrics never stored
- Regional processing: EU franchisees use EU-hosted STT/vision models