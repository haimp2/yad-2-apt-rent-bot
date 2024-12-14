import fetch from 'node-fetch';
import { CitySearchResponse } from './typings';
import { Location } from './typings';

class Yad2ApiService {
  async fetchCityOptions(text: string): Promise<(Location)[]> {
    const response = await fetch(`https://gw.yad2.co.il/address-autocomplete/realestate/v2?text=${text}`);
    const data = await response.json() as CitySearchResponse;
    const locations = [...data['areas'], ...data['cities'], ...data['hoods']]
      .map((location, index) => ({ ...location, id: index }));

    return locations;
  }
}

export default new Yad2ApiService();