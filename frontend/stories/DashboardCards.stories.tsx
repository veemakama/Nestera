import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NetWorthCard from '../app/components/dashboard/NetWorthCard';
import GoalOverviewCard from '../app/components/dashboard/GoalOverviewCard';
import SavingsPoolCard from '../app/components/dashboard/SavingsPoolCard';
import ActivePoolCard from '../app/components/dashboard/ActivePoolCard';
import QuickActionsGrid from '../app/components/dashboard/QuickActionsGrid';

const meta = {
  title: 'Dashboard/Cards',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Reusable dashboard cards used for balances, savings goals, pool discovery, and active positions.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const NetWorth: StoryObj = {
  render: () => <NetWorthCard />,
};

export const GoalOverview: StoryObj<typeof GoalOverviewCard> = {
  render: (args) => <GoalOverviewCard {...args} />,
  args: {
    title: 'Emergency Fund',
    status: 'On Track',
    percentage: 52,
    savedAmount: 5200,
    targetAmount: 10000,
    monthlyContribution: 400,
    deadline: 'Sep 30, 2026',
  },
  argTypes: {
    status: { control: 'select', options: ['On Track', 'At Risk', 'Completed', 'Paused'] },
    percentage: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    savedAmount: { control: 'number' },
    targetAmount: { control: 'number' },
    monthlyContribution: { control: 'number' },
  },
};

export const SavingsPool: StoryObj<typeof SavingsPoolCard> = {
  render: (args) => <SavingsPoolCard {...args} />,
  args: {
    pool: {
      id: 'stable-yield',
      name: 'Stable Yield',
      strategy: 'Low-volatility Stellar savings strategy',
      apy: 8.4,
      tvl: '$1.8M',
      riskLevel: 'Low Risk',
    },
  },
};

export const ActivePool: StoryObj<typeof ActivePoolCard> = {
  render: (args) => <ActivePoolCard {...args} />,
  args: {
    pool: {
      id: 1,
      title: 'Stable Yield',
      subtitle: 'Auto-compounding pool',
      apy: 8.4,
      staked: '$4,200',
      earnings: '$126.40',
    },
  },
};

export const QuickActions: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <QuickActionsGrid />
    </div>
  ),
};
