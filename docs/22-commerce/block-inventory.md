# Commerce Plane Block Inventory

## shadcnstore Blocks (Vendored to `components/commerce/ui/*`)

Only ~8 blocks used in v1. The rest available for later phases.

| Block | File | Purpose | States | v1? |
|---|---|---|---|---|
| `storefront-hero-1` | `storefront-hero-1.tsx` | Hero section with CTA | default, loading, error | ✅ |
| `product-grid-1` | `product-grid-1.tsx` | Product listing with filters | default, loading, empty, error | ✅ |
| `product-detail-1` | `product-detail-1.tsx` | Product detail with variants | default, loading, error, out-of-stock | ✅ |
| `cart-drawer-1` | `cart-drawer-1.tsx` | Slide-over cart | open, closed, loading, empty | ✅ |
| `checkout-single-page-1` | `checkout-single-page-1.tsx` | Single-page checkout form | default, validating, submitting, error | ✅ |
| `checkout-confirmation-1` | `checkout-confirmation-1.tsx` | Order confirmation | default, loading | ✅ |
| `order-history-1` | `order-history-1.tsx` | Order list with filters | default, loading, empty | ✅ |
| `order-detail-1` | `order-detail-1.tsx` | Order detail with timeline | default, loading | ✅ |

### Reserved for Later Phases

| Block | Phase | Purpose |
|---|---|---|
| `product-card-*` | 2 | Product card variants |
| `category-nav-*` | 2 | Category navigation |
| `search-results-*` | 2 | Search results page |
| `wishlist-*` | 3 | Wishlist functionality |
| `reviews-*` | 3 | Product reviews |
| `recommendations-*` | 3 | AI recommendations |
| `subscription-*` | 4 | Subscription management |
| `gift-card-*` | 4 | Gift cards |
| `loyalty-*` | 4 | Loyalty program |
| `b2b-quote-*` | 5 | B2B quote workflow |
| `pos-*-*` | 5 | POS integration blocks |

## ai-elements Blocks (Used via `components/ai-elements/*`)

These are NOT vendored — they're imported directly as a library. Adapters wrap them.

### Agentic Workflows

| Component | File | Purpose | Commerce Use |
|---|---|---|---|
| `Agent` | `agent.tsx` | Agent container with header, content, tools | Concierge, fulfillment optimizer |
| `AgentHeader` | `agent.tsx` | Agent name + model badge | Show active agent |
| `AgentContent` | `agent.tsx` | Agent content area | Plan, reasoning, queue |
| `AgentTools` | `agent.tsx` | Accordion of available tools | Tool transparency |
| `AgentTool` | `agent.tsx` | Individual tool with schema | Debug tool inputs/outputs |
| `AgentOutput` | `agent.tsx` | Output schema display | Contract verification |
| `Plan` | `plan.tsx` | Collapsible execution plan | Agent plan visualization |
| `PlanHeader` | `plan.tsx` | Plan title + description + trigger | Plan summary |
| `PlanTitle` | `plan.tsx` | Streaming-aware title | Live plan updates |
| `PlanContent` | `plan.tsx` | Collapsible plan steps | Step-by-step execution |
| `Task` | `task.tsx` | Individual task item | Task list in plan |
| `TaskList` | `task.tsx` | List of tasks | Multi-step agent plans |
| `Queue` | `queue.tsx` | Agent queue visualization | Background agent status |

### Reasoning Transparency

| Component | File | Purpose | Commerce Use |
|---|---|---|---|
| `Reasoning` | `reasoning.tsx` | Auto-open/close collapsible reasoning | Pricing reasoning, agent CoT |
| `ReasoningTrigger` | `reasoning.tsx` | Trigger with duration/shimmer | "Thought for 3s" |
| `ReasoningContent` | `reasoning.tsx` | Streamdown-rendered content | Markdown + mermaid reasoning |
| `ChainOfThought` | `chain-of-thought.tsx` | Multi-step reasoning visualization | Pricing decision trail |
| `ChainOfThoughtStep` | `chain-of-thought.tsx` | Individual step with icon/status | Floor/ceiling/tax/royalty steps |
| `ChainOfThoughtSearchResults` | `chain-of-thought.tsx` | Search result badges | Cited sources |
| `ChainOfThoughtContent` | `chain-of-thought.tsx` | Collapsible content area | Expandable detail |
| `ChainOfThoughtImage` | `chain-of-thought.tsx` | Image in reasoning | Visual evidence |

### Multimodal Input

| Component | File | Purpose | Commerce Use |
|---|---|---|---|
| `PromptInput` | `prompt-input.tsx` | Composable prompt input form | Commerce assistant, voice commerce |
| `PromptInputTextarea` | `prompt-input.tsx` | Auto-growing textarea | Message input |
| `PromptInputHeader` | `prompt-input.tsx` | Attachment/menu area | File upload, screenshot, voice |
| `PromptInputFooter` | `prompt-input.tsx` | Tools area | SpeechInput, camera |
| `PromptInputTools` | `prompt-input.tsx` | Tool buttons | Voice, image, file |
| `PromptInputSubmit` | `prompt-input.tsx` | Submit/stop button | Streaming-aware |
| `PromptInputActionMenu` | `prompt-input.tsx` | Dropdown for attachments | Add file, screenshot |
| `PromptInputActionAddAttachments` | `prompt-input.tsx` | File picker trigger | Receipt upload, product photo |
| `PromptInputActionAddScreenshot` | `prompt-input.tsx` | Screen capture | Checkout assistance |
| `SpeechInput` | `speech-input.tsx` | Real-time STT streaming | Voice commerce |
| `VoiceSelector` | `voice-selector.tsx` | TTS voice picker | Audio response preferences |
| `Transcription` | `transcription.tsx` | Live transcript display | Voice commerce feedback |

### Generative UI

| Component | File | Purpose | Commerce Use |
|---|---|---|---|
| `Artifact` | `artifact.tsx` | Container for generated content | Product configurator output |
| `ArtifactHeader` | `artifact.tsx` | Title + actions | Download, share, version |
| `ArtifactContent` | `artifact.tsx` | Content area | Live preview, code, canvas |
| `Canvas` | `canvas.tsx` | React Flow wrapper | Visual product config graph |
| `WebPreview` | `web-preview.tsx` | Iframe preview with console | Live checkout/product preview |
| `JSXPreview` | `jsx-preview.tsx` | Live React component preview | Generated variant preview |
| `Sandbox` | `sandbox.tsx` | Code sandbox | Developer integrations |

### Real-time Streaming

| Component | File | Purpose | Commerce Use |
|---|---|---|---|
| `Message` | `message.tsx` | Chat message container | Assistant conversation |
| `MessageContent` | `message.tsx` | Message bubble | User/assistant styling |
| `MessageResponse` | `message.tsx` | Streamdown response | Streaming assistant output |
| `Conversation` | `conversation.tsx` | Auto-scroll message list | Assistant chat history |
| `ConversationContent` | `conversation.tsx` | Message container | Gap/padding |
| `MessageBranch` | `message.tsx` | Git-like branching | Collaborative cart editing |
| `MessageBranchSelector` | `message.tsx` | Branch navigator | Switch cart versions |

### Citations & Sources

| Component | File | Purpose | Commerce Use |
|---|---|---|---|
| `Sources` | `sources.tsx` | Collapsible sources list | Tax citations, agreement clauses |
| `SourcesTrigger` | `sources.tsx` | "Used N sources" trigger | Citation count |
| `SourcesContent` | `sources.tsx` | Source list | Clickable references |
| `Source` | `sources.tsx` | Individual source link | Franchise agreement, tax reg |
| `InlineCitation` | `inline-citation.tsx` | In-text citation marker | Pricing breakdown footnotes |

### Developer Experience

| Component | File | Purpose | Commerce Use |
|---|---|---|---|
| `Terminal` | `terminal.tsx` | Terminal emulator | Webhook debugger |
| `CodeBlock` | `code-block.tsx` | Syntax-highlighted code | Schema, reasoning, tool I/O |
| `SchemaDisplay` | `schema-display.tsx` | JSON Schema viewer | Event contract explorer |
| `TestResults` | `test-results.tsx` | Test suite results | Integration test runner |
| `StackTrace` | `stack-trace.tsx` | Error stack trace | Error debugging |
| `Snippet` | `snippet.tsx` | Copyable code snippet | API examples |

### UI Primitives

| Component | File | Purpose | Commerce Use |
|---|---|---|---|
| `Shimmer` | `shimmer.tsx` | Loading skeleton | Streaming states |
| `Image` | `image.tsx` | Optimized image | Product images, receipts |
| `AudioPlayer` | `audio-player.tsx` | Audio playback | TTS responses |
| `FileTree` | `file-tree.tsx` | File explorer | Project files in sandbox |
| `Persona` | `persona.tsx` | User persona badge | Role indicator |
| `ModelSelector` | `model-selector.tsx` | Model picker | Franchisee model choice |
| `Confirmation` | `confirmation.tsx` | Confirmation dialog | L1 agent approval |
| `Context` | `context.tsx` | Context provider | AI context propagation |
| `Connection` | `connection.tsx` | Connection status | SSE/WebSocket status |

## Adapter Layer (`components/commerce/adapters/*`)

Each adapter wraps a vendored block or ai-elements component for commerce context.

| Adapter | Wraps | Injects |
|---|---|---|
| `ProductGridAdapter` | `product-grid-1` | tenant, territory, pricing, `onAddToCart` |
| `ProductDetailAdapter` | `product-detail-1` | tenant, territory, variants, inventory |
| `CartAdapter` | `cart-drawer-1` | cart state, `clientOpId`, territory pricing |
| `CheckoutAdapter` | `checkout-single-page-1` | validated prices, payment routing, idempotency |
| `OrderHistoryAdapter` | `order-history-1` | franchise-scoped orders, territory filter |
| `ReviewsAdapter` | `reviews-1` | tenant-scoped reviews |
| **`AIConciergeAdapter`** | **`Agent`, `Plan`, `TaskList`, `Queue`, `Reasoning`, `ChainOfThought`** | **tenant, territory, agent registry, tool permissions** |
| **`MultimodalPromptAdapter`** | **`PromptInput`, `SpeechInput`, `Image`, `AudioPlayer`, `Message`, `Conversation`** | **tenant, territory, voice config, vision tools** |
| **`GenerativeConfiguratorAdapter`** | **`Artifact`, `Canvas`, `WebPreview`, `JSXPreview`** | **product schema, territory constraints, pricing** |
| **`ReasoningDisplayAdapter`** | **`Reasoning`, `ChainOfThought`, `Sources`, `InlineCitation`** | **pricing trace, tax citations, agreement refs** |
| **`ModelSelectorAdapter`** | **`ModelSelector`** | **approved model catalog, territory assignment** |
| **`PromptTemplateEditorAdapter`** | **`PromptInput`, `CodeBlock`, `SchemaDisplay`** | **template inheritance, safety validation** |

## Guard Layer (`components/commerce/guards/*`)

| Guard | Purpose | Blocks Rendering |
|---|---|---|
| `PriceGuardBoundary` | Hide products violating floor/ceiling | `ProductGridAdapter`, `ProductDetailAdapter` |
| `TenantGuardBoundary` | Render 404 if tenant mismatch | All shop pages |
| **`AIPolicyGuardBoundary`** | **Enforce model access, autonomy level, data residency** | **All AI-composed components** |
| **`ReasoningGuardBoundary`** | **Require reasoning trace for pricing/refund decisions** | **Checkout, returns, agent actions** |

## AI Composed Layer (`components/commerce/ai/*`)

Pre-composed patterns combining adapters + ai-elements + guards.

| Component | Composes | Purpose |
|---|---|---|
| `CommerceAssistant` | `MultimodalPromptAdapter` + `ReasoningDisplayAdapter` | Full multimodal commerce assistant page |
| `AgenticConcierge` | `AIConciergeAdapter` + `AIPolicyGuardBoundary` | Autonomous order concierge |
| `GenerativeConfigurator` | `GenerativeConfiguratorAdapter` + `AIPolicyGuardBoundary` | Visual product configuration |
| `ExplainablePricing` | `ReasoningDisplayAdapter` + `ReasoningGuardBoundary` | Pricing audit trail |
| `CollaborativeCart` | `MessageBranch` + `CartAdapter` | Multi-user cart editing |
| `AIAgentMonitor` | `Agent`, `Queue`, `TaskList`, `Reasoning` | Franchisee agent dashboard |
| `WebhookDebugger` | `Terminal`, `SchemaDisplay`, `TestResults` | Developer integrations page |
| `PromptTemplateManager` | `PromptTemplateEditorAdapter`, `SchemaDisplay` | Franchisor/franchisee prompt governance |