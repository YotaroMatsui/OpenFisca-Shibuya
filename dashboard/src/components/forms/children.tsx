import { useContext } from "react";
import { YourselfContext } from "../../contexts/YourselfContext";
import { FormChild } from "./child";

export const FormChildren = () => {
  const { yourself, setYourself } = useContext(YourselfContext);
  return (
    <>
      {[...Array(yourself.子どもの数)].map((val, index) => (
        <FormChild childIndex={index} key={index} />
      ))}
    </>
  );
};
