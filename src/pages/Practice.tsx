// src/pages/Practice.tsx

import { RiskTrainer } from "@/components/practice/RiskTrainer";
import { CandlesTrainer } from "@/components/practice/CandlesTrainer";
import { PatternLab } from "@/components/practice/PatternLab";

const PracticePage = () => {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Practice Hub</h1>

      <div className="flex flex-wrap justify-center gap-8">
        <RiskTrainer />
        <CandlesTrainer />
      </div>

      <div>
        <PatternLab />
      </div>
    </div>
  );
};

export default PracticePage;