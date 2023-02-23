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
    setIsChecked((prev) => !prev);

    if (!isChecked) {
      const newHousehold = { ...household };
      newHousehold.世帯員[personName] = {
        誕生年月日: { ETERNITY: "" },
        所得: {
          [currentDate]: 0,
        },
        身体障害者手帳等級認定: { ETERNITY: "無" },
        // 身体障害者手帳交付年月日は入力作業を省略させるため昨年の日付を設定
        // (身体障害者手帳等級認定は身体障害者手帳交付年月日から2年以内が有効)
        身体障害者手帳交付年月日: { ETERNITY: lastYearDate },
        愛の手帳等級: { ETERNITY: "無" },
        精神障害者保健福祉手帳等級: { ETERNITY: "無" },
      };
      setHousehold({ ...newHousehold });
    }
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
