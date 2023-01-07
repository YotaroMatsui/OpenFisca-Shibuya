import { useCallback, useContext } from "react";
import { CurrentYearMonthContext } from "../../../contexts/CurrentYearMonthContext";
import { HouseholdContext } from "../../../contexts/HouseholdContext";

export const Income = ({ personName }: { personName: string }) => {
  const currentYearMonth = useContext(CurrentYearMonthContext);
  const { household, setHousehold } = useContext(HouseholdContext);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newHousehold = {
      ...household,
    };

    // 「万円」単位を「円」に換算
    let income = parseInt(event.currentTarget.value) * 10000;
    // 正の整数以外は0に変換
    if (isNaN(income) || income < 0) {
      income = 0;
    }

    newHousehold.世帯員[personName].所得[currentYearMonth] = income;
    setHousehold(newHousehold);
  }, []);

  return (
    <div className="input-group input-group-lg mb-3">
      <span className="input-group-text">年収</span>
      <input
        name="年収"
        className="form-control"
        type="number"
        value={household.世帯員[personName].所得[currentYearMonth] / 10000}
        onChange={onChange}
      />
      <span className="input-group-text">万円</span>
    </div>
  );
};
