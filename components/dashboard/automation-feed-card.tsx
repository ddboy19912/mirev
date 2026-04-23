import { Eyebrow } from "@/components/dashboard/ui/eyebrow";
import { SectionCard } from "@/components/dashboard/ui/section-card";
import {
  formatExecutionCopy,
  formatExecutionTimestamp,
} from "@/lib/strategies/feed";
import type { StrategyExecutionLog } from "@/lib/strategies/types";

type AutomationFeedCardProps = {
  executions: StrategyExecutionLog[];
};

export function AutomationFeedCard({ executions }: AutomationFeedCardProps) {
  return (
    <SectionCard>
      <Eyebrow>Automation Feed</Eyebrow>
      <div className="mt-5 space-y-3">
        {executions.length > 0 ? (
          executions.map((execution) => (
            <div key={execution.id} className="rounded-2xl bg-gray-50 p-4">
              <Eyebrow>{formatExecutionTimestamp(execution.createdAt)}</Eyebrow>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {formatExecutionCopy(execution)}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-400">
              No Kamino actions prepared yet. Sign in and make a live Kamino
              action to populate this feed.
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
