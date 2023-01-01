import { useCallback, useContext } from "react";
import { HouseholdContext } from "../../contexts/HouseholdContext";
import { FormYourChild } from "./your/FormYourChild";
import { FormYourIncome } from "./your/FormYourIncome";
import { FormYourMentalDisability } from "./your/FormYourMentalDisability";
import { FormYourPhysicalDisability } from "./your/FormYourPhysicalDisability";
import { FormYourSpouse } from "./your/FormYourSpouse";

export const FormChild = ({ childIndex }: { childIndex: number }) => {
  const { household, setHousehold } = useContext(HouseholdContext);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    const newHousehold = {
      ...household,
    };
    newHousehold.世帯員[`子ども${childIndex}`]["誕生年月日"] = {
      ETERNITY: event.currentTarget.value,
    };
    setHousehold(newHousehold);
  }, []);

  return (
    <>
      <h3>{childIndex + 1}人目の子ども</h3>
      <div className="input-group input-group-lg mb-3">
        <span className="input-group-text">生年月日</span>
        <input
          name={`子ども${childIndex}の生年月日`}
          className="form-control"
          type="date"
          value={household.世帯員[`子ども${childIndex}`].誕生年月日.ETERNITY}
          onChange={onChange}
        />
      </div>
      <FormYourIncome />
      <FormYourPhysicalDisability />
      <FormYourMentalDisability />
      <FormYourSpouse />
      <br></br>
    </>
  );
};
