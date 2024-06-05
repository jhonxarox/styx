export interface Person {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  date_of_death: string;
  age: string;
  returned_serviceman: boolean;
  is_featured: boolean | null;
  story: string | null;
  is_admin: boolean | null;
  life_chronicle: string | null;
}

export interface Properties {
  plot_id: string;
  status: string;
  section: string;
  row: string;
  plot_no: string;
  cemetery_id: number;
  price: number;
  persons: Person[];
  show_price: number;
  cemetery_name: string;
  roi: any[];
}

export interface Geometry {
  type: string;
  coordinates: number[][][];
}

export interface Feature {
  type: string;
  properties: Properties;
  geometry: Geometry;
}

export interface Plot {
  type: string;
  features: Feature[];
}
