import { mapMarketTradeVolumesToMarketTradeVolumesByName } from './MarketTradeVolumeService';

describe('Mapping of MarketTradeVolumes', () => {
    test('should work with valid data', () => {
        const marketTradeVolumesByName = mapMarketTradeVolumesToMarketTradeVolumesByName(
            [
                {currencyFrom: 'USD', currencyTo: 'EUR', periodPoint: '2021-01-01T00:00:00Z', volumeCount: 10},
                {currencyFrom: 'USD', currencyTo: 'EUR', periodPoint: '2021-01-02T00:00:00Z', volumeCount: 12},
                {currencyFrom: 'CAD', currencyTo: 'EUR', periodPoint: '2021-01-02T00:00:00Z', volumeCount: 5}
            ]
        );

        expect(marketTradeVolumesByName).toStrictEqual(
            {
                'USD@EUR': [
                    {periodPoint: '2021-01-01T00', volumeCount: 10}, {periodPoint: '2021-01-02T00', volumeCount: 12}
                ],
                'CAD@EUR': [{periodPoint: '2021-01-02T00', volumeCount: 5}]
            }
        )
    })
});
