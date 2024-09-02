/* eslint-disable no-unused-vars */

import { useMemo, useState } from "react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@tanstack/react-query";
import { useGetCourses } from "../hooks/useGetCourses";
import { COURSE_SERVICE } from "../services/courseServices";
import { queryClient } from "../lib/reactQueryConfig";
import { convertToFormData, defaultValueCourse } from "../utils/formDataUtils";

export function CourseTable() {
  const [validationErrors, setValidationErrors] = useState({});
  const [courseData, setCourseData] = useState(defaultValueCourse);

  const {
    data: fetchedCourses = [],
    isLoading: isLoadingCourses,
    isError: isLoadingCoursesError,
    isFetching: isFetchingCourses,
  } = useGetCourses();

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
    onSuccess: (courseId) => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
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

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setCourseData((prev) => ({
      ...prev,
      upload_images: [imageFile],
    }));
  };

  const { isPending: isCreatingCourse } = createCourseMutation;

  const { isPending: isUpdatingCourse } = updateCourseMutation;

  const { isPending: isDeletingCourse } = deleteCourseMutation;

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        enableEditing: false,
        size: 80,
      },
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
    const formData = convertToFormData(courseData);
    setValidationErrors({});
    createCourseMutation.mutate(formData);
    table.setCreatingRow(null);
  };

  const handleSaveCourse = ({ values, table }) => {
    const formData = convertToFormData(courseData);
    setValidationErrors({});
    updateCourseMutation.mutate({ id: courseData.id, data: formData });
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      console.log(row.original.id);
      deleteCourseMutation.mutate(row.original.id);
    }
  };

  const renderDialogContent = ({ table, isEditing }) => (
    <>
      <DialogTitle variant="h3">
        {isEditing ? "Edit Course" : "Create New Course"}
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <TextField
          label="Title"
          value={courseData.title}
          onChange={handleChange("title")}
          fullWidth
        />
        <TextField
          label="Teacher"
          value={courseData.teacher}
          onChange={handleChange("teacher")}
          fullWidth
        />
        <TextField
          label="Duration"
          type="number"
          value={courseData.duration}
          onChange={handleChange("duration")}
          fullWidth
        />
        <TextField
          label="Price"
          type="number"
          value={courseData.price}
          onChange={handleChange("price")}
          fullWidth
        />
        {/* Add more fields as needed */}
        <input
          type="file"
          accept="image/jpeg"
          onChange={handleImageChange}
          style={{ marginTop: "1rem" }}
        />
      </DialogContent>
      <DialogActions>
        <MRT_EditActionButtons variant="text" table={table} />
      </DialogActions>
    </>
  );

  const table = useMaterialReactTable({
    columns,
    data: fetchedCourses.data ?? [],
    createDisplayMode: "modal", //default ('row', and 'custom' are also available)
    editDisplayMode: "modal", //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingCoursesError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateCourse,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveCourse,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New User</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <TextField
            label="Title"
            value={courseData.title}
            onChange={handleChange("title")}
            fullWidth
          />
          <TextField
            label="Teacher"
            value={courseData.teacher}
            onChange={handleChange("teacher")}
            fullWidth
          />
          <TextField
            label="Duration"
            type="number"
            value={courseData.duration}
            onChange={handleChange("duration")}
            fullWidth
          />
          <TextField
            label="Price"
            type="number"
            value={courseData.price}
            onChange={handleChange("price")}
            fullWidth
          />
          {/* Add more fields as needed */}
          <input
            type="file"
            accept="image/jpeg"
            onChange={handleImageChange}
            style={{ marginTop: "1rem" }}
          />
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit User</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <TextField
            label="Title"
            value={courseData.title}
            onChange={handleChange("title")}
            fullWidth
          />
          <TextField
            label="Teacher"
            value={courseData.teacher}
            onChange={handleChange("teacher")}
            fullWidth
          />
          <TextField
            label="Duration"
            type="number"
            value={courseData.duration}
            onChange={handleChange("duration")}
            fullWidth
          />
          <TextField
            label="Price"
            type="number"
            value={courseData.price}
            onChange={handleChange("price")}
            fullWidth
          />
          {/* Add more fields as needed */}
          <input
            type="file"
            accept="image/jpeg"
            onChange={handleImageChange}
            style={{ marginTop: "1rem" }}
          />
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
              setCourseData(row.original);
              console.log(row.original);
              table.setEditingRow(row);
            }}
          >
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
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Create New User
      </Button>
    ),
    state: {
      isLoading: isLoadingCourses,
      isSaving: isCreatingCourse || isUpdatingCourse || isDeletingCourse,
      showAlertBanner: isLoadingCoursesError,
      showProgressBars: isLoadingCourses,
    },
  });

  return <MaterialReactTable table={table} />;
}
