
import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import COLORS from '../colectionColor/colors';

export default function HelpAndRulesScreen() {
  const reportEmail = "dastnevis.site@gmail.com";

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${reportEmail}?subject=گزارش تخلف`);
  };

  return (
    <ScrollView style={styles.container}
    contentContainerStyle={{ paddingBottom: 40 }}
    showsVerticalScrollIndicator={false}
    >
      <View style={styles.reportBox}>
        <Text style={styles.title}>📢 ثبت تخلف</Text>
        <Text style={styles.text}>
          اگر تخلفی مشاهده کردید، می‌توانید آن را از طریق ایمیل زیر با ما در میان بگذارید.
        </Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.email}>{reportEmail}</Text>
        </TouchableOpacity>
        <Text style={styles.text}>گزارش های ارسالی شما بررسی و در صورت نیاز پیگیری خواهند شد✅</Text>
      </View>

  
       {/* بخش راهنما */}
      <Text style={styles.title}>📖 راهنمای استفاده از برنامه</Text>
      <View style={styles.reportBox}>
        <Text style={styles.text}>
      ۱. ابتدا وارد حساب کاربری خود شوید اگر حساب ندارید میتوانید ثبت نام کنید.
      ۲. از منوی اصلی می‌توانید به بخش‌های مختلف دسترسی داشته باشید.
      ۳. برای دریافت اعلان‌ها، اجازه دسترسی به نوتیفیکیشن را فعال کنید.
      ۳. برای ثبت شغل همه خانه های صفحه مربوطه را کامل کنیداز تصاویری که خلاف قانون اسلامی است خودداری کنید
      </Text>
      </View>

       {/*بخش نکات ایمینی */}
       <Text style={styles.title}> نکات ایمنی (مهم)</Text>
      <View style={styles.reportBox}>
        <Text style={styles.text}>
    این برنامه صرفاً بستری برای انتشار آگهی 
    و برقراری ارتباط اولیه میان کاربران از طریق اطلاعات تماس ارائه‌شده توسط آگهی‌دهنده است. این برنامه هیچ‌گونه سیستم پرداخت، انتقال 
    وجه یا پیام‌رسان داخلی ندارد و در مذاکرات، توافقات، پرداخت‌ها، استخدام‌ها یا معاملات انجام‌شده بین کاربران دخالتی نمی‌کند.

پیش از هرگونه خرید، فروش یا مراجعه برای فرصت شغلی:
• از اصالت آگهی و هویت طرف مقابل اطمینان حاصل کنید.
• پیش از مراجعه، با آگهی‌دهنده تماس بگیرید و جزئیات را بررسی کنید.
• از مراجعه به آدرس‌های نامشخص، دورافتاده یا مشکوک خودداری کنید.
• تا قبل از بررسی و دریافت کالا، هیچ مبلغی پرداخت نکنید.
• برای فرصت‌های شغلی، هویت کارفرما و محل فعالیت را بررسی کنید.

در صورت مشاهده آگهی مشکوک، رفتار غیرعادی یا احتمال کلاهبرداری، از طریق ایمیل پشتیبانی
 موجود در برنامه موضوع را گزارش دهید تا بررسی و در صورت لزوم اقدامات لازم انجام شود.

مسئولیت بررسی اصالت آگهی، هویت طرف مقابل و تصمیم‌گیری برای انجام هرگونه معامله یا همکاری بر عهده کاربران است. 
این برنامه نسبت به وجوه پرداخت‌شده، خسارات مالی یا توافقات خارج از کنترل خود مسئولیتی ندارد.
      </Text>
      </View>
  
      {/* بخش قوانین */}
     <Text style={styles.title}>⚖️ قوانین برنامه</Text>
      <View style={styles.reportBox}>
        <Text style={styles.text}>- رعایت احترام به سایر کاربران الزامی است.</Text>
        <Text style={styles.text}>- ارسال محتوای نامناسب یا خلاف با قوانین اسلامی ممنوع است و پیگیری قانونی دارد.</Text>
        <Text style={styles.text}>- هرگونه تخلف منجر به محدودیت دسترسی خواهد شد.</Text>
         <Text style={styles.text}>- هر شغلی که خلاف با قوانین اسلامی باشد در اسرع وقت از برنامه پاک خواهد شد و پیگرد قانونی دارد.</Text>
           <Text style={styles.text}>- ارسال گزارش های عمدی کذب، مزاحمت یا سو استفاده از سیستم گزارش دهی میتواند موجب محدودیت حساب کاربری و در موارد لازم پیگیری قانونی شود</Text>
           
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
  container: { flex: 1, backgroundColor: COLORS.background , padding: 16 },
  reportBox: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
   footer: {
    marginTop: 30,
    marginBottom: 50,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.textDark,
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

