// Honestly a crazy solution to this problem hahahaha...but it works
import { uniqueId } from "lodash";
import React, { useEffect, useState } from "react";
import { Select, SelectProps } from "@material-tailwind/react";

const AsyncSelect = React.forwardRef((props: SelectProps, ref: any) => {
  const [key, setKey] = useState("");
  const { children } = props; // Add this line to declare the 'children' variable

  useEffect(() => setKey(uniqueId()), [props]);

  return (
    <Select key={key} ref={ref} {...props}>
      {children}
    </Select>
  );
});

AsyncSelect.displayName = "AsyncSelect";

export default AsyncSelect;
