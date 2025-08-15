"use client";

interface ButtonProps {
  output: string;
}

const Button: React.FC<ButtonProps> = ({ output }) => {
  return (
    <button
      className="items-center justify-between cursor-pointer rounded-lg border bg-gray-50 hover:bg-gray-100 p-2 my-2"
      onClick={() => {}}
    >
      Click Here
    </button>
  );
};

export default Button;
