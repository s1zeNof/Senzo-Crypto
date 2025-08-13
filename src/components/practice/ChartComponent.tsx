// src/components/practice/ChartComponent.tsx

import {
  createChart,
  ColorType,
  IChartApi,
  CandlestickData,
} from 'lightweight-charts';
import { useRef, useEffect } from 'react';

export type ChartProps = {
  data: CandlestickData[];
};

const ChartComponent = (props: ChartProps) => {
  const { data } = props;
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Перевіряємо, чи існує елемент для монтування
    if (!chartContainerRef.current) {
      return;
    }

    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: '#131722' },
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
    };

    // Створюємо графік
    const chart: IChartApi = createChart(chartContainerRef.current, chartOptions);

    // --- Важливий крок для діагностики ---
    console.log('Chart object created:', chart); 

    // Перевіряємо, чи існує метод, перш ніж його викликати
    if (typeof chart.addCandlestickSeries !== 'function') {
      console.error('CRITICAL: chart.addCandlestickSeries is not a function!');
      return;
    }

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
    });

    candleSeries.setData(data);
    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    // Функція очищення
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]); // Залежність від `data` гарантує оновлення при зміні даних

  return <div ref={chartContainerRef} className="w-full h-[500px]" />;
};

export default ChartComponent;