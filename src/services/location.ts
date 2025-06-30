/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  latitude: number;
  /**
   * The longitude of the location.
   */
  longitude: number;
}

/**
 * Asynchronously retrieves location information for a given address.
 *
 * @param address The address for which to retrieve location data.
 * @returns A promise that resolves to a Location object containing latitude and longitude.
 */
export async function getLocation(address: string): Promise<Location> {
  // TODO: Implement this by calling an API.

  return {
    latitude: 45.4642,
    longitude: 9.1900
  };
}
