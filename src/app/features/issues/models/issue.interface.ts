export interface IssueInterface {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  assignedTo: string;
  createdAt: Date;
  dueDate: Date;
  resolvedAt?: Date;
}
