import type { Meta, StoryObj } from '@storybook/nextjs-vite';

function Toast({
  tone = 'success',
  title = 'Preferences saved',
  message = 'Your notification settings were updated.',
}: {
  tone?: 'success' | 'error' | 'info';
  title?: string;
  message?: string;
}) {
  const toneClass = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    error: 'border-red-500/30 bg-red-500/10 text-red-200',
    info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
  }[tone];

  return (
    <div role="status" className={`max-w-sm rounded-lg border p-4 shadow-xl ${toneClass}`}>
      <p className="m-0 text-sm font-bold">{title}</p>
      <p className="m-0 mt-1 text-sm opacity-80">{message}</p>
    </div>
  );
}

function LoadingState({ label = 'Loading dashboard' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      <span className="text-sm font-semibold text-white">{label}</span>
    </div>
  );
}

function ErrorBoundaryState({ message = 'Something went wrong.' }: { message?: string }) {
  return (
    <div role="alert" className="max-w-md rounded-lg border border-red-500/30 bg-red-500/10 p-5 text-red-100">
      <p className="m-0 text-sm font-bold">Unable to load this section</p>
      <p className="m-0 mt-1 text-sm opacity-80">{message}</p>
    </div>
  );
}

const meta = {
  title: 'Feedback/States',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['success', 'error', 'info'] },
  },
} satisfies Meta;

export default meta;

export const ToastNotification: StoryObj<typeof Toast> = {
  render: (args) => <Toast {...args} />,
  args: {
    tone: 'success',
    title: 'Goal created',
    message: 'Your new savings goal is ready.',
  },
};

export const Loading: StoryObj<typeof LoadingState> = {
  render: (args) => <LoadingState {...args} />,
  args: {
    label: 'Loading dashboard',
  },
};

export const ErrorState: StoryObj<typeof ErrorBoundaryState> = {
  render: (args) => <ErrorBoundaryState {...args} />,
  args: {
    message: 'Try refreshing or contact support if the problem continues.',
  },
};
