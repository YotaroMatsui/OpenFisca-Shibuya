import { Birthday } from "./attributes/Birthday";
import { ChildrenNum } from "./attributes/ChildrenNum";
import { Income } from "./attributes/Income";
import { FormYourSpouse } from "./attributes/Spouse";
import { PhysicalDisability } from "./attributes/PhysicalDisability";
import { MentalDisability } from "./attributes/MentalDisability";
import { IntellectualDisability } from "./attributes/IntellectualDisability";

export const FormYou = () => {
  const yourName = "あなた";
  return (
    <>
      <h3>あなたについて</h3>
      <Birthday personName={yourName} />
      <Income personName={yourName} />
      <PhysicalDisability personName={yourName} />
      <MentalDisability personName={yourName} />
      <IntellectualDisability personName={yourName} />
      <ChildrenNum />
      <FormYourSpouse />
      <br></br>
    </>
  );
};
