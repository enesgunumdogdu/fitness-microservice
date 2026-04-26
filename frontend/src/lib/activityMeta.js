export const ACTIVITY_META = {
  RUNNING: { emoji: "🏃", from: "#FF6B6B", to: "#FF8E53" },
  WALKING: { emoji: "🚶", from: "#4ECDC4", to: "#44A08D" },
  CYCLING: { emoji: "🚴", from: "#A8E6CF", to: "#3DDC84" },
};

export const getActivityMeta = (type) => ACTIVITY_META[type] || ACTIVITY_META.RUNNING;
