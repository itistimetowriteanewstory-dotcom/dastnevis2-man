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
    borderRadius: 14,
    marginBottom: 20,
    backgroundColor: COLORS.border,
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
    fontSize: 20,
    color: COLORS.textDark,
    marginBottom: 6,
    lineHeight: 22,
  },

  caption: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginVertical: 14,
    lineHeight: 24,
  },

  saveButton: {
  backgroundColor: COLORS.primary,
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
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
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},

icon: {
  marginRight: 6,
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


