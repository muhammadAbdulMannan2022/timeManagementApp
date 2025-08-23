import { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { CurveType, LineChart } from "react-native-gifted-charts";

const LineChartPage = () => {
    const [parentWidth, setParentWidth] = useState(0);

    const lineData = [
        { value: 0, label: 'Mon' },
        { value: 20, label: 'Tue' },
        { value: 18, label: 'Wed' },
        { value: 40, label: 'Thu' },
        { value: 36, label: 'Fri' },
        { value: 60, label: 'Sat' },
        { value: 54, label: 'Sun' },
    ];

    return (
        <View
            className="border"
            style={{ flex: 1, padding: 16 }}
            onLayout={(event: LayoutChangeEvent) => {
                setParentWidth(event.nativeEvent.layout.width);
            }}
        >
            {parentWidth > 0 && (
                <LineChart
                    width={parentWidth - 50}
                    data={lineData}
                    spacing={parentWidth / (lineData.length + 1)}
                    curveType={CurveType.CUBIC}
                    thickness={4}
                    color="#0BA5A4"
                    hideYAxisText={false}
                    hideDataPoints
                    yAxisColor="transparent"
                    xAxisColor="transparent"
                    verticalLinesColor="transparent"
                    showVerticalLines={false}
                    endSpacing={0}
                    adjustToWidth
                />
            )}
        </View>
    );
};

export default LineChartPage;
