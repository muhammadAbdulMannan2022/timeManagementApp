import { useState } from "react";
import { LayoutChangeEvent, View, } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const BarChartPage = () => {
    const [parentWidth, setParentWidth] = useState(0);

    const barData = [
        { value: 250, label: 'M', frontColor: '#177AD5' },
        { value: 500, label: 'T', frontColor: '#177AD5' },
        { value: 745, label: 'W', frontColor: '#177AD5' },
        { value: 320, label: 'T', frontColor: '#177AD5' },
        { value: 600, label: 'F', frontColor: '#177AD5' },
        { value: 256, label: 'S', frontColor: '#177AD5' },
        { value: 300, label: 'S', frontColor: '#177AD5' },
    ];

    return (
        <View
            className="flex-1 border"
            onLayout={(event: LayoutChangeEvent) => {
                setParentWidth(event.nativeEvent.layout.width);
            }}
        >
            {parentWidth > 0 && (
                <BarChart
                    width={parentWidth - 100} // now fully relative to parent
                    horizontal
                    barWidth={10}
                    barBorderRadius={4}
                    frontColor="lightgray"
                    data={barData}
                    yAxisThickness={0}
                    xAxisThickness={0}
                />
            )}
        </View>
    );
};

export default BarChartPage;
