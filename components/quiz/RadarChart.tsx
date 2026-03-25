"use client";
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface RadarChartProps {
  cuerpo: number;
  mente: number;
  espiritu: number;
}

export default function RadarChart({ cuerpo, mente, espiritu }: RadarChartProps) {
  const data = [
    { subject: "Cuerpo", value: cuerpo },
    { subject: "Mente", value: mente },
    { subject: "Espíritu", value: espiritu },
  ];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadar data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <Radar name="Bienestar" dataKey="value" stroke="#D4A017" fill="#D4A017" fillOpacity={0.3} />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
