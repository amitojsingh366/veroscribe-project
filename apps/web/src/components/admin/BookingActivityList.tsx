import { Clock } from "lucide-react";

const activities = [
  { muted: false, text: "Request received from patient." },
  { muted: true, text: "Insurance verification pending." }
] as const;

export function BookingActivityList() {
  return (
    <div className="space-y-3 text-sm text-fg">
      {activities.map((activity) => (
        <p
          className={activity.muted ? "flex gap-2 text-fg-muted" : "flex gap-2"}
          key={activity.text}
        >
          <Clock
            className={activity.muted ? "mt-0.5" : "mt-0.5 text-status-pending-fg"}
            size={14}
          />
          {activity.text}
        </p>
      ))}
    </div>
  );
}
