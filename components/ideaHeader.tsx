// FilterHeader.tsx
import React, { FC } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { icons } from "../constants";

const ideaHeader: FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.filterRow}>

                <Text style={styles.title}>Favorite</Text>
                <TouchableOpacity style={styles.button}>
                    <Image style={styles.icon} source={icons.idea} />
                    <View style={styles.textColumn}>
                        <Text style={styles.filterText}>Selected Idea</Text>
                        <Text style={styles.subText}>flower shop</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "fixed",
        marginBottom: 10,
        backgroundColor: "white",
        paddingTop: 45,
        paddingBottom: 5,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    filterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flex: 0.5,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingRight: 35,
        borderRadius: 8,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
        marginRight: 4,
    },
    textColumn: {
        flexDirection: "column",
        alignItems: "flex-start",
    },
    filterText: {
        fontSize: 14,
        color: "#333",
    },
    subText: {
        fontSize: 12,
        color: "grey",
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: "bold",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 20,
        paddingTop: 10,
    }
});

export default ideaHeader;

