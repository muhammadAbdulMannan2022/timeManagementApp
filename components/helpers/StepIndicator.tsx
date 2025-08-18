import React from 'react';
import { View } from 'react-native';
import StepIndicator from 'react-native-step-indicator';

interface StepIndicatorProps {
    totalSteps: number;
    currentStep: number;
    stepColors?: string[]; // colors for active steps
    inactiveColor?: string; // border color for inactive steps
    lineColor?: string;
}

const DynamicStepIndicator: React.FC<StepIndicatorProps> = ({
    totalSteps,
    currentStep,
    stepColors = [],
    inactiveColor = '#ff0000',
    lineColor = "#ff0000"
}) => {
    const customStyles = {
        stepIndicatorSize: 16, // small circle
        currentStepIndicatorSize: 20, // current step slightly bigger
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 0,
        stepStrokeWidth: 0,
        separatorFinishedColor: lineColor,
        separatorUnFinishedColor: inactiveColor,
    };

    const renderStepIndicator = ({ position }: { position: number }) => {
        const color = stepColors[position] || inactiveColor;
        const isActive = position < currentStep;

        return (
            <View
                style={{
                    width: position === currentStep - 1 ? 20 : 16,
                    height: position === currentStep - 1 ? 20 : 16,
                    borderRadius: 10,
                    backgroundColor: isActive ? color : 'transparent', // only active has fill
                    borderWidth: isActive ? 0 : 2, // border for inactive
                    borderColor: isActive ? 'transparent' : color, // use the step color as border
                }}
            />
        );
    };

    return (
        <View>
            <StepIndicator
                customStyles={customStyles}
                currentPosition={currentStep - 1}
                stepCount={totalSteps}
                renderStepIndicator={renderStepIndicator}
                labels={[]} // hide labels
            />
        </View>
    );
};

export default DynamicStepIndicator;
