import React from "react";

export const InputContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="bg-gray-200 rounded-lg flex flex-col p-2">
      {children}
    </div>
  );
};
