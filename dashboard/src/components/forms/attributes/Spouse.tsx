import { useState, useCallback, useContext, useEffect } from "react";
import { HouseholdContext } from "../../../contexts/HouseholdContext";

export const Spouse = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { household, setHousehold } = useContext(HouseholdContext);

  // チェックボックスの値が変更された時
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked((prev) => !prev);

    // TODO: ChildrenNum.tsxを参考に配偶者情報を追加する
  }, []);

  return (
    <>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={isChecked}
          id="flexCheckDefault"
          onChange={onChange}
        />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          配偶者がいる
        </label>
      </div>
    </>
  );
};
