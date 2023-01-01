import { useContext, useEffect } from "react";
import { HouseholdContext } from "../contexts/HouseholdContext";
import { useCalculate } from "../hooks/calculate";
import { FormYou } from "./forms/you";
import { FormChildren } from "./forms/children";

export const OpenFiscaForm = () => {
  const result = useCalculate();

  return (
    <div>
      <h2>試す</h2>
      <form>
        <FormYou />
        <FormChildren />
      </form>
      <h2>結果</h2>
      {result && <pre>{JSON.stringify(result.世帯.世帯1, null, 2)}</pre>}
    </div>
  );
};
