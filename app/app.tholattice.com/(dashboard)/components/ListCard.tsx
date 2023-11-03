"use client";

import { useRouter, usePathname } from "next/navigation";

import { BsPersonFill } from "react-icons/bs";
import DropdownMenu from "./DropdownMenu";

interface ListCardProps {
  id: string;
  name: string | null | undefined;
  email: string | null;
  recentPayment?: string | null;
  status: string;
}

const ListCard: React.FC<ListCardProps> = ({
  id,
  name,
  email,
  recentPayment,
  status,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClickSafely = (e: { stopPropagation: () => void }) => {
    if (e && e.stopPropagation) e.stopPropagation();
  };

  return (
    <li
      id={id}
      className="bg-gray-50 hover:bg-gray-100 transition rounded-lg my-3 p-2 grid grid-cols-2 items-center justify-between cursor-pointer sm:grid-cols-4 lg:grid-cols-5"
      onClick={() => router.push(`${pathname}/${id}`)}
    >
      <div className="flex items-center">
        <div className="bg-stone-100 p-3 rounded-lg">
          <BsPersonFill className="text-stone-800" />
        </div>
        <p className="pl-4">{name}</p>
      </div>
      <p className="hidden text-gray-600 lg:flex lg:justify-start">{email}</p>
      <p className="hidden text-gray-600 sm:flex">{recentPayment}</p>
      {/* <div> */}
      <p className="hidden text-gray-600 sm:flex sm:text-right sm:justify-center">
        {status}
      </p>
      <div className="text-gray-600 text-right fixed right-12">
        {/* <div className="sm:text-left text-right fixed"> */}
        <DropdownMenu onClick={handleClickSafely} custID={id} />
      </div>
    </li>
  );
};

export default ListCard;
