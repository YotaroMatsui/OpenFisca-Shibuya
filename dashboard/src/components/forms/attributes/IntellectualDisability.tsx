import { useState, useCallback, useContext, useEffect } from "react";
import { HouseholdContext } from "../../../contexts/HouseholdContext";

export const IntellectualDisability = ({
  personName,
}: {
  personName: string;
}) => {
  const { household, setHousehold } = useContext(HouseholdContext);

  // ラベルとOpenFiscaの表記違いを明記
  const items = [
    ["なし", "無"],
    ["A", "A"],
    ["B", "B"],
  ];
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  // コンボボックスの値が変更された時
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedItemIndex(parseInt(event.currentTarget.value));
      const newHousehold = { ...household };
      newHousehold.世帯員[personName].療育手帳等級.ETERNITY =
        items[parseInt(event.currentTarget.value)][1];
      setHousehold({ ...newHousehold });
    },
    []
  );

  // 「あなた」の「子どもの数」が変更されたときに全ての子どもの療育手帳等級が「無」に
  // リセットされるため、コンボボックスも空白に戻す
  useEffect(() => {
    if (household.世帯員[personName].療育手帳等級) {
      items.map((item, index) => {
        if (item[1] === household.世帯員[personName].療育手帳等級.ETERNITY) {
          setSelectedItemIndex(index);
        }
      });
    }
  }, [household.世帯員[personName].療育手帳等級]);

  return (
    <div className="mb-3">
      <label className="me-3">愛の手帳（療育手帳）</label>
      <br />
      <select
        value={selectedItemIndex}
        className="form-select"
        onChange={onChange}
      >
        {items.map((item, index) => (
          <option value={index} key={index}>
            {item[0]}
          </option>
        ))}
      </select>
    </div>
  );
};
