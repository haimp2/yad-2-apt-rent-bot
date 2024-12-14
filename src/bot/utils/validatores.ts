export const validateCityName = (cityName = '') => {
    const isNameInHebrew = cityName.match(/^[\u0590-\u05FF\s]+$/);
    const nameIsTooNotLong = cityName.length < 25;
    const nameIsNotEmpty = cityName.trim().length > 0;

    if (!isNameInHebrew) {
        throw new Error('שם העיר חייב להיות בעברית בלבד')
    } else if (!nameIsNotEmpty) {
        throw new Error('שם העיר לא יכול להיות ריק')
    } else if (!nameIsTooNotLong) {
        throw new Error('שם העיר ארוך מדי - עד 25 תווים בלבד')
    }
};

export const validatePrice = (price: number, minPrice?: number) => {
    const MAX_PRICE = 20000;
    const priceIsPositive = price > 0;
    const priceIsHigherThanMinPrice = minPrice !== undefined ? price >= minPrice : true;
    const priceIsNotTooHigh = price <= MAX_PRICE;

    if (!priceIsPositive) {
        throw new Error('מחיר חייב להיות חיובי');
    } else if (!priceIsHigherThanMinPrice) {
        throw new Error('מחיר חייב להיות גבוה מהמחיר המינימלי');
    } else if (!priceIsNotTooHigh) {
        throw new Error('מחיר גבוה מדי - המחיר המקסימלי הוא 20,000');
    }

}

export const validateRooms = (rooms: number) => {
    const roomsIsPositive = rooms > 0;
    const roomsIsNotTooHigh = rooms <= 10;
    const isInStepsOfHalf = rooms % 0.5 === 0;

    if (!roomsIsPositive) {
        throw new Error('מספר חדרים חייב להיות חיובי');
    } else if (!roomsIsNotTooHigh) {
        throw new Error('מספר חדרים גבוה מדי - המספר המקסימלי הוא 10');
    } else if (!isInStepsOfHalf) {
        throw new Error('מספר חדרים חייב להיות בצעדים של 0.5');
    }
}

export const validateSizeInMeter = (sizeInMeter: number, minSizeInMeter?: number) => {
    const sizeIsPositive = sizeInMeter > 0;
    const sizeIsNotTooHigh = sizeInMeter <= 1000;
    const sizeIsHigherThanMinSize = minSizeInMeter !== undefined ? sizeInMeter >= minSizeInMeter : true;

    if (!sizeIsPositive) {
        throw new Error('שטח חייב להיות חיובי');
    } else if (!sizeIsNotTooHigh) {
        throw new Error('שטח גבוה מדי - השטח המקסימלי הוא 1000 מ"ר');
    } else if (!sizeIsHigherThanMinSize) {
        throw new Error('שטח חייב להיות גבוה מהשטח המינימלי');
    }
}