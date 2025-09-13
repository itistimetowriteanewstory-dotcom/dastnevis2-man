
//export const formatMemberSince = (dateString) => {
//  const date = new Date(dateString);
//  const month = date.toLocaleString("default", { month: "short" }); // مثل "May"
//  const year = date.getFullYear();
//  return `${month} ${year}`;
//};


export const formatMemberSince = (dateString) => {
  if (!dateString) return "تاریخ نامشخص";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "تاریخ نامعتبر";

  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};





// نمایش تاریخ انتشار به صورت "May 15, 2023"
export const formatPublishDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "long" }); // مثل "May"
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

