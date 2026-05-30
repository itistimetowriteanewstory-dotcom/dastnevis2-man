import { StyleSheet } from 'react-native';
import COLORS from '../../colectionColor/colors';

const jobdetails = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 20,
  },

  leftSection: {
  flexDirection: 'row',        // عکس و نام کنار هم
  alignItems: 'center',
},

infoBox: {
  backgroundColor: COLORS.cardBackground,       // پس‌زمینه سفید (یا رنگ دلخواه)
  borderRadius: 12,              // گوشه‌های گرد
  padding: 12,                   // فاصله داخلی
  marginTop: 12,                  // فاصله از بالا
  borderWidth: 1,
  borderColor: COLORS.border,
   width: '110%',   // 👈 مثلا ۹۵٪ عرض والد
  alignSelf: 'center', // وسط‌چین بشه

   // رنگ بوردر هماهنگ با تم
},

userBox: {
  width: "100%",             
  height: 50,                 
  backgroundColor: COLORS.background,   
  borderRadius: 8,          
  flexDirection: "row",      
  alignItems: "center",      
  justifyContent: "flex-start",
  paddingHorizontal: 10,
  marginTop: 0,             
          

  marginBottom: 10,
},

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 1,
     marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  username: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  jobImage: {
    width: '100%',
    height: 220,
    
    marginBottom: 20,
    backgroundColor: COLORS.border,
  },

  mainImage: {
    width: '100%',
    height: 220,
    marginBottom: 20,
    backgroundColor: COLORS.border,
    contentFit: "contain",

  },


  fullImage: {
  width: '100%',   // یا '90%' برای فاصله از لبه‌ها
  height: '80%',   // بیشتر صفحه رو بگیره
  borderRadius: 0, // معمولاً بدون گوشه گرد
},

modalContainer: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.9)',
  justifyContent: 'center',
  alignItems: 'center',
},

 closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: "rgba(255, 254, 254, 1)",
    borderRadius: 8,
  },

  thumb: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },


  details: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  descriptionBox: {
  marginVertical: 8,
},


  sectionTitle: {
  fontSize: 18,
  fontWeight: '700',
  color: COLORS.textDark,
  marginTop: 10,
  marginBottom: 4,
},



  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  info: {
    fontSize: 17,
    color: COLORS.placeholderText,
    marginBottom: 6,
    lineHeight: 22,
    marginLeft: 8,
  },

   info1: {
    fontSize: 17,
    color: COLORS.textDark,
    marginBottom: 6,
    lineHeight: 22,
    marginRight: 12,
      flex: 1,          // مهم
  flexWrap: "wrap", // مهم
  textAlign: "right",
  },

  addressHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: -15,
  marginBottom: 8,
},

addressText: {
  fontSize: 16,
  lineHeight: 20,
  color: COLORS.textDark,
},

  caption: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginVertical: 14,
    lineHeight: 24,
  },

  saveButton: {
  backgroundColor: COLORS.bluee,
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
  borderColor: COLORS.border,  
  borderWidth: 1,
  width: 170, 
  height: 60,
  alignItems: "center",     // متن افقی وسط
  justifyContent: "center", // متن عمودی وسط
},

saveButton1: {
  backgroundColor: COLORS.redsalamom,
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
  borderColor: COLORS.border,  
  borderWidth: 1,
  width: 170, 
  height: 60,
  alignItems: "center",     // متن افقی وسط
  justifyContent: "center", // متن عمودی وسط
},

buttonRow: {
  flexDirection: "row",       // دکمه‌ها کنار هم
  justifyContent: "space-between", // فاصله بین‌شون
  paddingHorizontal: 0,
  marginTop: 40,
},



saveButtonText: {
  color: COLORS.white,
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: "center",


},

infoRow: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: "space-between",
  marginVertical: 4,
},

icon: {
  marginLeft: 10,
  

},

separator: {
  borderBottomWidth: 1,
  borderBottomColor: COLORS.border, // یا هر رنگ دلخواه
  marginTop: 0,
  marginBottom: 15,
},



  date: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'left',
  },
});

export default jobdetails;


