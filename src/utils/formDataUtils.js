export const defaultValueCourse = {
  id: "",
  teacher: "",
  title: "",
  category: "2",
  duration: 45,
  price: 2500000,
  description: "very good course",
  number_of_chapter: 12,
  number_of_viewer: 1000,
  upload_images: [],
  rating: 3,
};

export const convertToFormData = (courseData) => {
  const formData = new FormData();
  console.log(courseData);

  formData.append("teacher", courseData.teacher || defaultValueCourse.teacher);
  formData.append("title", courseData.title || defaultValueCourse.title);
  formData.append("category", defaultValueCourse.category);
  formData.append(
    "duration",
    courseData.duration || defaultValueCourse.duration
  );
  formData.append("price", courseData.price || defaultValueCourse.price);
  formData.append("description", defaultValueCourse.description);
  formData.append("number_of_chapter", defaultValueCourse.number_of_chapter);
  formData.append("number_of_viewer", defaultValueCourse.number_of_viewer);
  formData.append("rating", defaultValueCourse.rating);
  if (courseData?.upload_images?.length > 0) {
    formData.append("upload_images", courseData.upload_images[0]);
  }
  return formData;
};
