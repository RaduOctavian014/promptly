# Promptly

Prompt builder in the browser: pick components from a sidebar, copy the result as text, in Romanian or English.

Four tabs:

- **System prompt**: role, mode, tone, format, emoji, behavior, limits.
- **Prompt**: role, context, input, task, examples, constraints, output format, success criteria, delivery.
- **Diagrams**: prompts for business visuals (flowcharts, matrices, charts, slides) for ChatGPT, with editable deliverables (.pptx, Mermaid, SVG).
- **Anti-hallucination**: phrases that reduce made-up answers, selectable or copyable one by one.

## Run

No build step. Serve the folder with any static server:

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173.
