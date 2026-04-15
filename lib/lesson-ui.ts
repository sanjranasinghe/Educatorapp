export function formatLessonStatus(status: string) {
  const normalized = (status || "pending").toLowerCase();

  switch (normalized) {
    case "scheduled":
      return "Scheduled";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "no-show":
      return "No show";
    case "confirmed":
      return "Confirmed";
    default:
      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }
}

export function lessonStatusClasses(status: string) {
  const normalized = (status || "pending").toLowerCase();

  switch (normalized) {
    case "completed":
      return "bg-ocean/15 text-ocean";
    case "cancelled":
      return "bg-coral/15 text-coral";
    case "no-show":
      return "bg-amber-100 text-amber-800";
    case "confirmed":
      return "bg-sky-100 text-sky-900";
    case "scheduled":
      return "bg-mint text-ink";
    default:
      return "bg-ink/10 text-ink";
  }
}

function parseDate(value: string) {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function lessonPriority(status: string) {
  switch ((status || "pending").toLowerCase()) {
    case "scheduled":
    case "confirmed":
      return 0;
    case "pending":
      return 1;
    case "completed":
      return 2;
    case "cancelled":
      return 3;
    case "no-show":
      return 4;
    default:
      return 5;
  }
}

export function sortLessons<T extends { status: string; sortAt: string }>(lessons: T[]) {
  return [...lessons].sort((left, right) => {
    const leftPriority = lessonPriority(left.status);
    const rightPriority = lessonPriority(right.status);

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    const leftTime = parseDate(left.sortAt);
    const rightTime = parseDate(right.sortAt);

    if (leftPriority <= 1) {
      return leftTime - rightTime;
    }

    return rightTime - leftTime;
  });
}
