import { StyleSheet } from "react-native";
import COLORS from "../../colectionColor/colors"; // مسیر رو مطابق پروژه خودت تغییر بده

export const carFormStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  textInput: {
    flex: 3,
    backgroundColor: COLORS.background,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    borderColor: COLORS.textSecondary,
    padding: 10,
  },
  touchable: {
    flex: 1,
    backgroundColor: COLORS.inputBackground1,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  touchableText: {
    fontSize: 16,
  },

  container: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  row1: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
  touchable1: {
    alignItems: "center",
    width: "30%",
    marginVertical: 10,
  },
  underline: {
    height: 2,
    backgroundColor: COLORS.primary,
    width: 50,
    marginTop: 4,
  },
  label: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.textPrimary,
  },

menuButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  menuText: {
    marginLeft: 8,
    fontSize: 16,
    color: "black",
  },

});

