import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  contentSection: {
    height: "100%",
    width: "100%",
    flexDirection: "column",
  },
  loginSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    flex: 1,
    height: "100%",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  memberHeader: {
    height: 80,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#403f2b",
  },
  memberSection: {
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginTop: 30,
  },
  memberImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  membersOrders: {
    backgroundColor: "#fdfbef",
    borderWidth: 1,
    borderColor: "#403f2b",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  ordersShowMoreIcon: {
    position: "absolute",
    right: 0,
    top: -20,
    borderWidth: 1,
    borderColor: "#403f2b",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    height: 55,
    width: 55,
  },
  orderDetails: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  memberDetails: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 30,
  },
  memberDetailsTitle: {
    fontSize: 36,
    color: "#403f2b",
    fontFamily: "Fraunces-Regular",
  },
  memberDetailsSubTitle: {
    fontSize: 20,
    color: "#403f2b",
    marginTop: 10,
  },
  memberActionButton: {
    flex: 1,
    borderRadius: 0,
    ontFamily: "Fraunces-Regular",
  },
  accountInfo: {
    width: "100%",
    marginTop: 20,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  accountInfoTitle: {
    fontSize: 34,
    color: "#403f2b",
    marginTop: 20,
  },
  accountInfoSubtitle: {
    fontSize: 16,
    color: "#403f2b",
    marginVertical: 20,
  },
  accountInfoText: {
    fontSize: 16,
    color: "#403f2b",
  },
  accountInfoSmallText: {
    fontSize: 16,
    color: "#9e9d8c",
  },
  accountInputContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
    marginVertical: 20,
  },
  accountInput: {
    width: "100%",
    height: 40,
    backgroundColor: "#fdfbef",
    borderWidth: 1,
    borderColor: "#403f2b",
    borderRadius: 0,
    padding: 10,
    fontFamily: "Fraunces-Regular",
    fontSize: 16,
  },
});
