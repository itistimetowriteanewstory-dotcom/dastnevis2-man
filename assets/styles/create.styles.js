
import { StyleSheet } from "react-native";
import COLORS from "../../colectionColor/colors";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  scrollViewStyle: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
     writingDirection: 'rtl'
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  form: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
     textAlign: 'right',
  writingDirection: 'rtl',
  },
  
   helperText: {
    fontSize: 12,
    color: COLORS.placeholderText, // یا مثلاً 'gray'
    marginTop: 4,
  },


  
  halfBox: {
  width: '48%',        // نصف صفحه با کمی فاصله
  padding: 12,
  minHeight: 50,    
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: 8,
  marginBottom: 10,
  backgroundColor: COLORS.inputBackground,
},

  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    color: COLORS.textDark,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  textArea: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    height: 100,
    color: COLORS.textDark,
  },

    imagePickerBox: {
    width: "30%",             // عرض هر باکس
    height: 100,            // ارتفاع هر باکس
    borderWidth: 1,         // خط دور باکس
    borderColor: COLORS.border || "#ccc",
    borderRadius: 8,        // گوشه‌های گرد
    margin: 5,              // فاصله بین باکس‌ها
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background || "#f9f9f9",
  },

  previewImage: {
   width: "100%",          
    height: "100%",
   resizeMode: "contain",    
  },


  starButton: {
    padding: 8,
  },
  imagePicker: {
    width: "100%",
    height: 200,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  button: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    borderColor: COLORS.border,  
    borderWidth: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 8,
    color: COLORS.textDark,
  },


});

export default styles;