import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { currentCart } from "@wix/ecom";
import { useWixSessionModules } from "../authentication/session";
import {
  ActivityIndicator,
  List,
  IconButton,
  Button,
  Surface,
  TouchableRipple,
} from "react-native-paper";
import { Text, ScrollView, View, RefreshControl } from "react-native";
import { WixMediaImage } from "../WixMediaImage";
import NumericInput from "react-native-numeric-input";
import { usePrice } from "./price";
import { redirects } from "@wix/redirects";
import { useWixModules } from "@wix/sdk-react";
import * as Linking from "expo-linking";

export function CartScreen({ navigation }) {
  const { getCurrentCart, createCheckoutFromCurrentCart } =
    useWixModules(currentCart);
  const { createRedirectSession } = useWixSessionModules(redirects);
  const currentCartQuery = useQuery(["currentCart"], getCurrentCart);

  const checkoutMutation = useMutation(
    async () => {
      const currentCheckout = await createCheckoutFromCurrentCart({
        channelType: currentCart.ChannelType.OTHER_PLATFORM,
      });

      const { redirectSession } = await createRedirectSession({
        ecomCheckout: { checkoutId: currentCheckout.checkoutId },
        callbacks: {
          thankYouPageUrl: Linking.createURL("/checkout/thank-you"),
        },
      });

      return redirectSession;
    },
    {
      onSuccess: (redirectSession) => {
        navigation.navigate("Checkout", { redirectSession });
      },
    }
  );

  if (currentCartQuery.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (currentCartQuery.isError) {
    return <Text>Error: {currentCartQuery.error.message}</Text>;
  }

  const subTotal = usePrice({
    amount: currentCartQuery.data.lineItems.reduce((acc, item) => {
      return acc + Number.parseFloat(item.price?.amount) * item.quantity;
    }, 0),
    currencyCode: currentCartQuery.data.currency,
  });

  return (
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
            refreshing={currentCartQuery.isFetching}
            onRefresh={currentCartQuery.refetch}
          />
        }
      >
        {currentCartQuery.data.lineItems.length === 0 ? (
          <View
            style={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Your cart is empty</Text>
            <Button
              onPress={() => navigation.navigate("Products")}
              mode="contained"
              style={{ marginTop: 10 }}
            >
              Go to products
            </Button>
          </View>
        ) : (
          currentCartQuery.data.lineItems.map((item) => (
            <CartItem
              currency={currentCartQuery.data.currency}
              key={item._id}
              item={item}
            />
          ))
        )}
      </ScrollView>

      {currentCartQuery.data.lineItems.length > 0 && (
        <Surface
          mode="elevated"
          style={{
            margin: 10,
            borderRadius: 10,
          }}
        >
          <TouchableRipple
            style={{ borderRadius: 10 }}
            onPress={() => checkoutMutation.mutateAsync()}
          >
            <View
              style={{
                flexDirection: "row",
                padding: 10,
              }}
            >
              <View style={{ flexGrow: 1 }}>
                <Text>Go to checkout</Text>
              </View>
              <Text>{subTotal}</Text>
            </View>
          </TouchableRipple>
        </Surface>
      )}
    </View>
  );
}

function CartItem({ item, currency }) {
  const queryClient = useQueryClient();
  const { updateCurrentCartLineItemQuantity, removeLineItemsFromCurrentCart } =
    useWixSessionModules(currentCart);

  const updateQuantityMutation = useMutation(
    async (quantity) => {
      return updateCurrentCartLineItemQuantity([
        {
          _id: item._id,
          quantity,
        },
      ]);
    },
    {
      onSuccess: (response) => {
        queryClient.setQueryData(["currentCart"], response.cart);
      },
    }
  );

  const removeMutation = useMutation(
    async () => {
      return removeLineItemsFromCurrentCart([item._id]);
    },
    {
      onSuccess: (response) => {
        queryClient.setQueryData(["currentCart"], response.cart);
      },
    }
  );

  return (
    <List.Item
      title={item.productName.translated}
      description={usePrice({
        amount: Number.parseFloat(item.price?.amount) * item.quantity,
        currencyCode: currency,
      })}
      left={(props) => (
        <WixMediaImage media={item.image}>
          {({ url }) => (
            <List.Image style={props.style} source={{ uri: url }} />
          )}
        </WixMediaImage>
      )}
      right={() => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {(updateQuantityMutation.isLoading || removeMutation.isLoading) && (
            <ActivityIndicator />
          )}
          <NumericInput
            value={item.quantity}
            totalWidth={80}
            editable={!updateQuantityMutation.isLoading}
            onChange={(quantity) =>
              updateQuantityMutation.mutateAsync(quantity)
            }
            minValue={1}
          />
          <IconButton
            icon="delete"
            onPress={() => removeMutation.mutateAsync()}
          />
        </View>
      )}
    />
  );
}
