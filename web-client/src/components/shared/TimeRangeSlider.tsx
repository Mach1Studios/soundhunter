import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TimeRangeSliderProps {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  onTimeRangeChange: (startTime: string, endTime: string) => void;
  className?: string;
  timezoneLabel?: string;
}

const TimeRangeSlider: React.FC<TimeRangeSliderProps> = ({
  startTime,
  endTime,
  onTimeRangeChange,
  className = '',
  timezoneLabel = 'UTC'
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'start' | 'end' | 'bar' | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [customSpan, setCustomSpan] = useState<string>('');

  // Convert HH:MM to minutes since midnight
  const timeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Convert minutes since midnight to HH:MM
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  // Calculate positions as percentages
  const startPercent = (startMinutes / 1440) * 100;
  const endPercent = (endMinutes / 1440) * 100;
  const barWidth = endPercent - startPercent;

  // Format time range for display
  const formatTimeRange = () => {
    const duration = endMinutes - startMinutes;
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Parse custom span input (supports formats like "30", "30m", "1h", "1h 30m", "90m")
  const parseCustomSpan = (input: string): number | null => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return null;

    // Just a number (assume minutes)
    if (/^\d+$/.test(trimmed)) {
      return parseInt(trimmed);
    }

    // Format like "30m", "90m"
    const minutesMatch = trimmed.match(/^(\d+)m$/);
    if (minutesMatch) {
      return parseInt(minutesMatch[1]);
    }

    // Format like "2h", "1h"
    const hoursMatch = trimmed.match(/^(\d+)h$/);
    if (hoursMatch) {
      return parseInt(hoursMatch[1]) * 60;
    }

    // Format like "1h 30m", "2h 15m"
    const hoursMinutesMatch = trimmed.match(/^(\d+)h\s*(\d+)m$/);
    if (hoursMinutesMatch) {
      return parseInt(hoursMinutesMatch[1]) * 60 + parseInt(hoursMinutesMatch[2]);
    }

    return null;
  };

  const handleCustomSpanApply = () => {
    const spanMinutes = parseCustomSpan(customSpan);
    if (spanMinutes && spanMinutes >= 5 && spanMinutes <= 720) { // 5 minutes to 12 hours
      const currentCenter = (startMinutes + endMinutes) / 2;
      const rawNewStart = Math.max(0, currentCenter - spanMinutes / 2);
      const rawNewEnd = Math.min(1440, currentCenter + spanMinutes / 2);
      
      // Snap to 5-minute intervals
      const newStart = Math.round(rawNewStart / 5) * 5;
      const newEnd = Math.round(rawNewEnd / 5) * 5;
      
      onTimeRangeChange(minutesToTime(newStart), minutesToTime(newEnd));
      setCustomSpan(''); // Clear input after applying
    }
  };

  const handleCustomSpanKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCustomSpanApply();
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'start' | 'end' | 'bar') => {
    e.preventDefault();
    setIsDragging(type);
    
    if (type === 'bar' && sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const barStart = (startPercent / 100) * rect.width;
      setDragOffset(clickX - barStart);
    } else {
      setDragOffset(0);
    }
  }, [startPercent]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const rawMinutes = (percent / 100) * 1440;
    
    // Round to nearest 5-minute interval
    const newMinutes = Math.round(rawMinutes / 5) * 5;

    if (isDragging === 'start') {
      const newStartMinutes = Math.min(newMinutes, endMinutes - 15); // Minimum 15 min span (3 x 5-min intervals)
      const snappedStartMinutes = Math.round(newStartMinutes / 5) * 5;
      onTimeRangeChange(minutesToTime(snappedStartMinutes), endTime);
    } else if (isDragging === 'end') {
      const newEndMinutes = Math.max(newMinutes, startMinutes + 15); // Minimum 15 min span (3 x 5-min intervals)
      const snappedEndMinutes = Math.round(newEndMinutes / 5) * 5;
      onTimeRangeChange(startTime, minutesToTime(snappedEndMinutes));
    } else if (isDragging === 'bar') {
      const barStartX = clickX - dragOffset;
      const barStartPercent = Math.max(0, Math.min(100 - barWidth, (barStartX / rect.width) * 100));
      const rawStartMinutes = (barStartPercent / 100) * 1440;
      const newStartMinutes = Math.round(rawStartMinutes / 5) * 5; // Snap to 5-minute intervals
      const newEndMinutes = newStartMinutes + (endMinutes - startMinutes);
      
      if (newEndMinutes <= 1440) {
        onTimeRangeChange(minutesToTime(newStartMinutes), minutesToTime(newEndMinutes));
      }
    }
  }, [isDragging, endMinutes, startMinutes, endTime, startTime, onTimeRangeChange, dragOffset, barWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    setDragOffset(0);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-neutral-700">Time Range</span>
        <div className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
          {formatTimeRange()} span
        </div>
      </div>

      <div className="text-xs text-neutral-500 mb-2">
        Times shown in {timezoneLabel}
      </div>
      
      <div 
        ref={sliderRef}
        className="relative h-12 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-50 rounded-lg border border-neutral-200 cursor-pointer"
        style={{
          background: 'linear-gradient(90deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)'
        }}
      >
        {/* Time markers */}
        <div className="absolute inset-x-0 top-0 flex justify-between text-xs text-neutral-400 px-2 pt-1">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>

        {/* Selected range bar */}
        <div
          className="absolute top-2 bottom-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded shadow-sm cursor-move flex items-center justify-center text-white text-xs font-medium"
          style={{
            left: `${startPercent}%`,
            width: `${barWidth}%`,
            minWidth: '60px'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'bar')}
        >
          <span className="text-white drop-shadow-sm">
            {startTime} - {endTime}
          </span>
        </div>

        {/* Start handle */}
        <div
          className="absolute top-0 bottom-0 w-3 bg-blue-700 rounded-l cursor-ew-resize hover:bg-blue-800 transition-colors shadow-md border-r-2 border-blue-800 flex items-center justify-center"
          style={{ left: `${startPercent}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'start')}
        >
          <div className="w-0.5 h-4 bg-white rounded-full opacity-75" />
        </div>

        {/* End handle */}
        <div
          className="absolute top-0 bottom-0 w-3 bg-blue-700 rounded-r cursor-ew-resize hover:bg-blue-800 transition-colors shadow-md border-l-2 border-blue-800 flex items-center justify-center"
          style={{ left: `${endPercent}%`, marginLeft: '-12px' }}
          onMouseDown={(e) => handleMouseDown(e, 'end')}
        >
          <div className="w-0.5 h-4 bg-white rounded-full opacity-75" />
        </div>
      </div>

      {/* Quick preset buttons and custom input */}
      <div className="flex gap-2 mt-3 flex-wrap items-center">
        <span className="text-xs text-neutral-500 font-medium">Quick spans:</span>
        {[
          { label: '1hr', minutes: 60 },
          { label: '2hr', minutes: 120 },
          { label: '4hr', minutes: 240 },
          { label: '8hr', minutes: 480 },
        ].map(preset => (
          <button
            key={preset.label}
            onClick={() => {
              const currentCenter = (startMinutes + endMinutes) / 2;
              const rawNewStart = Math.max(0, currentCenter - preset.minutes / 2);
              const rawNewEnd = Math.min(1440, currentCenter + preset.minutes / 2);
              
              // Snap to 5-minute intervals
              const newStart = Math.round(rawNewStart / 5) * 5;
              const newEnd = Math.round(rawNewEnd / 5) * 5;
              
              onTimeRangeChange(minutesToTime(newStart), minutesToTime(newEnd));
            }}
            className="px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded transition-colors"
          >
            {preset.label}
          </button>
        ))}
        
        {/* Custom span input */}
        <div className="flex items-center gap-1 ml-3">
          <span className="text-xs text-neutral-500">Custom:</span>
          <input
            type="text"
            value={customSpan}
            onChange={(e) => setCustomSpan(e.target.value)}
            onKeyPress={handleCustomSpanKeyPress}
            placeholder="30m, 1h 30m, 90"
            className="w-20 px-2 py-1 text-xs border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleCustomSpanApply}
            disabled={!customSpan.trim()}
            className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeRangeSlider;
