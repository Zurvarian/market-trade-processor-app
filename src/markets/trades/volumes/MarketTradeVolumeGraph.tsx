import { VictoryChart, VictoryLegend, VictoryLine, VictoryTheme } from 'victory';
import { useEffect, useState } from 'react';
import { streamMarketTradeVolumes } from './MarketTradeVolumeService';
import './MarketTradeVolumeGraph.css';

export interface MarketTradeVolumeGraphLines {
    axis: Array<{ periodPoint: string, volumeCount: number }>,
    name: string
}

export const MarketTradeVolumeGraph = () => {

    const lineColours = [
        "red", "green", "blue", "grey", "yellow", "black", "pink", "purple"
    ]

    const [marketTradeVolumes, setMarketTradeVolume] = useState<Array<MarketTradeVolumeGraphLines>>([]);

    useEffect(() => {
        return streamMarketTradeVolumes((newMarketTradeVolumes) => {
            const marketTradeVolumeGraphLines = Object.keys(newMarketTradeVolumes)
                .map(key => ({name: key, axis: newMarketTradeVolumes[key]}));
            setMarketTradeVolume(marketTradeVolumeGraphLines);
        });
    }, []);

    return <div className="market-trade-volume-graph-main-container">
        <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={{x: 20}}
            minDomain={{y: 0}}
            animate={{duration: 2000}}
            width={1000}
        >
            <VictoryLegend x={400} y={50}
                           title="Legend"
                           centerTitle
                           orientation="horizontal"
                           gutter={20}
                           style={{border: {stroke: "black"}, title: {fontSize: 20}}}
                           data={marketTradeVolumes.map((marketTradeVolumePerCurrency, index) => ({name: `${marketTradeVolumePerCurrency.name}`, symbol: {fill: `${lineColours[index]}`}}))}
            />
            {marketTradeVolumes.map((marketTradeVolumePerCurrency, index) =>
                <VictoryLine key={marketTradeVolumePerCurrency.name}
                             data={marketTradeVolumePerCurrency.axis}
                             x='periodPoint'
                             y='volumeCount'
                             interpolation="monotoneX"
                             style={{
                                 data: {
                                     stroke: `${lineColours[index]}`
                                 }
                             }}
                             animate={{
                                 animationWhitelist: ["style", "data", "size"], // Try removing "size"
                                 onExit: {
                                     duration: 500,
                                     before: () => ({opacity: 0.3, _y: 0})
                                 },
                                 onEnter: {
                                     duration: 500,
                                     before: () => ({opacity: 0.3, _y: 0})
                                 }
                             }}/>
            )}
        </VictoryChart>
    </div>
}
