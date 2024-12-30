export interface Location {
    id?: number;
    fullTitleText: string;
    cityId?: string;
    hoodId?: string;
    areaId: string;
}

export interface CitySearchResponse {
    areas: Location[];
    cities: Location[];
    hoods: Location[];
    streets: any[];
    topAreas: any[];
}

// Main Response Types
export interface Yad2ApiResponse {
    data: Yad2ApiData;
    message: string;
}

export interface Yad2ApiData {
    feed: Yad2Feed;
    title: string;
    filters: Yad2Filter[];
    pagination: Yad2Pagination;
    catTitle: string;
    left_column: boolean;
    address: Yad2Address;
}

// Feed Types
export interface Yad2Feed {
    cat_id: number;
    subcat_id: number;
    title_text: string;
    sort_values: Yad2SortValue[];
    feed_items: Yad2FeedItem[];
    current_page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
}

// Feed Item Type
export interface Yad2FeedItem {
    line_1: string;
    line_2: string;
    line_3: string;
    row_1: string;
    row_2: string;
    row_3: string[];
    row_4: Yad2ItemAttribute[];
    images: Record<string, Yad2Image>;
    images_count: number;
    img_url: string;
    images_urls: string[];
    coordinates: {
        latitude: number;
        longitude: number;
    };
    price: string;
    id: string;
    merchant: boolean;
    merchant_name: string | null;
    square_meters: number;
    rooms: number;
    Rooms_text: string;
    neighborhood: string;
    city: string;
    street?: string;
    date_added: string;
    updated_at: string;
}

// Supporting Types
export interface Yad2ItemAttribute {
    key: string;
    label: string;
    value: number | string;
}

export interface Yad2Image {
    src: string;
}

export interface Yad2Filter {
    title: string;
    value: number;
    selected: number;
}

export interface Yad2Pagination {
    current_page: number;
    items_in_current_page: number;
    last_page: number;
    max_items_per_page: number;
    total_items: number;
}

export interface Yad2Address {
    topArea: Yad2AddressLevel;
    area: Yad2AddressLevel;
    city: Yad2AddressLevel;
    neighborhood: Yad2AddressLevel;
    street: Yad2AddressLevel;
}

export interface Yad2AddressLevel {
    level: string;
    id: number | string | null;
    name: string | null;
}

export interface Yad2SortValue {
    title: string;
    value: number;
    selected: number;
}