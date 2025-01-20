import React from 'react';
import {
  BarChart3,
  PieChart,
  LineChart,
  ScatterChart,
  AreaChart,
} from 'lucide-react';

const visualizations = [
  { icon: BarChart3, label: 'Bar Chart', id: 'bar' },
  { icon: PieChart, label: 'Pie Chart', id: 'pie' },
  { icon: LineChart, label: 'Line Chart', id: 'line' },
  { icon: ScatterChart, label: 'Scatter Plot', id: 'scatter' },
  { icon: AreaChart, label: 'Area Chart', id: 'area' },
];

interface DataVizSelectorProps {
  onSelect: (vizType: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function DataVizSelector({ onSelect, isOpen, onClose }: DataVizSelectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-light mb-4">Select Visualization Type</h3>
        <div className="grid grid-cols-2 gap-4">
          {visualizations.map((viz) => (
            <button
              key={viz.id}
              onClick={() => {
                onSelect(viz.id);
                onClose();
              }}
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <viz.icon className="h-8 w-8 text-gray-600 mb-2" />
              <span className="text-sm">{viz.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}