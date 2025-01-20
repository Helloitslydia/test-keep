export interface Project {
  id: string;
  name: string;
  progress: number;
  status: 'online' | 'offline';
  logo: string;
}