import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFilterStore } from "../store/fileStore"; // 👈 استور فیلترها
import styles from "../assets/styles/filter.styles";
export default function FilterPage() {
  const { type } = useLocalSearchParams();
  const router = useRouter();

  // گرفتن setterها از استور
  const {
    setCreateCar1,
    setCreateCloutes2,
    setCreateProperty3,
    setCar1,
    setCloutes2,
    setCreateKitchen1,
    setKitchen1,
    setCreateJobs1,
    setJobs1,
    setProperty3,
  } = useFilterStore();

  // 👇 گزینه‌ها برای هر نوع فیلتر
  const filterOptions = {
    // ماشین
    car1Model: ["2025", "2024", "2023","2022", "2021", "2020","2019", "2018", "2017","2016","2015", "2014", "2013"],
    car1AdType: ["موتر", "موتر سیکلیت", "اتوبوس"],
    car1FuelType: ["برق", "دیزل", "پترول", "گاز"],
    car1Brand: ["تویوتا", "لندکروز", "بی‌ام‌و", "بنز", "هوندا", "هیوندای","فورد", "فولکس واگن", "آئودی","نیسان", "تسلا","شورولت",
  "کیا",
  "پورشه",
  "لکسوس",
  "جیپ",
  "رنو",
  "فیات",
  "سوبارو",
  "جگوار",
 ],

     kitchen2Model: ["2025", "2024", "2023","2022", "2021", "2020","2019", "2018", "2017","2016","2015", "2014", "2013"],
    kitchen2Category: ["خانه", "آشپزخانه", "اتاق خواب", "حمام و دستشویی"],
    kitchen2Texture: ["آهن", "مس", "چوب", "MDF", "استیل","آلمینیوم", "پلاستیک", "سرامیک","شیشه", "چدن", "سیلیکون", "پشم", "ابریشم","پنبه", "نایلون", "پلی استر"],
    kitchen2Status: ["نو", "دسته دو (کار کرده)"],
    kitchen2Dimensions: [ "از 30 سانتی‌متر تا 50 سانتی‌متر","از 50 سانتی‌متر تا 100 سانتی‌متر","از 100 سانتی‌متر تا 150 سانتی‌متر","از 150 سانتی‌متر تا 200 سانتی‌متر","2 متری","4 متر","6 متری","9 متری","12 متری","24 متری"],

      model:  ["2025", "2024", "2023","2022", "2021", "2020","2019", "2018", "2017","2016","2015", "2014", "2013"],
     category: ["خانه", "آشپزخانه", "اتاق خواب", "حمام و دستشویی"],
     status: ["نو", "دسته دو (کار کرده)"],
     dimensions: [ "از 30 سانتی‌متر تا 50 سانتی‌متر","از 50 سانتی‌متر تا 100 سانتی‌متر","از 100 سانتی‌متر تا 150 سانتی‌متر","از 150 سانتی‌متر تا 200 سانتی‌متر","2 متری","4 متر","6 متری","9 متری","12 متری","24 متری"],
     texture:  ["آهن", "مس", "چوب", "MDF", "استیل","آلمینیوم", "پلاستیک", "سرامیک","شیشه", "چدن", "سیلیکون", "پشم", "ابریشم","پنبه", "نایلون", "پلی استر"],
    // لباس
    cloutes1Texture: ["پنبه", "ابریشم", "پشم", "مخمل", "نخ"],
    cloutes1Model:["مردانه", "زنانه", "بچگانه"],
    cloutes1Status: ["نو", "دسته دو (کار کرده)"],
    
    cloutesTexture: ["پنبه", "ابریشم", "پشم", "مخمل", "نخ"],
    cloutesModel: ["مردانه", "زنانه", "بچگانه"],
    cloutesStatus:["نو", "دسته دو (کار کرده)"],
   
  propertyType: [
  { label: "فروش", value: "sale" },
  { label: "کرایه", value: "rent" },
  { label: "گرو", value: "mortgage" },
  { label: "گرو و کرایه", value: "rent_mortgage" },
],
    area: [
  "از 30 متر مربع تا 50 متر مربع",
  "از 50 متر مربع تا 70 متر مربع",
  "از 70 متر مربع تا 100 متر مربع",
  "از 100 متر مربع تا 150 متر مربع",
  "از 150 متر مربع تا 200 متر مربع",
],

    rentPrice: ["1000 afgahni", "2000afgahni", "3000af"],
    mortgagePrice: ["1000", "2000", "3000"],
    price: ["1000", "2000", "3000", "4000"],


    propertyType1: ["فروش", "کرایه", "گرو", "گرو و کرایه"],
    area1: ["50 متر", "100 متر", "200 متر"],
    rentPrice1: ["1000 afgahni", "2000afgahni", "3000af"],
    mortgagePrice1: ["1000", "2000", "3000"],
    price1: ["1000", "2000", "3000", "4000"],

    // car1
    carModel: ["2025", "2023", "2020"],
    carAdType: ["موتر", "موتر سیکلیت", "اتوبوس"],

    income: ["1000", "2000", "3000", "4000", "5000"],
    workingHours: ["12 hours", "7hours", "karamoz", "project"],
    paymentType: ["monthly", "weekly", "daylay", "yearly"],


    income1: ["1000", "2000", "3000", "4000", "5000"],
    workingHours1: ["12 hours", "7hours", "karamoz", "project"],
    paymentType1: ["monthly", "weekly", "daylay", "yearly"],

  }; 

  // 👇 عنوان برای هر نوع فیلتر
  const filterTitles = {
    car1Model: "مدل",
    car1AdType: "نوع آگهی",
    car1FuelType: "نوع سوخت",
    car1Brand: "برند", // 👈 اضافه شد

    cloutes1Texture: "بافت لباس",
    cloutes1Model: "مدل لباس",
    cloutes1Status: "وضعیت",

    cloutesTexture: "بافت لباس",
    cloutesModel: "مدل لباس",
    cloutesStatus: "وضعیت",
  

    propertyType: "نوع ملک",
    area: "مساحت",
    rentPrice: "اجاره",
    mortgagePrice: "mortgage",
    price: "price",

    propertyType1: "نوع ملک",
    area1: "مساحت",
    rentPrice1: "اجاره",
    mortgagePrice1: "mortgage",
    price1: "price",


    carModel: "مدل خودرو (فیلتر)",
    carAdType: "نوع آگهی خودرو (فیلتر)",

 
    kitchen2Model: "model",
    kitchen2Category: "category",
    kitchen2Texture: "texture",
    kitchen2Status: "status",
    kitchen2Dimensions: "demension",

    model: "model",
    category: "category",
    texture: "texture",
    status: "status",
    dimensions: "demension",

    income: "income",
    workingHours: "workingHours",
    paymentType: "paymentType",

    income1: "income",
    workingHours1: "workingHours",
    paymentType1: "paymentType",

  };

  const options = filterOptions[type] || [];
  const title = filterTitles[type] || "";

  const handleSelect = (opt) => {
    // 👇 نگاشت type به setter درست
    const setters = {
      // ماشین
      car1Model: (val) => setCreateCar1({ model: val }),
      car1AdType: (val) => setCreateCar1({ adType: val }),
      car1FuelType: (val) => setCreateCar1({ fuelType: val }),
      car1Brand: (val) => setCreateCar1({ brand: val }),

     kitchen2Model: (val) => setCreateKitchen1({ model: val }),
     kitchen2Texture: (val) => setCreateKitchen1({ texture: val }),
     kitchen2Status: (val) => setCreateKitchen1({ status: val }),
     kitchen2Category: (val) => setCreateKitchen1({ category: val }),
     kitchen2Dimensions: (val) => setCreateKitchen1({ dimensions: val }),

       model: (val) => setKitchen1({ model: val }),
     texture: (val) => setKitchen1({ texture: val }),
     status: (val) => setKitchen1({ status: val }),
     category: (val) => setKitchen1({ category: val }),
     dimensions: (val) => setKitchen1({ dimensions: val }),

      // لباس
      cloutes1Texture: (val) => setCreateCloutes2({ cloutesTexture: val }),
      cloutes1Model: (val) => setCreateCloutes2({ cloutesModel: val }),
      cloutes1Status: (val) => setCreateCloutes2({ cloutesStatus: val }),

      // لباس
      cloutesTexture: (val) => setCloutes2({ cloutesTexture: val }),
      cloutesModel: (val) => setCloutes2({ cloutesModel: val }),
      cloutesStatus: (val) => setCloutes2({ cloutesStatus: val }),
     
      // ملک
      propertyType: (val) => setCreateProperty3({ propertyType: val }),
      area: (val) => setCreateProperty3({ area: val }),
      rentPrice: (val) => setCreateProperty3({rentPrice: val}),
      mortgagePrice: (val) => setCreateProperty3({mortgagePrice: val}),
      price: (val) => setCreateProperty3({price: val}),

      propertyType1: (val) => setProperty3({ propertyType: val }),
      area1: (val) => setProperty3({ area: val }),
      rentPrice1: (val) => setProperty3({rentPrice: val}),
      mortgagePrice1: (val) => setProperty3({mortgagePrice: val}),
      price1: (val) => setProperty3({price: val}),

      // car1
      carModel: (val) => setCar1({ model: val }),
      carAdType: (val) => setCar1({ adType: val }),


      income: (val) => setCreateJobs1({income: val}),
      workingHours: (val) => setCreateJobs1({workingHours: val}),
      paymentType: (val) => setCreateJobs1({paymentType: val}),

      income1: (val) => setJobs1({income: val}),
      workingHours1: (val) => setJobs1({workingHours: val}),
      paymentType1: (val) => setJobs1({paymentType: val}),

    };

    if (setters[type]) setters[type](opt);
  if (type === "propertyType") {
    setCreateProperty3({ propertyType: opt.value }); //  ذخیره مقدار انگلیسی
  }
    router.back();
  };

  return (
   <View style={styles.container}>
  <View style={styles.card}>
    <Text style={styles.title}>انتخاب {title}</Text>
    <ScrollView style={styles.scrollArea}>
      {options.map((opt, index) => (
        <TouchableOpacity
          key={opt.value || opt || index}
          style={styles.optionBox}
          onPress={() => handleSelect(opt)}
        >
          <Text style={styles.optionText}>{opt.label || opt}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
</View>
  );
}

