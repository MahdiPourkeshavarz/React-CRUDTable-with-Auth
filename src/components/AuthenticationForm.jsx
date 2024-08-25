/* eslint-disable react/prop-types */
import { Input } from "./Input";

export const AuthenticationForm = ({ mode, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`transition-transform duration-500 ${
        mode === "login" ? "scale-100" : "scale-95"
      }`}
    >
      <div className="space-y-4">
        <div
          className={`form-group transition-opacity duration-500 space-y-4 ${
            mode === "login" ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <Input
            type="text"
            id="username"
            label="User Name"
            disabled={mode === "signup"}
          />
          <Input
            type="password"
            id="password"
            label="Password"
            disabled={mode === "signup"}
          />
        </div>
        <div
          className={`form-group transition-opacity duration-500 space-y-4 ${
            mode === "signup" ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <Input
            type="text"
            id="fullname"
            label="Full Name"
            disabled={mode === "login"}
          />
          <Input
            type="email"
            id="email"
            label="Email"
            disabled={mode === "login"}
          />
          <Input
            type="password"
            id="createpassword"
            label="Password"
            disabled={mode === "login"}
          />
          <Input
            type="password"
            id="repeatpassword"
            label="Repeat Password"
            disabled={mode === "login"}
          />
        </div>
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
