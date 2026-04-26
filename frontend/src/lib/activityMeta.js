export const ACTIVITY_META = {
  RUNNING: { label: "Running", emoji: "🏃", from: "#FF6B6B", to: "#FF8E53" },
  WALKING: { label: "Walking", emoji: "🚶", from: "#4ECDC4", to: "#44A08D" },
  CYCLING: { label: "Cycling", emoji: "🚴", from: "#A8E6CF", to: "#3DDC84" },
  SWIMMING: { label: "Swimming", emoji: "🏊", from: "#4FACFE", to: "#00F2FE" },
  WEIGHT_TRAINING: { label: "Weight Training", emoji: "🏋️", from: "#8E2DE2", to: "#4A00E0" },
  HIIT: { label: "HIIT", emoji: "🔥", from: "#F76B1C", to: "#FAD961" },
  CARDIO: { label: "Cardio", emoji: "❤️", from: "#FF416C", to: "#FF4B2B" },
  YOGA: { label: "Yoga", emoji: "🧘", from: "#F093FB", to: "#F5576C" },
  STRETCHING: { label: "Stretching", emoji: "🤸", from: "#FDCB6E", to: "#E17055" },
  OTHER: { label: "Other", emoji: "💪", from: "#667EEA", to: "#764BA2" },
};

export const ACTIVITY_TYPES = Object.keys(ACTIVITY_META);

export const getActivityMeta = (type) => ACTIVITY_META[type] || ACTIVITY_META.RUNNING;
