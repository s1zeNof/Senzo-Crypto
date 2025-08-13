// src/pages/Practice.tsx

import { RiskTrainer } from "@/components/practice/RiskTrainer";

const PracticePage = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Practice Hub</h1>
      <div className="flex justify-center">
        <RiskTrainer />
      </div>
      
      {/* В майбутньому тут будуть інші тренажери:
        <CandlesTrainer />
        <PatternLab />
      */}
    </div>
  );
};

export default PracticePage;