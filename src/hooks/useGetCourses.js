/* eslint-disable no-unused-vars */

import { useQuery } from "@tanstack/react-query";
import { COURSE_SERVICE } from "../services/courseServices";

export const useGetCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: COURSE_SERVICE.fetchCourses,
  });
};
