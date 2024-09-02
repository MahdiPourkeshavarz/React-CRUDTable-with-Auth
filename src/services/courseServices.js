import { API_URL } from "../constants";
import { httpRequest } from "./authServices";

async function fetchCourses() {
  const response = await httpRequest.get(`${API_URL.BASE_COURSE_URL}?limit=10`);
  console.log(response.data.results);

  return { data: response.data.results, total: response.data.count };
}

async function createCourse(course) {
  try {
    const response = await httpRequest.post(API_URL.BASE_COURSE_URL, course);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

async function deleteCourse(courseId) {
  try {
    const response = await httpRequest.delete(
      `${API_URL.BASE_COURSE_URL}${courseId}/`
    );
    return response.statusText;
  } catch (e) {
    console.log(e.message);
  }
}

async function updateCourse(course) {
  const response = await httpRequest.put(
    `${API_URL.BASE_COURSE_URL}${course.id}/`,
    course.data
  );
  return response.data;
}

export const COURSE_SERVICE = {
  fetchCourses,
  createCourse,
  deleteCourse,
  updateCourse,
};
