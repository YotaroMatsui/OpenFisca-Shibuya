import { Birthday } from "./attributes/Birthday";
import { ChildrenNum } from "./attributes/ChildrenNum";
import { Income } from "./attributes/Income";
import { FormYourSpouse } from "./attributes/Spouse";

export const FormYou = () => {
  const yourName = "あなた";
  return (
    <>
      <h3>あなたについて</h3>
      <Birthday personName={yourName} />
      <Income personName={yourName} />
      <ChildrenNum />
      <FormYourSpouse />
      <br></br>
    </>
  );
};
