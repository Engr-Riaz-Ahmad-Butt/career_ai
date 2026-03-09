'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { experienceSchema } from '@/lib/validation';


type ExperienceData = z.infer<typeof experienceSchema>;

interface ExperienceSectionProps {
    data: ExperienceData[];
    onChange: (data: ExperienceData[]) => void;
}

export function ExperienceSection({ data, onChange }: ExperienceSectionProps) {
    const {
        control,
        register,
        formState: { errors },
        watch,
        reset,
    } = useForm<{ experiences: ExperienceData[] }>({
        resolver: zodResolver(z.object({ experiences: z.array(experienceSchema) })),
        mode: 'onChange',
        defaultValues: { experiences: data },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'experiences',
    });

    const watchedExperiences = watch('experiences');

    useEffect(() => {
        // Sync with external data updates (AI generation, etc.)
        if (JSON.stringify(data) !== JSON.stringify(watchedExperiences)) {
            reset({ experiences: data });
        }
    }, [data, reset]);

    // Sync back to store on any change
    useEffect(() => {
        onChange(watchedExperiences);
    }, [watchedExperiences, onChange]);

    return (
        <div className="space-y-6">
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50 space-y-4 relative group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Experience #{index + 1}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 h-8 w-8 rounded-xl transition-colors"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-500">Job Title</Label>
                            <Input
                                {...register(`experiences.${index}.position`)}
                                placeholder="Senior Product Designer"
                                className={`h-10 rounded-xl ${errors.experiences?.[index]?.position ? 'border-rose-500' : ''}`}
                            />
                            {errors.experiences?.[index]?.position && (
                                <p className="text-[10px] text-rose-500 mt-1">{errors.experiences[index]?.position?.message}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-500">Company</Label>
                            <Input
                                {...register(`experiences.${index}.company`)}
                                placeholder="Google"
                                className={`h-10 rounded-xl ${errors.experiences?.[index]?.company ? 'border-rose-500' : ''}`}
                            />
                            {errors.experiences?.[index]?.company && (
                                <p className="text-[10px] text-rose-500 mt-1">{errors.experiences[index]?.company?.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-500">Location</Label>
                            <Input
                                {...register(`experiences.${index}.location`)}
                                placeholder="Mountain View, CA"
                                className="h-10 rounded-xl"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-500">Start Date</Label>
                            <Input
                                {...register(`experiences.${index}.startDate`)}
                                placeholder="Jan 2022"
                                className={`h-10 rounded-xl ${errors.experiences?.[index]?.startDate ? 'border-rose-500' : ''}`}
                            />
                            {errors.experiences?.[index]?.startDate && (
                                <p className="text-[10px] text-rose-500 mt-1">{errors.experiences[index]?.startDate?.message}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-500">End Date</Label>
                            <Input
                                {...register(`experiences.${index}.endDate`)}
                                placeholder="Present"
                                className="h-10 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-500">Description</Label>
                        <Textarea
                            {...register(`experiences.${index}.description`)}
                            placeholder="Key responsibilities and achievements..."
                            className="rounded-xl resize-none min-h-[100px] text-sm"
                        />
                    </div>
                </div>
            ))}

            <Button
                variant="outline"
                className="w-full h-12 rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group"
                onClick={() => append({ id: Math.random().toString(36).substr(2, 9), position: '', company: '', location: '', startDate: '', endDate: 'Present', description: '', achievements: [] })}
            >
                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Add Experience
            </Button>
        </div>
    );
}
