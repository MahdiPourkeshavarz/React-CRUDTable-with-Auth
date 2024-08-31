/* eslint-disable no-unused-vars */

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@tanstack/react-query";
import { useGetCourses } from "../hooks/useGetCourses";
import { COURSE_SERVICE } from "../services/courseServices";
import { queryClient } from "../lib/reactQueryConfig";

export function CourseTable() {
  const [validationErrors, setValidationErrors] = useState({});

  const { data: fetchCourses, isLoading: isLoadingCourses } = useGetCourses();

  const createCourseMutation = useMutation({
    mutationFn: (course) => COURSE_SERVICE.createCourse(course),
    onMutate: (newCourseInfo) => {
      queryClient.setQueryData(["courses"], (prevCourses = []) => [
        ...prevCourses,
        { ...newCourseInfo, id: crypto.randomUUID() },
      ]);
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId) => COURSE_SERVICE.deleteCourse(courseId),
    onMutate: (courseId) => {
      queryClient.setQueryData(["courses"], (prevCourses = []) =>
        prevCourses.filter((course) => course.id !== courseId)
      );
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: (course) => COURSE_SERVICE.updateCourse(course),
    onMutate: (newCourseInfo) => {
      queryClient.setQueryData(["courses"], (prevCourses = []) =>
        prevCourses.map((course) =>
          course.id === newCourseInfo.id ? newCourseInfo : course
        )
      );
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Course Title",
        muiEditTextFieldProps: {
          type: "string",
          required: true,
          error: !!validationErrors?.title,
          helperText: validationErrors?.title,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              title: undefined,
            }),
        },
      },
      {
        accessorKey: "teacher",
        header: "Course Teacher",
        muiEditTextFieldProps: {
          type: "string",
          required: true,
          error: !!validationErrors?.teacher,
          helperText: validationErrors?.teacher,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              teacher: undefined,
            }),
        },
      },
      {
        accessorKey: "duration",
        header: "Course Duration (Hrs)",
        muiEditTextFieldProps: {
          type: "number",
          required: true,
          error: !!validationErrors?.duration,
          helperText: validationErrors?.duration,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              duration: undefined,
            }),
        },
      },
      {
        accessorKey: "price",
        header: "price ($)",
        muiEditTextFieldProps: {
          type: "number",
          required: true,
          error: !!validationErrors?.price,
          helperText: validationErrors?.price,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              price: undefined,
            }),
        },
      },
    ],
    [validationErrors]
  );

  const handleCreateCourse = ({ values, table }) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }
    setValidationErrors({});
    createCourseMutation.mutate(formData);
    table.setCreatingRow(null);
  };

  const handleSaveCourse = ({ values, table }) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }
    setValidationErrors({});
    updateCourseMutation.mutate(formData);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteCourseMutation.mutate(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchCourses,
    createDisplayMode: "row",
    editDisplayMode: "row",
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingCourses
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableContainerProps: {
      className: "min-h-[500px] rounded-lg shadow-lg overflow-hidden",
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateCourse,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveCourse,
    renderRowActions: ({ row, table }) => (
      <Box className="flex space-x-2">
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => table.setCreatingRow(true)}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        Create New Course
      </Button>
    ),
    state: {
      isLoading: isLoadingCourses,
      showAlertBanner: isLoadingCourses,
    },
  });

  return <MaterialReactTable table={table} />;
}
