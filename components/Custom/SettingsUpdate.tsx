import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconGrid from './Icons';

interface SettingsUpdateProps {
    setIsEditing: (data: boolean) => void;
    setIsEditingId: (data: any) => void;
    onIconPress: (icon: any) => void;
}

export default function SettingsUpdate({ setIsEditing, setIsEditingId, onIconPress }: SettingsUpdateProps) {
    const [text, setText] = useState('');
    const [time, setTime] = useState('');

    const handleTimeChange = (input: string) => {
        // allow only digits and colon
        const sanitized = input.replace(/[^0-9]/g, ''); // remove non-digits

        // insert ":" after every 2 digits, except at the end
        const formatted = sanitized.replace(/(\d{2})(?=\d)/g, '$1:');
        setTime(formatted);
    };

    return (
        <View className="p-5">
            <Text className="text-base font-medium mb-2">Enter text:</Text>
            <TextInput
                className="border border-gray-300 p-3 mb-5 rounded-lg"
                placeholder="Type something..."
                value={text}
                onChangeText={setText}
            />

            <Text className="text-base font-medium mb-2">Set timer (HH:MM:SS):</Text>
            <TextInput
                className="border border-gray-300 p-3 rounded-lg"
                placeholder="00:20:00"
                value={time}
                onChangeText={handleTimeChange}
                keyboardType="numeric"
                maxLength={8}
            />
            <IconGrid onIconPress={onIconPress} />
            <View className="flex-row justify-end mt-5 space-x-3 gap-2">
                <TouchableOpacity
                    className="bg-white w-1/2 border-2 border-[#00B8D4] px-6 py-2 rounded-lg"
                    onPress={() => {
                        setIsEditingId(null);
                        setIsEditing(false);
                    }}
                >
                    <Text className="text-base text-black text-center">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-[#00B8D4] w-1/2 px-6 py-2 rounded-lg"
                    onPress={() => {
                        setIsEditingId(null);
                        setIsEditing(false);
                    }}
                >
                    <Text className="text-base text-white text-center">Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}