import { useCallback, useContext } from "react";
import { HouseholdContext } from "../../../contexts/HouseholdContext";

export const Birthday = ({ personName }: { personName: string }) => {
  const { household, setHousehold } = useContext(HouseholdContext);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newHousehold = {
      ...household,
    };
    newHousehold.世帯員[personName]["誕生年月日"].ETERNITY =
      event.currentTarget.value;
    setHousehold(newHousehold);
  }, []);

  return (
    <div className="input-group input-group-lg mb-3">
      <span className="input-group-text">生年月日</span>
      <input
        name={"生年月日"}
        className="form-control"
        type="date"
        value={household.世帯員[personName].誕生年月日.ETERNITY}
        max="2999-12-31"
        onChange={onChange}
      />
    </div>
  );
};
