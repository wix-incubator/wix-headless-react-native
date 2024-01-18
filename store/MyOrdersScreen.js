import { useQuery } from "@tanstack/react-query";
import { useWix } from "@wix/sdk-react";
import * as React from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useWixSession } from "../authentication/session";
import { format } from "date-fns";

export function MyOrdersScreen() {
  const wix = useWix();
  const { session } = useWixSession();

  const myOrdersQuery = useQuery(["my-orders", session], async () => {
    const res = await wix.fetch(`/stores/v2/orders/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {},
      }),
    });
    return res.json();
  });

  if (myOrdersQuery.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (myOrdersQuery.isError) {
    return <Text>Error: {myOrdersQuery.error.message}</Text>;
  }

  if (!myOrdersQuery.data.orders.length === 0) {
    return <Text>You have no orders</Text>;
  }

  return (
    <>
      <View
        style={{
          flexDirection: "column",
          height: "100%",
        }}
      >
        <ScrollView
          style={{ flexGrow: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="always"
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={myOrdersQuery.isFetching}
              onRefresh={myOrdersQuery.refetch}
            />
          }
        >
          {myOrdersQuery.data.orders.map((order) => {
            return (
              <View key={order.id}>
                <Text>
                  Date: {format(new Date(order.dateCreated), "MMM dd, yyyy")}
                </Text>
                <Text>Order #{order.number}</Text>
                <Text>
                  Status:{" "}
                  {
                    {
                      FULFILLED: "Fulfilled",
                      NOT_FULFILLED: "Not Fulfilled",
                      PARTIALLY_FULFILLED: "Partially Fulfilled",
                      CANCELLED: "Cancelled",
                    }[order.fulfillmentStatus]
                  }
                </Text>
                <Text>Payment Status: {order.paymentStatus}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
}
