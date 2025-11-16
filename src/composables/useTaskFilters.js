import { computed } from "vue";
import { FILTERS } from "./consts";

export function useTaskFilters(tasks) {

  const apply = (filter) => {
    const now = new Date();
    switch (filter) {
      case "active":
        return tasks.value.filter((t) => !t.completed);
      case "completed":
        return tasks.value.filter((t) => t.completed);
      case "today":
        return tasks.value.filter(
          (t) => t.date.toDateString() === now.toDateString()
        );
      case "future":
        return tasks.value.filter((t) => t.date > now && !t.completed);
      case "late":
        return tasks.value.filter((t) => t.date < now && !t.completed);
      default:
        return tasks.value;
    }
  };

  return { apply };
}
