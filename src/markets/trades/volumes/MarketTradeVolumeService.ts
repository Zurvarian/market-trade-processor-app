import { EventSourcePolyfill } from 'event-source-polyfill';

export interface MarketTradeVolume {
    currencyFrom: string,
    currencyTo: string,
    periodPoint: string,
    volumeCount: number
}

export interface MarketTradeVolumesByName {
    [key: string]: Array<{ periodPoint: string, volumeCount: number }>
}

export const mapMarketTradeVolumesToMarketTradeVolumesByName = (data: Array<MarketTradeVolume>) => {
    return data.reduce((group: MarketTradeVolumesByName, marketTradeVolume) => {
        const {currencyFrom, currencyTo} = marketTradeVolume;
        const key = `${currencyFrom}@${currencyTo}`;
        group[key] = group[key] ?? [];
        group[key].push({
            periodPoint: marketTradeVolume.periodPoint.substring(0, 13),
            volumeCount: marketTradeVolume.volumeCount
        });
        return group;
    }, {}) as MarketTradeVolumesByName;
}

export const streamMarketTradeVolumes = (callback: (marketTradesVolumesByName: MarketTradeVolumesByName) => void) => {
    const eventSource = new EventSourcePolyfill(`http://localhost:8080/trades/volumes?dateTimeRangeInHours=${24 * 7}`,
        {
            headers: {
                Authorization: 'Basic YWRtaW46dGVzdA=='
            },
            withCredentials: true
        });
    eventSource.onmessage = (event) => {
        const newMarketTradeVolumes: MarketTradeVolumesByName =
            mapMarketTradeVolumesToMarketTradeVolumesByName((JSON.parse(event.data) as Array<MarketTradeVolume>));
        callback(newMarketTradeVolumes);
    }
    return () => {
        eventSource.close();
    };
}
