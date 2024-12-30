import fetch from 'node-fetch';
import { CitySearchResponse, Yad2ApiResponse, Yad2FeedItem } from './typings';
import { Location } from './typings';
import { UserSubscriptionData } from '../../database/models/subscription';

export class Yad2ApiService {
  async fetchCityOptions(text: string): Promise<(Location)[]> {
    const response = await fetch(`https://gw.yad2.co.il/address-autocomplete/realestate/v2?text=${text}`);
    const data = await response.json() as CitySearchResponse;
    const locations = [...data['areas'], ...data['cities'], ...data['hoods']]
      .map((location, index) => ({ ...location, id: index }));

    return locations;
  }

  async fetchPosts(subscription: UserSubscriptionData): Promise<Yad2FeedItem[]> {

    const {
      location,
      minPrice,
      maxPrice,
      minRooms,
      maxRooms,
      minSizeInMeter,
      maxSizeInMeter
    } = subscription;

    const {
      areaId,
      cityId,
      hoodId
    } = location;

    const baseUrl = 'https://gw.yad2.co.il/feed-search-legacy/realestate/rent';
    let queryParameters = {
      Order: 1,
      area: areaId,
      city: cityId,
      neighborhood: hoodId,
      price: `${minPrice}-${maxPrice}`,
      rooms: `${minRooms}-${maxRooms}`,
      ...(minSizeInMeter ? { size: `${minSizeInMeter}-${maxSizeInMeter}` } : {})
    } as any;

    // omit undefined values
    Object.keys(queryParameters).forEach(key => {
      if (!queryParameters[key]) {
        delete queryParameters[key];
      }
    });

    queryParameters = new URLSearchParams(queryParameters).toString();

    const url = `${baseUrl}?${queryParameters}`;

    const response = await fetch(url);

    const data: Yad2ApiResponse = await response.json();
    return data?.data?.feed?.feed_items || [];
  }
}

export default new Yad2ApiService();