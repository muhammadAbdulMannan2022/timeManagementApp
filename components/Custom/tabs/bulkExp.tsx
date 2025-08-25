import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Image, Switch, Text, TouchableOpacity, View } from "react-native";

// Define TypeScript interfaces for type safety
interface Client {
    id: number;
    client: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: string;
    photos: number;
    image: string | null;
}

// Define the mock data with TypeScript type
const mockData: Client[] = [
    {
        id: 72,
        client: "Client 72",
        date: "2025/07/15",
        startTime: "01:42",
        endTime: "01:42",
        duration: "0:03",
        photos: 1,
        image: "https://i.ibb.co.com/bMQvpbMN/images.jpg",
    },
    {
        id: 71,
        client: "Client 71",
        date: "2025/07/15",
        startTime: "01:42",
        endTime: "01:42",
        duration: "0:03",
        photos: 0,
        image: null,
    },
];

const ClientList: React.FC = () => {
    const [data, setData] = useState<Client[]>(mockData);
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const toggleSort = (): void => {
        const sorted = [...data].sort((a: Client, b: Client) => {
            if (sortAsc) return new Date(b.date).getTime() - new Date(a.date).getTime();
            else return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setData(sorted);
        setSortAsc(!sortAsc);
    };

    const toggleSelectAll = (value: boolean): void => {
        setSelectAll(value);
        if (value) setSelectedItems(data.map((item: Client) => item.id));
        else setSelectedItems([]);
    };

    const toggleSelectItem = (id: number): void => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((i: number) => i !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const renderItem = ({ item }: { item: Client }) => (
        <View className="flex-row items-center bg-white p-3 rounded-xl mb-2 shadow-sm">
            <TouchableOpacity
                onPress={() => toggleSelectItem(item.id)}
                className="mr-3"
            >
                <View
                    className={`w-6 h-6  rounded ${selectedItems.includes(item.id) ? "" : "border border-gray-300"
                        }`}
                >
                    {selectedItems.includes(item.id) && <FontAwesome name="check-square-o" size={24} color="#00B8D4AB" />}
                </View>
            </TouchableOpacity>
            <View className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-3 items-center justify-center">
                {item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <FontAwesome name="camera" size={24} color="#aaa" />
                )}
            </View>
            <View className="flex-1">
                <Text className="text-black font-semibold text-lg">{item.client}</Text>
                <Text className="text-gray-500">{item.date}</Text>
                <Text className="text-gray-400 text-sm">
                    {item.startTime} - {item.endTime} . {item.duration} .{" "}
                    {item.photos ? `${item.photos} Photos` : "No Photos"}
                </Text>
            </View>
            {item.photos > 0 && (
                <View className="bg-blue-100 px-2 py-1 rounded-full ml-2">
                    <Text className="text-blue-500 text-sm flex-row items-center">
                        <FontAwesome name="camera" size={12} color="#00B8D4" /> {item.photos}
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <View className="flex-1 ">
            {/* Sort & Select */}
            <View className="flex-row items-center justify-between mb-4 bg-white p-3 rounded-xl shadow-sm">
                <View className="flex-row items-center gap-3">
                    <Text className="text-gray-600 font-medium">Sort</Text>
                    <TouchableOpacity onPress={toggleSort}>
                        <Text className="text-blue-500 font-medium flex-row items-center">
                            {sortAsc ? (
                                <Ionicons name="arrow-down" size={16} color="#00B8D4" />
                            ) : (
                                <Ionicons name="arrow-up" size={16} color="#00B8D4" />
                            )}{" "}
                            {sortAsc ? "Latest" : "Oldest"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center gap-2">
                    <Text className="text-gray-600 font-medium">Select All</Text>
                    <Switch
                        value={selectAll}
                        onValueChange={toggleSelectAll}
                        trackColor={{ false: "#ccc", true: "#00B8D4" }}
                        thumbColor="white"
                    />
                </View>
            </View>

            {/* Client List */}
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item: Client) => item.id.toString()}
            />
        </View>
    );
};

export default ClientList;