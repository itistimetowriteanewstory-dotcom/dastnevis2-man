import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, } from 'react-native';
import styles from "../../assets/styles/login.styles";
import { useState } from 'react';
import COLORS from '../../colectionColor/colors';
import {Ionicons} from "@expo/vector-icons";
import {useAuthStore} from "../../store/authStore";
import { Link } from "expo-router";

import { I18nManager } from 'react-native';
import { registerForPushNotificationsAsync } from "../../lib/notification";


I18nManager.allowRTL(true);
I18nManager.forceRTL(true);



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 const {isLoading, login} = useAuthStore();





  const handleLogin = async () => {
    
   const result = await login(email, password);
 
   if (!result.success) {
     
   Alert.alert("Error", result.error);
   return;
   } 

    if (result.token) {
    await registerForPushNotificationsAsync(result.token);
    console.log("✅ registerForPushNotificationsAsync called");
  }else {
    console.warn("⚠️ No token returned from login");
  }
  };
  


  return (
  <KeyboardAvoidingView
  style={{flex:1}}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <View style={styles.container}>
      { /* illustration */}
      <View style={styles.topIllustration}>
       <Image source={require("../../assets/images/myimage.png")}
       style={styles.illustrationImage}
       resizeMode='contain'
       />
        </View>
        <View style={styles.card}>
         <View style={styles.formContainer}>
{ /* email */}
 <View style={styles.inputGroup}>
  <Text style={styles.label}>ایمیل</Text>
  <View style={styles.inputContainer}>
    <Ionicons 
    name="mail-outline"
    size={20}
    color={COLORS.primary}
    style={styles.inputIcon}
    />
    <TextInput
    style={styles.input}
    placeholder='ایمیل خود را بنویسید'
    placeholderTextColor={COLORS.placeholderText}
    value={email}
    onChangeText={setEmail}
    keyboardType='email-address'
    autoCapitalize='none'
    />
  </View>
 </View>

 { /* passsword */}
 <View style={styles.inputGroup} >
  <Text style={styles.label}>رمز عبور</Text>
  <View style={styles.inputContainer}>
    { /* left icon */}
    <Ionicons 
    name='lock-closed-outline'
    size={20}
    color={COLORS.primary}
    style={styles.inputIcon}
    />
    {/* input */}
    <TextInput 
    style={styles.input}
    placeholder='رمز عبور خودرا بنویسید'
    placeholderTextColor={COLORS.placeholderText}
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
    />

    <TouchableOpacity onPress={()=> setShowPassword (!showPassword)}
      style={styles.eyeIcon}>
      <Ionicons 
      name={showPassword ? "eye-outline" : "eye-off-outline"}
      size={20}
      color={COLORS.primary}
      />
    </TouchableOpacity>
  </View>
 </View>

 <TouchableOpacity style={styles.button} onPress={handleLogin}
 disabled={isLoading}>
{isLoading ? (
  <ActivityIndicator color="#fff" />

 ) : (
  <Text style={styles.buttonText}>وارد شدن</Text>
 )}
 </TouchableOpacity>

 { /* footer */}
 <View style={styles.footer}>
  <Text  style={styles.footerText} >اگر حساب کاربری ندارید ثبت نام کنید: </Text>
<Link href="/signup" asChild>
  <TouchableOpacity>
    <Text style={styles.link}>ثبت نام</Text>
  </TouchableOpacity>
</Link>

 </View>

         </View>
        </View>
      </View>
   </KeyboardAvoidingView>
  );
}