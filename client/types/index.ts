export interface TaskProps {
  id: string;
  name: string;
  completed: boolean;
  deleteTask: (id: string) => void;
}
