'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, Plus, GraduationCap } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { educationSchema } from '@/lib/validation';


type EducationData = z.infer<typeof educationSchema>;

interface EducationSectionProps {
    data: EducationData[];
    onChange: (data: EducationData[]) => void;
}

export function EducationSection({ data, onChange }: EducationSectionProps) {
    const {
        control,
        register,
        formState: { errors },
        watch,
        reset,
    } = useForm<{ education: EducationData[] }>({
        resolver: zodResolver(z.object({ education: z.array(educationSchema) })),
        mode: 'onChange',
        defaultValues: { education: data },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'education',
    });

    const watchedEducation = watch('education');

    useEffect(() => {
        if (JSON.stringify(data) !== JSON.stringify(watchedEducation)) {
            reset({ education: data });
        }
    }, [data, reset]);

    useEffect(() => {
        onChange(watchedEducation);
    }, [watchedEducation, onChange]);

    return (
        <div className="space-y-6">
            {fields.map((field, index) => (
                <div key={field.id} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50 space-y-4 relative">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <GraduationCap className="w-3 h-3" />
                            Education #{index + 1}
                        </span>
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
                            <Label className="text-xs font-semibold text-slate-500">Degree</Label>
                            <Input
                                {...register(`education.${index}.degree`)}
                                placeholder="Bachelor of Science in CS"
                                className={`h-10 rounded-xl ${errors.education?.[index]?.degree ? 'border-rose-500' : ''}`}
                            />
                            {errors.education?.[index]?.degree && (
                                <p className="text-[10px] text-rose-500 mt-1">{errors.education[index]?.degree?.message}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-500">School / University</Label>
                            <Input
                                {...register(`education.${index}.school`)}
                                placeholder="Stanford University"
                                className={`h-10 rounded-xl ${errors.education?.[index]?.school ? 'border-rose-500' : ''}`}
                            />
                            {errors.education?.[index]?.school && (
                                <p className="text-[10px] text-rose-500 mt-1">{errors.education[index]?.school?.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-500">Location</Label>
                            <Input
                                {...register(`education.${index}.location`)}
                                placeholder="Palo Alto, CA"
                                className="h-10 rounded-xl"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-500">Start Date</Label>
                            <Input
                                {...register(`education.${index}.startDate`)}
                                placeholder="Sep 2018"
                                className={`h-10 rounded-xl ${errors.education?.[index]?.startDate ? 'border-rose-500' : ''}`}
                            />
                            {errors.education?.[index]?.startDate && (
                                <p className="text-[10px] text-rose-500 mt-1">{errors.education[index]?.startDate?.message}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-500">End Date</Label>
                            <Input
                                {...register(`education.${index}.endDate`)}
                                placeholder="Jun 2022"
                                className="h-10 rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <Button
                variant="outline"
                className="w-full h-12 rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group"
                onClick={() => append({ id: Math.random().toString(36).substr(2, 9), school: '', degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '', description: '' })}
            >
                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Add Education
            </Button>
        </div>
    );
}
