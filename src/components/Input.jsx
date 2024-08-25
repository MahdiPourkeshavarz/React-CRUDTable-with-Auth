/* eslint-disable react/prop-types */
export const Input = ({ id, type, label, disabled }) => (
  <input
    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out disabled:opacity-50"
    type={type}
    id={id}
    placeholder={label}
    disabled={disabled}
  />
);
