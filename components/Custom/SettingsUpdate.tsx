import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconGrid from './Icons';

export default function SettingsUpdate({ setIsEditing, setIsEditingId, onIconPress }: { setIsEditing: (data: boolean) => void, setIsEditingId: (data: any) => void, onIconPress: (icon: any) => void }) {
    const [text, setText] = useState('');
    const [time, setTime] = useState('00:00:00');

    const handleTimeChange = (input: string) => {
        // allow only digits and colon
        const sanitized = input.replace(/[^0-9]/g, ''); // remove non-digits

        // insert ":" after every 2 digits, except at the end
        const formatted = sanitized.replace(/(\d{2})(?=\d)/g, '$1:');
        setTime(formatted);
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Enter text:</Text>
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 5,
                }}
                placeholder="Type something..."
                value={text}
                onChangeText={setText}
            />

            <Text>Set timer (HH:MM:SS):</Text>
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    borderRadius: 5,
                }}
                placeholder="00:20:00"
                value={time}
                onChangeText={handleTimeChange}
                keyboardType="numeric"
                maxLength={8}
            />
            <IconGrid onIconPress={onIconPress} />
            <View>
                <TouchableOpacity onPress={() => {
                    setIsEditingId(null)
                    setIsEditing(false)
                }}>
                    <Text>save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
