/* eslint-disable react/prop-types */

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  number: yup
    .string()
    .required("Phone number is required")
    .typeError("Must be a number"),
  password: yup.string().when("mode", {
    is: "login",
    then: yup.string().required("Password is required"),
  }),
  createpassword: yup.string().when("mode", {
    is: "signup",
    then: yup.string().required("Password is required"),
  }),
  repeatpassword: yup
    .string()
    .oneOf([yup.ref("createpassword"), null], "Passwords must match"),
});

export const AuthenticationForm = ({ mode, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`transition-transform duration-500 ${
        mode === "login" ? "scale-100" : "scale-95"
      }`}
    >
      <div className="space-y-4">
        {mode === "login" && (
          <div className="form-group transition-opacity duration-500 space-y-4">
            <input
              type="number"
              id="string"
              placeholder="Phone Number"
              disabled={mode === "signup"}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out disabled:opacity-50"
              {...register("number")}
            />
            <p className="text-red-500">{errors.number?.message}</p>

            <input
              type="password"
              id="password"
              placeholder="Password"
              disabled={mode === "signup"}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out disabled:opacity-50"
              {...register("password")}
            />
            <p className="text-red-500">{errors.password?.message}</p>
          </div>
        )}

        {mode === "signup" && (
          <div className="form-group transition-opacity duration-500 space-y-4">
            <input
              type="string"
              id="number"
              placeholder="Phone Number"
              disabled={mode === "login"}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out disabled:opacity-50"
              {...register("number")}
            />
            <p className="text-red-500">{errors.number?.message}</p>

            <input
              type="password"
              id="createpassword"
              placeholder="Password"
              disabled={mode === "login"}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out disabled:opacity-50"
              {...register("createpassword")}
            />
            <p className="text-red-500">{errors.createpassword?.message}</p>

            <input
              type="password"
              id="repeatpassword"
              placeholder="Repeat Password"
              disabled={mode === "login"}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out disabled:opacity-50"
              {...register("repeatpassword")}
            />
            <p className="text-red-500">{errors.repeatpassword?.message}</p>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded transition duration-300 hover:bg-blue-700"
          type="submit"
        >
          {mode === "login" ? "Log In" : "Sign Up"}
        </button>
      </div>
    </form>
  );
};
