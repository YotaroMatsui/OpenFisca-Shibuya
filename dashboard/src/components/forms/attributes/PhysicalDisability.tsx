import { useState, useCallback, useContext, useEffect } from "react";
import { HouseholdContext } from "../../../contexts/HouseholdContext";

export const PhysicalDisability = ({ personName }: { personName: string }) => {
  const { household, setHousehold } = useContext(HouseholdContext);

  // ラベルとOpenFiscaの表記違いを明記(pythonは数字を頭にした変数名をつけられない)
  const items = [
    ["なし", "無"],
    ["1級", "一級"],
    ["2級", "二級"],
    ["3級", "三級"],
  ];
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  // ラジオボタンの値が変更された時
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedItemIndex(parseInt(event.currentTarget.value));
    const newHousehold = { ...household };
    newHousehold.世帯員[personName].身体障害者手帳等級認定.ETERNITY =
      items[parseInt(event.currentTarget.value)][1];
    setHousehold({ ...newHousehold });
  }, []);

  // 「あなた」の「子どもの数」が変更されたときに全ての子どもの身体障害者手帳等級が「無」に
  // リセットされるため、チェックボックスも「なし」に戻す
  useEffect(() => {
    if (household.世帯員[personName].身体障害者手帳等級認定) {
      items.map((item, index) => {
        if (
          item[1] ===
          household.世帯員[personName].身体障害者手帳等級認定.ETERNITY
        ) {
          setSelectedItemIndex(index);
        }
      });
    }
  }, [household.世帯員[personName].身体障害者手帳等級認定]);

  return (
    <div className="input-group input-group-lg mb-3">
      <label className="me-3">身体障害者手帳</label>
      {items.map((item, index) => {
        return (
          <div className="form-check form-check-inline" key={item[0]}>
            <input
              className="form-check-input"
              id={item[0]}
              type="radio"
              value={index}
              onChange={onChange}
              checked={index === selectedItemIndex}
            />
            <label htmlFor={item[0]}>{item[0]}</label>
          </div>
        );
      })}
    </div>
  );
};
