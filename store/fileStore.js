import { create } from "zustand";

export const useFilterStore = create((set) => ({
  // 👇 بخش ماشین
  createCar1: {
    location: "",
    model: "",
    adType: "",
    fuelType: "",
    brand: "",
  },

    // 👇 بخش ماشین
  createJobs1: {
    location: "",
    income: "",
    workingHours: "",
    paymentType: "",
  },

  jobs1:{
    income: "",
    workingHours: "",
    paymentType: "",
  },

  // 👇 بخش لباس
  createCloutes2: {
    location: "",
    cloutesTexture: "",
    cloutesModel: "",
    cloutesStatus: "",
  },

   createKitchen1: {
    location: "",
    texture: "",
    model: "",
    status: "",
    category: "",
    dimensions: "",
  },

  // 👇 بخش ملک
  createProperty3: {
    location: "",
    propertyType: "",
    area: "",
    mortgagePrice: "",
    rentPrice: "",
    price: "",
  },

  // 👇 بخش ملک
    property3: {
    location: "",
    propertyType: "",
    area: "",
    mortgagePrice: "",
    rentPrice: "",
    price: "",
  },

  // 👇 بخش غذا
  createEat4: {
    location: "",
  },

  // 👇 بخش غذا
  eat1: {
    location: "",
  },

  // 👇 بخش غذا
  index5: {
    location: "",
  },

  // 👇 بخش غذا
  car1: {
    location: "",
    model: "",
    adType: "",
    title: "",
  },

   // 👇 بخش لباس
    Cloutes2: {
    location: "",
    cloutesTexture: "",
    cloutesModel: "",
    cloutesStatus: "",
  },

    kitchen1: {
    location: "",
    texture: "",
    model: "",
    status: "",
    category: "",
    dimensions: "",
  },


  // 👇 setter ها برای هر namespace
  setCreateCar1: (updates) =>
    set((state) => ({
      createCar1: { ...state.createCar1, ...updates },
    })),

  setCreateCloutes2: (updates) =>
    set((state) => ({
      createCloutes2: { ...state.createCloutes2, ...updates },
    })),

  setCreateProperty3: (updates) =>
    set((state) => ({
      createProperty3: { ...state.createProperty3, ...updates },
    })),

     setProperty3: (updates) =>
    set((state) => ({
      property3: { ...state.property3, ...updates },
    })),

    setIndex5: (updates) =>
    set((state) => ({
      index5: { ...state.index5, ...updates },
    })),


  setCreateEat4: (updates) =>
    set((state) => ({
      createEat4: { ...state.createEat4, ...updates },
    })),

    setEat1: (updates) =>
    set((state) => ({
      eat1: { ...state.eat1, ...updates },
    })),

setCar1: (updates) =>
    set((state) => ({
      car1: { ...state.car1, ...updates },

    })),

 setCloutes2: (updates) =>
    set((state) => ({
      Cloutes2: { ...state.Cloutes2, ...updates },
    })),

     setCreateKitchen1: (updates) =>
     set((state) => ({
      createKitchen1: { ...state.createKitchen1, ...updates },
    })),

     setKitchen1: (updates) =>
     set((state) => ({
      kitchen1: { ...state.kitchen1, ...updates },
    })),

     setCreateJobs1: (updates) =>
     set((state) => ({
      createJobs1: { ...state.createJobs1, ...updates },
    })),

      setJobs1: (updates) =>
     set((state) => ({
      jobs1: { ...state.jobs1, ...updates },
    })),

}));

