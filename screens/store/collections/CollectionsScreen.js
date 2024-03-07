import { useWixModules } from "@wix/sdk-react";
import { collections } from "@wix/stores";
import { useQuery } from "@tanstack/react-query";
import { CollectionsGrid } from "../../../components/Grid/CollectionsGrid";
import { SimpleContainer } from "../../../components/Container/SimpleContainer";
import { LoadingIndicator } from "../../../components/LoadingIndicator/LoadingIndicator";
import { ErrorView } from "../../../components/ErrorView/ErrorView";
import Routes from "../../../routes/routes";

export const CollectionsScreen = ({ navigation }) => {
  const { queryCollections } = useWixModules(collections);
  const collectionsResponse = useQuery(["collections"], () =>
    queryCollections().find(),
  );
  if (collectionsResponse.isLoading) {
    return (
      <SimpleContainer
        navigation={navigation}
        title={"Collections"}
        backIcon={false}
      >
        <LoadingIndicator />
      </SimpleContainer>
    );
  }

  if (collectionsResponse.isError) {
    return <ErrorView message={collectionsResponse.error.message} />;
  }

  const collectionPressHandler = (items) => {
    navigation.navigate(Routes.Products, { items });
  };

  return (
    <SimpleContainer
      navigation={navigation}
      title={"Collections"}
      backIcon={false}
    >
      <CollectionsGrid
        data={collectionsResponse.data._items}
        onPress={collectionPressHandler}
      />
    </SimpleContainer>
  );
};
