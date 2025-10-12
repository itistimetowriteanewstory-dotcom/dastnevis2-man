
import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";

export default function HelpAndRulesScreen() {
  const reportEmail = "dastnevis.site@gmail.com";

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${reportEmail}?subject=گزارش تخلف`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.reportBox}>
        <Text style={styles.title}>📢 ثبت تخلف</Text>
        <Text style={styles.text}>
          اگر تخلفی مشاهده کردید، می‌توانید آن را از طریق ایمیل زیر با ما در میان بگذارید.
        </Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.email}>{reportEmail}</Text>
        </TouchableOpacity>
        <Text style={styles.text}>تخلفات شما در اسرع وقت پیگیری خواهد شد ✅</Text>
      </View>

       {/* بخش راهنما */}
      <View style={styles.section}>
        <Text style={styles.title}>📖 راهنمای استفاده از برنامه</Text>
        <Text style={styles.text}>۱. ابتدا وارد حساب کاربری خود شوید اگر حساب ندارید میتوانید ثبت نام کنید.</Text>
        <Text style={styles.text}>۲. از منوی اصلی می‌توانید به بخش‌های مختلف دسترسی داشته باشید.</Text>
        <Text style={styles.text}>۳. برای دریافت اعلان‌ها، اجازه دسترسی به نوتیفیکیشن را فعال کنید.</Text>
         <Text style={styles.text}>۳. برای ثبت شغل همه خانه های صفحه مربوطه را کامل کنیداز تصاویری که خلاف قانون اسلامی است خودداری کنید</Text>
      </View>

      {/* بخش قوانین */}
      <View style={styles.section}>
        <Text style={styles.title}>⚖️ قوانین برنامه</Text>
        <Text style={styles.text}>- رعایت احترام به سایر کاربران الزامی است.</Text>
        <Text style={styles.text}>- ارسال محتوای نامناسب یا خلاف با قوانین اسلامی ممنوع است و پیگیری قانونی دارد.</Text>
        <Text style={styles.text}>- هرگونه تخلف منجر به محدودیت دسترسی خواهد شد.</Text>
         <Text style={styles.text}>- هر شغلی که خلاف با قوانین اسلامی باشد در اسرع وقت از برنامه پاک خواهد شد و پیگرد قانونی دارد.</Text>
           <Text style={styles.text}>- در صورت ارسال تخلف بعد از بررسی های کارشناسان اگر تخلفی رخ نداده باشد کاربر با پیگرد قانونی رو به رو خواهد شد.</Text>
           
      </View>
      <View style={styles.shatter}>
         <Text style={styles.text}>- الهام گرفته از codesistency</Text>
      </View>

       <View style={styles.footer}>
        <Text style={styles.footerText}> طراحی و توسعه داده شده توسط </Text>
         <Text style={styles.footerText}>سید مهدی موسوی</Text>
          
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9e6ba", padding: 16 },
  reportBox: {
    backgroundColor: "#f9e6ba",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ecb22bf0",
  },
   footer: {
    marginTop: 30,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#ecb22bf0",
    alignItems: "center",
  },
  footerText: {
    fontSize: 17,
    color: "#555",
    fontStyle: "italic",
  },
   section: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  text: { fontSize: 14, marginBottom: 6, lineHeight: 20 },
  email: { fontSize: 16, color: "blue", textDecorationLine: "underline", marginTop: 8 },
  shatter: {
    marginBottom: -30,
  }
});

