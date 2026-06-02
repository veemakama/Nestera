# Storybook

Run component documentation locally:

```bash
npm run storybook
```

Build the static Storybook:

```bash
npm run build-storybook
```

The configuration lives in `.storybook/`. It includes:

- Next.js/Vite framework support.
- Accessibility checks through `@storybook/addon-a11y`.
- Docs/autodocs for usage examples.
- A `next-intl` decorator with English messages so translated components render in isolation.

Current priority coverage includes buttons, dashboard cards, goal forms, newsletter form, settings form, toast notifications, loading states, and error states.
