'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { personalInfoSchema } from '@/lib/validation';


type PersonalInfoData = z.infer<typeof personalInfoSchema>;

interface ContactSectionProps {
    data: Partial<PersonalInfoData>;
    onChange: (data: Partial<PersonalInfoData>) => void;
}

export function ContactSection({ data, onChange }: ContactSectionProps) {
    const {
        register,
        formState: { errors },
        reset,
    } = useForm<PersonalInfoData>({
        resolver: zodResolver(personalInfoSchema),
        mode: 'onChange',
        defaultValues: data,
    });

    // Keep form in sync with external data (e.g. if loaded from server or AI)
    useEffect(() => {
        reset(data);
    }, [data, reset]);

    const handleChange = (field: keyof PersonalInfoData, value: string) => {
        onChange({ [field]: value });
    };

    const fields = [
        { key: 'fullName', label: 'Full Name', placeholder: 'Jane Smith' },
        { key: 'email', label: 'Email', placeholder: 'jane@example.com' },
        { key: 'phone', label: 'Phone', placeholder: '+1 555 000 0000' },
        { key: 'location', label: 'Location', placeholder: 'City, Country' },
        { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/...' },
        { key: 'portfolio', label: 'Website / GitHub', placeholder: 'github.com/...' },
    ] as const;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(({ key, label, placeholder }) => (
                    <div key={key} className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {label}
                        </Label>
                        <Input
                            {...register(key)}
                            placeholder={placeholder}
                            className={`rounded-xl h-10 ${errors[key] ? 'border-rose-500' : ''}`}
                            onChange={(e) => {
                                register(key).onChange(e);
                                handleChange(key, e.target.value);
                            }}
                        />
                        {errors[key] && (
                            <p className="text-[10px] text-rose-500 font-medium">
                                {errors[key]?.message}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
