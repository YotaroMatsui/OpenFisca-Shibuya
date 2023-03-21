import { useState, useCallback, useContext, useEffect } from "react";
import { PhysicalDisability } from "./PhysicalDisability";
import { MentalDisability } from "./MentalDisability";
import { IntellectualDisability } from "./IntellectualDisability";
import { HouseholdContext } from "../../../contexts/HouseholdContext";
import { CurrentDateContext } from "../../../contexts/CurrentDateContext";

export const Disability = ({ personName }: { personName: string }) => {
  const currentDate = useContext(CurrentDateContext);
  const [isChecked, setIsChecked] = useState(false);
  const { household, setHousehold } = useContext(HouseholdContext);

  const lastYearDate = `${new Date().getFullYear() - 1}-${(
    new Date().getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-01`;

  // チェックボックスの値が変更された時
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      const newHousehold = { ...household };
      newHousehold.世帯員[personName].身体障害者手帳等級認定.ETERNITY = "無";
      newHousehold.世帯員[personName].愛の手帳等級.ETERNITY = "無";
      newHousehold.世帯員[personName].精神障害者保健福祉手帳等級.ETERNITY =
        "無";
      setHousehold({ ...newHousehold });
    }

    setIsChecked(event.target.checked);
  }, []);

  return (
    <>
      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={isChecked}
          id="flexCheckDefault"
          onChange={onChange}
        />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          障害者手帳を持っている
        </label>
      </div>
      {isChecked && (
        <>
          <PhysicalDisability personName={personName} />
          <MentalDisability personName={personName} />
          <IntellectualDisability personName={personName} />
        </>
      )}

      <br></br>
    </>
  );
};
