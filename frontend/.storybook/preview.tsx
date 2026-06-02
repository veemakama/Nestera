import type { Preview } from '@storybook/nextjs-vite'
import { NextIntlClientProvider } from 'next-intl';
import '../app/globals.css';
import en from '../app/locales/en.json';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={en}>
        <div className="min-h-screen bg-[#041c1e] p-6 text-white">
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
};

export default preview;
