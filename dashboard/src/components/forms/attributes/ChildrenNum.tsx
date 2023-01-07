import { useCallback, useContext } from "react";
import { CurrentYearMonthContext } from "../../../contexts/CurrentYearMonthContext";
import { YourselfContext } from "../../../contexts/YourselfContext";
import { HouseholdContext } from "../../../contexts/HouseholdContext";

export const ChildrenNum = () => {
  const lastYearDate = `${new Date().getFullYear() - 1}-${(
    new Date().getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-01`;
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

    // 変更前の子どもの情報を削除
    const newHousehold = { ...household };
    if (household.世帯.世帯1.児童一覧) {
      household.世帯.世帯1.児童一覧.map((childName: string) => {
        delete newHousehold.世帯員[childName];
      });
    }

    // 新しい子どもの情報を追加
    newHousehold.世帯.世帯1.児童一覧 = [...Array(childrenNum)].map(
      (val, i) => `子ども${i}`
    );
    if (newHousehold.世帯.世帯1.児童一覧) {
      newHousehold.世帯.世帯1.児童一覧.map((childName: string) => {
        newHousehold.世帯員[childName] = {
          誕生年月日: { ETERNITY: "" },
          身体障害者手帳等級認定: { ETERNITY: "無" },
          // 身体障害者手帳交付年月日は入力作業を省略させるため昨年の日付を設定
          // (身体障害者手帳等級認定は身体障害者手帳交付年月日から2年以内が有効)
          身体障害者手帳交付年月日: { ETERNITY: lastYearDate },
        };
      });
    }
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
