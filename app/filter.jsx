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
   // setCreateProperty3,
    setCar1,
    setCloutes2,
    setCreateKitchen1,
    setKitchen1,
    setCreateJobs1,
    setJobs1,
   // setProperty3,
  } = useFilterStore();

  const setCreateProperty3 = useFilterStore(
  state => state.setCreateProperty3
);

const setProperty3 = useFilterStore(
  state => state.setProperty3
);

  // 👇 گزینه‌ها برای هر نوع فیلتر
  const filterOptions = {
    // ماشین
    car1Model: ["بدون فیلتر", "2025", "2024", "2023","2022", "2021", "2020","2019", "2018", "2017","2016","2015", "2014", "2013"],
    car1AdType: ["بدون فیلتر","موتر", "موتر سیکلیت", "تونس", "سراچه"],
    car1FuelType: ["بدون فیلتر","برق", "دیزل", "پترول", "گاز"],
    car1Brand: ["بدون فیلتر","تویوتا", "لندکروز", "بی‌ام‌و", "بنز", "هوندا", "هیوندای","فورد", "فولکس واگن", "آئودی","نیسان", "تسلا","شورولت",
  "کیا",
  "پورشه",
  "لکسوس",
  "جیپ",
  "رنو",
  "فیات",
  "سوبارو",
  "جگوار",
 ],

     kitchen2Model: ["بدون فیلتر","2025", "2024", "2023","2022", "2021", "2020","2019", "2018", "2017","2016","2015", "2014", "2013"],
    kitchen2Category: ["بدون فیلتر","خانه", "آشپزخانه", "اتاق خواب", "حمام و دستشویی"],
    kitchen2Texture: ["بدون فیلتر","آهن", "مس", "چوب", "MDF", "استیل","آلمینیوم", "پلاستیک", "سرامیک","شیشه", "چدن", "سیلیکون", "پشم", "ابریشم","پنبه", "نایلون", "پلی استر"],
    kitchen2Status: ["بدون فیلتر","نو", "دسته دو (کار کرده)"],
    kitchen2Dimensions: [
  "بدون فیلتر",
  "بین ۳۰ تا ۵۰ سانتی‌متر",
  "بین ۵۰ تا ۱۰۰ سانتی‌متر",
  "بین ۱۰۰ تا ۱۵۰ سانتی‌متر",
  "بین ۱۵۰ تا ۲۰۰ سانتی‌متر",
  "۲ متری",
  "۴ متر",
  "۶ متری",
  "۹ متری",
  "۱۲ متری",
  "۲۴ متری"
],
      model:  ["بدون فیلتر","2025", "2024", "2023","2022", "2021", "2020","2019", "2018", "2017","2016","2015", "2014", "2013"],
     category: ["بدون فیلتر","خانه", "آشپزخانه", "اتاق خواب", "حمام و دستشویی"],
     status: ["بدون فیلتر","نو", "دسته دو (کار کرده)"],
     dimensions: [
  "بدون فیلتر",
  "بین ۳۰ تا ۵۰ سانتی‌متر",
  "بین ۵۰ تا ۱۰۰ سانتی‌متر",
  "بین ۱۰۰ تا ۱۵۰ سانتی‌متر",
  "بین ۱۵۰ تا ۲۰۰ سانتی‌متر",
  "۲ متری",
  "۴ متر",
  "۶ متری",
  "۹ متری",
  "۱۲ متری",
  "۲۴ متری"
],
     texture:  ["بدون فیلتر","آهن", "مس", "چوب", "MDF", "استیل","آلمینیوم", "پلاستیک", "سرامیک","شیشه", "چدن", "سیلیکون", "پشم", "ابریشم","پنبه", "نایلون", "پلی استر"],
    // لباس
    cloutes1Texture: ["بدون فیلتر","پنبه", "ابریشم", "پشم", "مخمل", "نخ"],
    cloutes1Model:["بدون فیلتر","مردانه", "زنانه", "بچگانه"],
    cloutes1Status: ["بدون فیلتر","نو", "دسته دو (کار کرده)"],
    
    cloutesTexture: ["بدون فیلتر","پنبه", "ابریشم", "پشم", "مخمل", "نخ"],
    cloutesModel: ["بدون فیلتر","مردانه", "زنانه", "بچگانه"],
    cloutesStatus:["بدون فیلتر","نو", "دسته دو (کار کرده)"],
   
  propertyType: [
  { label: "فروش", value: "sale" },
  { label: "کرایه", value: "rent" },
  { label: "گرو", value: "mortgage" },
  { label: "گرو و کرایه", value: "rent_mortgage" },
],
   area:  [
  "بدون فیلتر",
  "بین ۳۰ تا ۵۰ متر",
  "بین ۵۰ تا ۷۰ متر",
  "بین ۷۰ تا ۱۰۰ متر",
  "بین ۱۰۰ تا ۱۵۰ متر",
  "بین ۱۵۰ تا ۲۰۰ متر",
],

   rentPrice: ["بدون فیلتر"," ۱ تا ۲ هزار افغانی", " ۲ تا ۳ هزار افغانی"
    , " ۳ تا ۴ هزار افغانی"
    , " ۴ تا ۵ هزار افغانی"
    , " ۵ تا ۶ هزار افغانی"
    , " ۶ تا ۷ هزار افغانی"
    , " ۷ تا ۸ هزار افغانی"
    , " ۸ تا ۹ هزار افغانی"
    , " ۹ تا ۱۰ هزار افغانی"
    , " ۱۰ تا ۱۳ هزار افغانی"
    , " ۱۳ تا ۱۶ هزار افغانی"
    , " ۱۶ تا ۱۸ هزار افغانی"
    , " ۱۸ تا ۲۰ هزار افغانی"
    , " ۲۰ تا ۲۵ هزار افغانی"
    , " ۲۵ تا ۳۰ هزار افغانی"
    , " ۳۰ تا ۴۰ هزار افغانی"

   ],
   mortgagePrice:[
  "بدون فیلتر",
  " ۱۰ تا ۲۰ هزار افغانی",
  " ۲۰ تا ۳۰ هزار افغانی",
  " ۳۰ تا ۴۰ هزار افغانی",
  " ۴۰ تا ۵۰ هزار افغانی",
  " ۵۰ تا ۶۰ هزار افغانی",
  " ۶۰ تا ۷۰ هزار افغانی",
  " ۷۰ تا ۸۰ هزار افغانی",
  " ۸۰ تا ۹۰ هزار افغانی",
  " ۱۰۰ تا ۱۲۰ هزار افغانی",
  " ۱۲۰ تا ۱۵۰ هزار افغانی",
  " ۱۵۰ تا ۲۰۰ هزار افغانی"
],
    price:  [
  "بدون فیلتر",
  " ۱۰۰ تا ۲۰۰ هزار افغانی",
  " ۲۰۰ تا ۳۰۰ هزار افغانی",
  " ۳۰۰ تا ۴۰۰ هزار افغانی",
  " ۴۰۰ تا ۵۰۰ هزار افغانی",
  " ۵۰۰ تا ۶۰۰ هزار افغانی",
  " ۶۰۰ تا ۷۰۰ هزار افغانی",
  " ۷۰۰ تا ۸۰۰ هزار افغانی",
  " ۸۰۰ تا ۹۰۰ هزار افغانی",
  " ۱۰۰۰ تا ۱۲۰۰ هزار افغانی",
  " ۱۲۰۰ تا ۱۵۰۰ هزار افغانی",
  " ۱۵۰۰ تا ۲۰۰۰ هزار افغانی"
],


  propertyType1: [
    { label: "فروش", value: "sale" },
    { label: "کرایه", value: "rent" },
    { label: "گرو", value: "mortgage" },
    { label: "گرو و کرایه", value: "rent_mortgage" }
     ],


    area1:  [
  "بدون فیلتر",
  "بین ۳۰ تا ۵۰ متر",
  "بین ۵۰ تا ۷۰ متر",
  "بین ۷۰ تا ۱۰۰ متر",
  "بین ۱۰۰ تا ۱۵۰ متر",
  "بین ۱۵۰ تا ۲۰۰ متر",
],
    rentPrice1: ["بدون فیلتر"," ۱ تا ۲ هزار افغانی", " ۲ تا ۳ هزار افغانی"
    , " ۳ تا ۴ هزار افغانی"
    , " ۴ تا ۵ هزار افغانی"
    , " ۵ تا ۶ هزار افغانی"
    , " ۶ تا ۷ هزار افغانی"
    , " ۷ تا ۸ هزار افغانی"
    , " ۸ تا ۹ هزار افغانی"
    , " ۹ تا ۱۰ هزار افغانی"
    , " ۱۰ تا ۱۳ هزار افغانی"
    , " ۱۳ تا ۱۶ هزار افغانی"
    , " ۱۶ تا ۱۸ هزار افغانی"
    , " ۱۸ تا ۲۰ هزار افغانی"
    , " ۲۰ تا ۲۵ هزار افغانی"
    , " ۲۵ تا ۳۰ هزار افغانی"
    , " ۳۰ تا ۴۰ هزار افغانی"

   ],
    mortgagePrice1:[
  "بدون فیلتر",
  " ۱۰ تا ۲۰ هزار افغانی",
  " ۲۰ تا ۳۰ هزار افغانی",
  " ۳۰ تا ۴۰ هزار افغانی",
  " ۴۰ تا ۵۰ هزار افغانی",
  " ۵۰ تا ۶۰ هزار افغانی",
  " ۶۰ تا ۷۰ هزار افغانی",
  " ۷۰ تا ۸۰ هزار افغانی",
  " ۸۰ تا ۹۰ هزار افغانی",
  " ۱۰۰ تا ۱۲۰ هزار افغانی",
  " ۱۲۰ تا ۱۵۰ هزار افغانی",
  " ۱۵۰ تا ۲۰۰ هزار افغانی"
],
    price1:  [
  "بدون فیلتر",
  " ۱۰۰ تا ۲۰۰ هزار افغانی",
  " ۲۰۰ تا ۳۰۰ هزار افغانی",
  " ۳۰۰ تا ۴۰۰ هزار افغانی",
  " ۴۰۰ تا ۵۰۰ هزار افغانی",
  " ۵۰۰ تا ۶۰۰ هزار افغانی",
  " ۶۰۰ تا ۷۰۰ هزار افغانی",
  " ۷۰۰ تا ۸۰۰ هزار افغانی",
  " ۸۰۰ تا ۹۰۰ هزار افغانی",
  " ۱۰۰۰ تا ۱۲۰۰ هزار افغانی",
  " ۱۲۰۰ تا ۱۵۰۰ هزار افغانی",
  " ۱۵۰۰ تا ۲۰۰۰ هزار افغانی"
],

    // car1
    carModel: ["بدون فیلتر","2025", "2024", "2023","2022", "2021", "2020","2019", "2018", "2017","2016","2015", "2014", "2013"],
    carAdType: ["بدون فیلتر","موتر", "موتر سیکلیت", "تونس", "سراچه"],

    income: [
    "بدون فیلتر",
    " ۵ تا ۶ هزار افغانی",
  " ۶ تا ۷ هزار افغانی",
  " ۷ تا ۸ هزار افغانی",
  " ۸ تا ۹ هزار افغانی",
  " ۹ تا ۱۰ هزار افغانی",
  " ۱۰ تا ۱۲ هزار افغانی",
  " ۱۲ تا ۱۵ هزار افغانی",
  " ۱۵ تا ۱۷ هزار افغانی",
  " ۱۷ تا ۲۰ هزار افغانی",
  " ۲۰ تا ۲۵ هزار افغانی",
  " ۲۵ تا ۳۰ هزار افغانی",
  " ۳۰ تا ۳۵ هزار افغانی",
  " ۳۵ تا ۴۰ هزار افغانی",
  " ۴۵ تا ۵۰ هزار افغانی",
  " ۵۰ تا ۶۰ هزار افغانی"
],
    workingHours: ["بدون فیلتر","8 الی 12 ساعت", "5 الی 8 ساعت", "کار آموزی", "پروژه ای"],
    paymentType: ["بدون فیلتر","اداری و مدیریت", "سرایداری و نظافت", "خدمات فروشگاه و نظافت",
      "معماری, عمران و ساختمانی",
      "رایانه و فناوری",
      "مالی و حساب داری",
      "صنعتی, فنی و مهندسی",
      "آموزشی",
      "حمل و نقل",
      "درمانی, زیبای و بهداشتی",
      "هنری و رسانه",
    ],


    income1: [
  "بدون فیلتر",
  " ۵ تا ۶ هزار افغانی",
  " ۶ تا ۷ هزار افغانی",
  " ۷ تا ۸ هزار افغانی",
  " ۸ تا ۹ هزار افغانی",
  " ۹ تا ۱۰ هزار افغانی",
  " ۱۰ تا ۱۲ هزار افغانی",
  " ۱۲ تا ۱۵ هزار افغانی",
  " ۱۵ تا ۱۷ هزار افغانی",
  " ۱۷ تا ۲۰ هزار افغانی",
  " ۲۰ تا ۲۵ هزار افغانی",
  " ۲۵ تا ۳۰ هزار افغانی",
  " ۳۰ تا ۳۵ هزار افغانی",
  " ۳۵ تا ۴۰ هزار افغانی",
  " ۴۵ تا ۵۰ هزار افغانی",
  " ۵۰ تا ۶۰ هزار افغانی"
   ],
    workingHours1: ["بدون فیلتر","8 الی 12 ساعت", "5 الی 8 ساعت", "کار آموزی", "پروژه ای"],
    paymentType1: ["بدون فیلتر","اداری و مدیریت", "سرایداری و نظافت", "خدمات فروشگاه و نظافت",
      "معماری, عمران و ساختمانی",
      "رایانه و فناوری",
      "مالی و حساب داری",
      "صنعتی, فنی و مهندسی",
      "آموزشی",
      "حمل و نقل",
      "درمانی, زیبای و بهداشتی",
      "هنری و رسانه",
    ],
  }; 

  // 👇 عنوان برای هر نوع فیلتر
  const filterTitles = {
    car1Model: "سال ساخت",
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
    mortgagePrice: "گرو",
    price: "قیمت",

    propertyType1: "نوع ملک",
    area1: "مساحت",
    rentPrice1: "اجاره",
    mortgagePrice1: "گرو",
    price1: "قیمت",


    carModel: "سال ساخت",
    carAdType: "نوع وسیله",

 
    kitchen2Model: "سال ساخت",
    kitchen2Category: "دسته بندی",
    kitchen2Texture: "جنس وسیله",
    kitchen2Status: "وضعیت",
    kitchen2Dimensions: "ابعاد",

    model: "سال ساخت",
    category: "دسته بندی",
    texture: "جنس وسیله",
    status: "وضعیت",
    dimensions: "ابعاد",

    income: "معاش",
    workingHours: "ساعت کاری",
    paymentType: "دسته بندی",

    income1: "معاش",
    workingHours1: "ساعت کاری",
    paymentType1: "دسته بندی",

  };

  const options = filterOptions[type] || [];
  const title = filterTitles[type] || "";

 
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
    // ملک
   propertyType: (val) => setCreateProperty3({ propertyType: val }),
   area: (val) => setCreateProperty3({ area: val }),
   rentPrice: (val) => setCreateProperty3({rentPrice: val}),
    mortgagePrice: (val) => setCreateProperty3({mortgagePrice: val}),
     price: (val) => setCreateProperty3({price: val}),



    // ملک
    propertyType1: (val) => setProperty3({ propertyType: val}),
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
 }
  

//   const handleSelect = (opt) => {

//  console.log("TYPE:", type);
//   console.log("SELECTED:", opt);

//   if (type === "propertyType") {
//     setCreateProperty3(prev => ({
//       ...prev,
//       propertyType: opt.value, // فقط value
//     }));
//   } else if (type === "propertyType1") {
//     setProperty3(prev => ({
//       ...prev,
//       propertyType: opt.value,
//     }));
//   } else if (setters[type]) {
//     const val = typeof opt === "object" && opt.value ? opt.value : opt;
//     setters[type](val);
//   }


//     router.back();
//   };


const handleSelect = (opt) => {
 

  const val =
    typeof opt === "object" && opt.value
      ? opt.value
      : opt;

  if (setters[type]) {
    setters[type](val);
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
