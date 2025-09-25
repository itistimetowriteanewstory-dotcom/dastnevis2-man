import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import styles from "../../assets/styles/signup.styles";
import {Ionicons} from "@expo/vector-icons";
import COLORS from '../../colectionColor/colors';
import { useState } from 'react';
import { useRouter } from "expo-router";
import { useAuthStore } from '../../store/authStore';
import { registerForPushNotificationsAsync } from "../../lib/notification";
import { Link } from "expo-router";


export default function Signup() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 
  const {user, isLoading, register}=useAuthStore();

  
  const router = useRouter();

  const handleSignUp = async () => {
    const result = await register(username, email, password);

//  if(!result.success) Alert.alert("Error", result.error );
if (!result.success) {
  console.log("خطا:", result.error); // برای تست
  Alert.alert("خطا", result.error || "مشکلی پیش آمده است");
  return;
}

if (result.token) {
  await registerForPushNotificationsAsync(result.token);
  }

  };

  

  return (

  <KeyboardAvoidingView
      style={{flex:1}}
      behavior={Platform.OS === "ios" ? "padding" : "height"} >
   
    
   <View style={styles.container}>
   <View style={styles.card}>
{ /* header */}
<View style={styles.header}>
  <Text style={styles.title}> دست نویس</Text>
  <Text style={styles.subtitle}> با این برنامه شغل مورد نظر خود را پیدا کنید و به صورت رایگان آگهی های شغلی خودتان را به دیگران معرفی کنید.</Text>
</View>

<View style={styles.formContainer}>
{ /* user input */}
<View style={styles.inputGroup}>

  <Text style={styles.label}> اسم</Text>
  <View style={styles.inputContainer}>
    <Ionicons 
    name='person-outline'
    size={20}
    color={COLORS.primary}
    style={styles.inputIcon}

    />
    <TextInput 
    style={styles.input}
    placeholder='مثال: محمد'
    placeholderTextColor={COLORS.placeholderText}
    value={username}
    onChangeText={setUsername}
    autoCapitalize='none'
    />
  </View>
</View>

{/* email input */}
<View style={styles.inputGroup}>
  <Text style={styles.label}> ایمیل</Text>
  <View style={styles.inputContainer}>
    <Ionicons 
    name='mail-outline'
    size={20}
    color={COLORS.primary}
    style={styles.inputIcon}
    />
    <TextInput 
    style={styles.input}
    placeholder='ایمیل خود را وارد کنید'
    value={email}
    onChangeText={setEmail}
    keyboardType='email-address'
    autoCapitalize='none'
    />
  </View>
</View>

{/* password */}
<View style={styles.inputGroup}>
  <Text style={styles.label}>رمز عبور</Text>
  <View style={styles.inputContainer}>
    <Ionicons 
    name='lock-closed-outline'
    size={20}
    color={COLORS.primary}
    style={styles.inputIcon}
    />
    <TextInput 
    style={styles.input}
    placeholder='یک رمز عبور برای خود بنویسید'
    placeholderTextColor={COLORS.placeholderText}
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
    />
    <TouchableOpacity onPress={()=> setShowPassword(!showPassword)}
      style={styles.eyeIcon}
      >
        <Ionicons 
        name={showPassword ? "eye-outline" : "eye-off-outline"}
        size={20}
        color={COLORS.primary}
        />

    </TouchableOpacity>
  </View>
</View>
{ /* sign up button */}
<TouchableOpacity
  style={styles.button}
  onPress={handleSignUp}
  disabled={isLoading}
>
  {isLoading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.buttonText}>ثبت نام کردن</Text>
  )}
</TouchableOpacity>



{/* footer */}
<View style={styles.footer}>
  <Text style={styles.footerText}>آیا از قبل ثبت نام کرده اید</Text>
 
      <Link href="/login" asChild>
  <TouchableOpacity>
    <Text style={styles.link}>وارد شوید</Text>
  </TouchableOpacity>
</Link>

</View>

</View>
   </View>
   </View>
      </KeyboardAvoidingView>
  );
}