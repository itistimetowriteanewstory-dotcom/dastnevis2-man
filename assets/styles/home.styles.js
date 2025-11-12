
import { StyleSheet } from "react-native";
import COLORS from "../../colectionColor/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    writingDirection: 'rtl', // برای iOS
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, 
  },
  header: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 24,
    letterSpacing: 0.5,
    color: COLORS.primary,
    marginBottom: 8,
  },
  
  jobCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
 
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
 
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 5,
  },
  jobContent: {
    flexDirection: "row-reverse",   // چینش افقی
    alignItems: "flex-start",
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  jobImageContainer: {
    width: 130,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: COLORS.border, 
    marginTop: 5,
  },
  jobImage: {
    width: "100%",
    height: "100%",
  },
  jobDetails: {
    flex: 1,
    justifyContent: "flex-start",
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },

  caption: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 8,
    lineHeight: 20,
    writingDirection: 'rtl',
  },
  date: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  footerLoader: {
    marginVertical: 20,
  },

  propertyCard: {
  backgroundColor: "#faeccdff",
  borderRadius: 10,
  marginBottom: 12,
  overflow: "hidden", // باعث میشه گوشه‌های گرد روی عکس هم اعمال بشه
  borderWidth: 1,
  borderColor: "#e2d6c1",
 
},

propertyImage: {
  width: 110,   // 👈 به اندازه عرض کارت
  height: 110,     // ارتفاع ثابت (می‌تونی تغییر بدی)
  resizeMode: "cover",
  borderRadius: 19, 
  alignSelf: "center",

},

propertyContent: {
  padding: 10,
   flex: 1,  
    marginTop: -10, 
},

propertyTitle: {
  fontSize: 17,
  fontWeight: "bold",
  marginBottom: 6,
  color: "#333",
},

propertyInfo: {
  fontSize: 15,
  color: "#555",
  marginBottom: 4,
},

propertyDate: {
  fontSize: 12,
  color: "#999",
  marginTop: 6,
},

 button: {
    backgroundColor: COLORS.primary,   // رنگ پس‌زمینه
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',          // رنگ بوردر
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
     

  },
  buttonText: {
    color: 'white',                // رنگ متن
    fontSize: 18,                 // سایز متن
    fontWeight: 'bold',
    marginRight: 20,

  },
  headerRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
   width: "100%",   

  

},
propertyRow: {
  flexDirection: "row",       // 👈 بچه‌ها کنار هم
  alignItems: "flex-start",   // 👈 متن از بالا شروع بشه
  padding: 10,
},



});

export default styles;

