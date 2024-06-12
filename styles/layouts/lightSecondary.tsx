import { ReactNode } from "react";

import { LayoutInterface } from "./layouts";

const lightSecondary = ({
  children,
  data,
}: {
  children: ReactNode;
  data: LayoutInterface;
}) => {
  return (
    <div>
      <h1>hi this is layout 2</h1>
      <p>another paragraph</p>
      {children}
      {`This is the second sample site name: ${data.name}`}
    </div>
  );
};

export default lightSecondary;
