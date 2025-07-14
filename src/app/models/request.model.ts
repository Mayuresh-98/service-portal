export interface ServiceRequest {
  id: number;
  name: string;
  username: string;
  email: string;
  product: string;
  urgency: string;
  description: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved';
  assignedTo?: string; // technician name
}
