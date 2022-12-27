import { RxDragHandleHorizontal } from "react-icons/rx";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { type TaskProps } from "../types";

export default function Task({ name, completed }: TaskProps) {
  return (
    <>
      <div
        className="flex shadow-sm bg-white rounded cursor-pointer hover:opacity-70 py-2 px-3"
        draggable
      >
        <span className="flex content-center">
          <RxDragHandleHorizontal className="mt-auto mb-auto"/>
        </span>
        <span className="grow pl-3 py-2">{name}</span>
        <button className="p-2 hover:text-red-500">
          <IoIosCloseCircleOutline />
        </button>
      </div>
    </>
  );
}
