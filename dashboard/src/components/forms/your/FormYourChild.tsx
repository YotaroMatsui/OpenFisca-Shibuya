import { useCallback, useContext } from "react";
import { YourselfContext } from "../../../contexts/YourselfContext";
import { HouseholdContext } from "../../../contexts/HouseholdContext";

export const FormYourChild = () => {
  const yearMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
  const { yourself, setYourself } = useContext(YourselfContext);
  const { household, setHousehold } = useContext(HouseholdContext);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    let childrenNum = parseInt(event.currentTarget.value);
    // 正の整数以外は0に変換
    if (isNaN(childrenNum) || childrenNum < 0) {
      childrenNum = 0;
    }
    const newYourself = Object.assign(yourself, {
      子どもの数: childrenNum,
    });
    setYourself({ ...newYourself });

    // 世帯情報を更新
    let newHousehold = { ...household };

    for (let i = 0; i < childrenNum; i++) {
      /*
      const childName = `子ども${i}`;
      newHousehold = {
        ...newHousehold,
        世帯員: {
          ...newHousehold.世帯員,
          [childName]: {},
        },
      };
      */
      newHousehold.世帯員[`子ども${i}`] = {
        誕生年月日: { ETERNITY: "" },
      };
    }

    newHousehold.世帯.世帯1.児童一覧 = [...Array(childrenNum)].map(
      (val, i) => `子ども${i}`
    );
    console.log(newHousehold);
    setHousehold({ ...newHousehold });
  }, []);

  return (
    <div className="input-group input-group-lg mb-3">
      <span className="input-group-text">子どもの数</span>
      <input
        name="子どもの数"
        className="form-control"
        type="number"
        value={yourself.子どもの数}
        onChange={onChange}
      />
      <span className="input-group-text">人</span>
    </div>
  );
};
