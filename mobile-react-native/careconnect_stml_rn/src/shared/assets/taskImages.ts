export const TASK_IMAGES = {
  medication: require("../../../assets/images/tasks/medication.png"),
  meal: require("../../../assets/images/tasks/meal.png"),
  exercise: require("../../../assets/images/tasks/exercise.png"),
  water: require("../../../assets/images/tasks/water.png"),
} as const;

export type TaskImageKey = keyof typeof TASK_IMAGES

//Add this for testing (important)
export default TASK_IMAGES;