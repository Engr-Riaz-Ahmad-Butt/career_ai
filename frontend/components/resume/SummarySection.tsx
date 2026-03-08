'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

interface SummarySectionProps {
    data: string;
    onChange: (data: string) => void;
}

export function SummarySection({ data, onChange }: SummarySectionProps) {
    const [localValue, setLocalValue] = useState(data);

    useEffect(() => {
        setLocalValue(data);
    }, [data]);

    const handleChange = (val: string) => {
        setLocalValue(val);
        onChange(val);
    };

    return (
        <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Professional Summary
            </Label>
            <Textarea
                value={localValue}
                placeholder="2 to 4 sentence professional summary..."
                className="min-h-[120px] rounded-xl resize-none"
                onChange={(e) => handleChange(e.target.value)}
            />
            <div className="flex justify-between items-center px-1">
                <p className="text-[10px] text-slate-400">
                    Tip: Focus on your most relevant achievements.
                </p>
                <p className={`text-[10px] font-medium ${localValue.length > 500 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {localValue.length} / 500
                </p>
            </div>
        </div>
    );
}
