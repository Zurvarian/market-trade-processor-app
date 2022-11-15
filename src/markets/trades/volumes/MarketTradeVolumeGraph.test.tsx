import renderer from 'react-test-renderer';
import React from 'react';
import { MarketTradeVolumeGraph, MarketTradeVolumeGraphLines } from './MarketTradeVolumeGraph';

describe("MarketTradeVolumeGraph", () => {
    test('renders without state', () => {
        const tree = renderer
            .create(<MarketTradeVolumeGraph/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('renders with some state', () => {
        const initialState: Array<MarketTradeVolumeGraphLines> = [{name: "TEST1@TEST2", axis: [{periodPoint: '2022-01-01T10', volumeCount: 10}]}];

        jest
            .spyOn(React, 'useState')
            .mockImplementationOnce(() => [initialState, () => null])

        const tree = renderer
            .create(<MarketTradeVolumeGraph/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
