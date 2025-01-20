import React, { useState, useRef } from 'react';
import { Sidebar } from '../components/editor/Sidebar';
import { Pencil, Trash2, PieChart, Activity, Users, Image, Upload, Heart, Star, Zap, Trophy, Target, Lightbulb, Flag, Rocket } from 'lucide-react';

interface DataPoint {
  id: string;
  title: string;
  description: string;
  type: 'pie' | 'progress' | 'pictogram' | 'image';
  value?: number;
  imageFile?: File;
  imageUrl?: string;
  pictogram?: {
    icon: string;
    color: string;
  };
}

interface DataVizTemplateProps {
  pageTitle: string;
}

const pictogramOptions = [
  { icon: Heart, label: 'Heart' },
  { icon: Star, label: 'Star' },
  { icon: Zap, label: 'Energy' },
  { icon: Trophy, label: 'Trophy' },
  { icon: Target, label: 'Target' },
  { icon: Lightbulb, label: 'Idea' },
  { icon: Flag, label: 'Flag' },
  { icon: Rocket, label: 'Growth' },
];

const colorOptions = [
  { value: '#000000', label: 'Black' },
  { value: '#EF4444', label: 'Red' },
  { value: '#F59E0B', label: 'Orange' },
  { value: '#10B981', label: 'Green' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#6366F1', label: 'Indigo' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
];

export function DataVizTemplate({ pageTitle }: DataVizTemplateProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [vizType, setVizType] = useState<'pie' | 'progress' | 'pictogram' | 'image'>('pie');
  const [value, setValue] = useState(0);
  const [selectedPictogram, setSelectedPictogram] = useState<typeof pictogramOptions[0]>();
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [dataPoint, setDataPoint] = useState<DataPoint | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDataPoint = {
      id: Math.random().toString(),
      title,
      description,
      type: vizType,
      value: vizType === 'pictogram' ? undefined : value,
      pictogram: vizType === 'pictogram' ? {
        icon: selectedPictogram?.label || '',
        color: selectedColor.value
      } : undefined
    };
    setDataPoint(newDataPoint);
    setTitle('');
    setDescription('');
    setValue(0);
    setSelectedPictogram(undefined);
    setSelectedColor(colorOptions[0]);
  };

  const handleEdit = () => {
    if (!dataPoint) return;
    setTitle(dataPoint.title);
    setDescription(dataPoint.description);
    setVizType(dataPoint.type);
    if (dataPoint.value !== undefined) setValue(dataPoint.value);
    if (dataPoint.pictogram) {
      setSelectedPictogram(pictogramOptions.find(p => p.label === dataPoint.pictogram?.icon));
      setSelectedColor(colorOptions.find(c => c.value === dataPoint.pictogram?.color) || colorOptions[0]);
    }
  };

  const handleDelete = () => {
    setDataPoint(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFiles(Array.from(files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(Array.from(files));
  };

  const handleFiles = (files: File[]) => {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newDataPoint = {
          id: Math.random().toString(),
          title,
          description,
          type: 'image' as const,
          imageUrl: url
        };
        setDataPoint(newDataPoint);
        setTitle('');
        setDescription('');
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPieChart = (value: number) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progress = ((100 - value) / 100) * circumference;

    return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="64"
            cy="64"
          />
          <circle
            className="text-black"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="64"
            cy="64"
          />
        </svg>
        <span className="absolute text-xl font-medium">{value}%</span>
      </div>
    );
  };

  const renderProgressBar = (value: number) => (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-black transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  const renderPictogram = (iconName: string, color: string) => {
    const IconComponent = pictogramOptions.find(p => p.label === iconName)?.icon;
    if (!IconComponent) return null;
    
    return <IconComponent className="h-12 w-12" style={{ color }} />;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-light text-gray-900">{pageTitle}</h1>
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visualization Type
                </label>
                <div className="grid grid-cols-4 gap-4">
                  <button
                    type="button"
                    onClick={() => setVizType('pie')}
                    className={`p-4 border rounded-lg flex flex-col items-center ${
                      vizType === 'pie' ? 'border-black bg-gray-50' : 'border-gray-200'
                    }`}
                  >
                    <PieChart className="h-6 w-6 mb-2" />
                    <span>Circular Chart</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVizType('progress')}
                    className={`p-4 border rounded-lg flex flex-col items-center ${
                      vizType === 'progress' ? 'border-black bg-gray-50' : 'border-gray-200'
                    }`}
                  >
                    <Activity className="h-6 w-6 mb-2" />
                    <span>Progress Bar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVizType('pictogram')}
                    className={`p-4 border rounded-lg flex flex-col items-center ${
                      vizType === 'pictogram' ? 'border-black bg-gray-50' : 'border-gray-200'
                    }`}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    <span>Pictogram Chart</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVizType('image')}
                    className={`p-4 border rounded-lg flex flex-col items-center ${
                      vizType === 'image' ? 'border-black bg-gray-50' : 'border-gray-200'
                    }`}
                  >
                    <Image className="h-6 w-6 mb-2" />
                    <span>Custom Image</span>
                  </button>
                </div>
              </div>

              {vizType === 'pictogram' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Icon
                    </label>
                    <div className="grid grid-cols-4 gap-4">
                      {pictogramOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => setSelectedPictogram(option)}
                            className={`p-4 border rounded-lg flex flex-col items-center ${
                              selectedPictogram?.label === option.label ? 'border-black bg-gray-50' : 'border-gray-200'
                            }`}
                          >
                            <Icon 
                              className="h-6 w-6 mb-2"
                              style={{ color: selectedColor.value }}
                            />
                            <span className="text-sm">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon Color
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            selectedColor.value === color.value ? 'border-black' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.value }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : vizType === 'image' ? (
                <div>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${
                      isDragging ? 'border-black bg-gray-50' : 'border-gray-300'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <label className="block">
                      <span className="btn-primary inline-block cursor-pointer">
                        Select Image
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      or drag and drop your image here
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="input-field"
                    required
                  />
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="p-4 border rounded-lg">
                      {vizType === 'pie' && renderPieChart(value)}
                      {vizType === 'progress' && renderProgressBar(value)}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short description of the indicator
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                {title ? 'Update Visualization' : 'Add Visualization'}
              </button>
            </form>

            {dataPoint && (
              <div className="bg-white rounded-lg border p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{dataPoint.title}</h3>
                    <p className="text-sm text-gray-600">{dataPoint.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEdit}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-center items-center min-h-[120px]">
                  {dataPoint.type === 'pie' && renderPieChart(dataPoint.value || 0)}
                  {dataPoint.type === 'progress' && renderProgressBar(dataPoint.value || 0)}
                  {dataPoint.type === 'pictogram' && dataPoint.pictogram && (
                    <div className="flex justify-center">
                      {renderPictogram(dataPoint.pictogram.icon, dataPoint.pictogram.color)}
                    </div>
                  )}
                  {dataPoint.type === 'image' && dataPoint.imageUrl && (
                    <img
                      src={dataPoint.imageUrl}
                      alt={dataPoint.title}
                      className="max-h-32 object-contain"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}