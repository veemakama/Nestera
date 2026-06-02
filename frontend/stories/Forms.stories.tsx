import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Newsletter from '../app/components/Newsletter';
import GoalForm from '../app/savings/create-goal/components/GoalForm';
import CreateGoalForm from '../app/savings/create-goal/components/CreateGoalForm';
import SettingsClient from '../app/dashboard/settings/SettingsClient';

const meta = {
  title: 'Forms/Validated',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Validated React Hook Form examples with Zod schemas, translated messages, loading states, and ARIA error announcements.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const NewsletterSubscription: StoryObj = {
  render: () => <Newsletter />,
};

export const CompactGoalForm: StoryObj = {
  render: () => <GoalForm />,
};

export const CreateGoal: StoryObj = {
  render: () => <CreateGoalForm />,
};

export const SettingsNotifications: StoryObj = {
  render: () => (
    <div className="max-w-3xl mx-auto">
      <SettingsClient />
    </div>
  ),
};
