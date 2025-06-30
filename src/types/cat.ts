export interface Cat {
  id: string;
  name: string;
  age: string; // e.g., "2 anni", "5 mesi"
  breed: string;
  imageUrl: string;
  location: string; // City or region
  description: string;
  caretakerName: string; // Name of the user or association
  needs?: string[]; // Special needs, e.g., "Dieta speciale", "Casa senza bambini piccoli"
  personality?: string[]; // e.g., "Giocherellone", "Timido", "Affettuoso"
  // Add other relevant fields as needed
  // e.g., gender, size, healthStatus, vaccinationStatus, sterilizationStatus
}
