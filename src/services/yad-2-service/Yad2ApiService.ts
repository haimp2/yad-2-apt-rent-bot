import fetch from 'node-fetch';
import { CitySearchResponse, Yad2ApiResponse, Yad2FeedItem } from './typings';
import { Location } from './typings';
import { UserSubscriptionData } from '../../database/models/subscription';

export class Yad2ApiService {

  private readonly HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9,he;q=0.8',
    'Referer': 'https://www.yad2.co.il/realestate/rent',
    'Origin': 'https://www.yad2.co.il',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };


  async fetchCityOptions(text: string): Promise<(Location)[]> {
    const response = await fetch(`https://gw.yad2.co.il/address-autocomplete/realestate/v2?text=${text}`, { headers: this.HEADERS });
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

    const response = await fetch(url, { headers: this.HEADERS });

    const data: Yad2ApiResponse = await response.json();
    return data?.data?.feed?.feed_items || [];
  }
}

export default new Yad2ApiService();