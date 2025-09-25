
export const formatMemberSince = (dateString) => {
  if (!dateString) return "تاریخ نامشخص";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "تاریخ نامعتبر";

  // استفاده از تقویم شمسی
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "numeric",
  });

  return formatter.format(date); // خروجی مثل "مهر ۱۴۰۴"
};

// نمایش تاریخ انتشار به صورت شمسی (مثلاً "۲ مهر ۱۴۰۴")
export const formatPublishDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "تاریخ نامعتبر";

  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return formatter.format(date); // خروجی مثل "۲ مهر ۱۴۰۴"
};






