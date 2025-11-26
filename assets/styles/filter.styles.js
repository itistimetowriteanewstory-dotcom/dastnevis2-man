import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // صفحه سفید
    justifyContent: "flex-start", // 👈 کارت میره بالا
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "89%", // عرض 80 درصد
    height: "45%", // ارتفاع 60 درصد
    backgroundColor: "#f7f7f7", // کمی تیره‌تر از سفید
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 140,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center", // بالا وسط
    marginBottom: 16,
  },
  scrollArea: {
    flex: 1,
  },
  optionBox: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

export default styles;