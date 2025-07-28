export interface Link {
  id: number;
  title: string;
  description: string;
  url: string;
  image: string;
  position: number;
  list_id: number;
  group_id: number | null;
  created_at: string;
}