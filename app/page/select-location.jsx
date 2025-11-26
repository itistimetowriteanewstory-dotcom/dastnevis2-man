import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFilterStore } from "../../store/fileStore"; // 👈 استور فیلترها

const provinces = [
  "همه ولایت‌ها",
  "کابل","هرات","بلخ","قندهار","ننگرهار","مزار شریف","بامیان","پکتیا","پکتیکا","خوست",
  "لغمان","کنر","نورستان","بدخشان","تخار","کندز","سمنگان","سرپل","جوزجان","فاریاب",
  "غور","دایکندی","میدان وردک","لوگر","پروان","کاپیسا","پنجشیر","غزنی","زابل",
  "ارزگان","هلمند","نیمروز","بادغیس"
];

export default function SelectLocation() {
  const router = useRouter();
  const { section } = useLocalSearchParams(); // 👈 می‌گیریم بخش مربوطه

  const {
    setCreateCar1,
    setCreateCloutes2,
    setCreateProperty3,
    setCreateEat4,
    setIndex5,
    setCar1,
    setCloutes2,
    setEat1,
    setCreateKitchen1,
    setKitchen1,
    setCreateJobs1,
    setProperty3,
  } = useFilterStore();

  const handleSelect = (province) => {
    const value = province === "همه ولایت‌ها" ? "" : province;

    if (section === "car") setCreateCar1({ location: value });
    else if (section === "clothes") setCreateCloutes2({ location: value });
    else if (section === "property") setCreateProperty3({ location: value });
    else if (section === "eat") setCreateEat4({ location: value });
    else if (section === "jobs") setIndex5({ location: value });
    else if (section === "car1") setCar1({ location: value });
    else if (section === "clothes2") setCloutes2({ location: value });
    else if (section === "eat1") setEat1({ location: value });
    else if (section === "kitchen") setCreateKitchen1({ location: value });
    else if (section === "kitchen1") setKitchen1({ location: value });
    else if (section === "createJobs") setCreateJobs1({ location: value });
    else if (section === "property1") setProperty3({ location: value });
    router.back(); // 👈 برگشت به صفحه‌ی قبلی
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={provinces}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
            onPress={() => handleSelect(item)}
          >
            <Text style={{ fontSize: 18 }}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}


