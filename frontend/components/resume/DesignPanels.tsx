import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Type,
    Palette,
    Move,
    Layout,
    Type as TypeIcon,
    Check,
    ChevronRight,
    Monitor,
    Smartphone,
    Undo2,
    Redo2,
    Settings2
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';

interface DesignPanelsProps {
    styling: any;
    onUpdate: (styling: any) => void;
}

export const DesignPanels = ({ styling, onUpdate }: DesignPanelsProps) => {
    const categories = [
        { id: 'spacing', title: 'Spacing', icon: Move },
        { id: 'colors', title: 'Colors', icon: Palette },
        { id: 'typography', title: 'Typography', icon: TypeIcon },
        { id: 'headings', title: 'Section Headings', icon: Layout },
        { id: 'personal', title: 'Personal Details', icon: Settings2 },
    ];

    const updateNested = (category: string, field: string, value: any) => {
        onUpdate({
            [category]: {
                ...styling[category],
                [field]: value
            }
        });
    };

    return (
        <div className="space-y-6 pb-20">
            <Accordion type="single" collapsible defaultValue="spacing" className="space-y-4">
                {/* Spacing */}
                <AccordionItem value="spacing" className="border-0">
                    <AccordionTrigger className="hover:no-underline bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                                <Move className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg">Spacing</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 px-6 space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold opacity-70">Font Size</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{styling.spacing?.fontSize}pt</span>
                                    <div className="flex border rounded-lg overflow-hidden">
                                        <button className="px-2 py-1 hover:bg-slate-50 border-r" onClick={() => updateNested('spacing', 'fontSize', Math.max(7, (styling.spacing?.fontSize || 10) - 0.5))}>-</button>
                                        <button className="px-2 py-1 hover:bg-slate-50" onClick={() => updateNested('spacing', 'fontSize', Math.min(14, (styling.spacing?.fontSize || 10) + 0.5))}>+</button>
                                    </div>
                                </div>
                            </div>
                            <Slider
                                value={[styling.spacing?.fontSize || 10]}
                                min={7} max={14} step={0.5}
                                onValueChange={([val]) => updateNested('spacing', 'fontSize', val)}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold opacity-70">Line Height</Label>
                                <span className="text-xs font-bold">{styling.spacing?.lineHeight}</span>
                            </div>
                            <Slider
                                value={[styling.spacing?.lineHeight || 1.2]}
                                min={0.8} max={2.0} step={0.1}
                                onValueChange={([val]) => updateNested('spacing', 'lineHeight', val)}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold opacity-70">Left & Right Margin</Label>
                                <span className="text-xs font-bold">{styling.spacing?.sideMargin}mm</span>
                            </div>
                            <Slider
                                value={[styling.spacing?.sideMargin || 15]}
                                min={5} max={30} step={1}
                                onValueChange={([val]) => updateNested('spacing', 'sideMargin', val)}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold opacity-70">Top & Bottom Margin</Label>
                                <span className="text-xs font-bold">{styling.spacing?.topBottomMargin}mm</span>
                            </div>
                            <Slider
                                value={[styling.spacing?.topBottomMargin || 15]}
                                min={5} max={30} step={1}
                                onValueChange={([val]) => updateNested('spacing', 'topBottomMargin', val)}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Colors */}
                <AccordionItem value="colors" className="border-0">
                    <AccordionTrigger className="hover:no-underline bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-600">
                                <Palette className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg">Colors</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 px-6 space-y-8">
                        <div className="space-y-4">
                            <Label className="text-sm font-semibold opacity-70">Accent Color</Label>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    '#000000', '#4f46e5', '#3b82f6', '#06b6d4', '#10b981',
                                    '#84cc16', '#eab308', '#f97316', '#ef4444', '#ec4899', '#8b5cf6'
                                ].map((color) => (
                                    <button
                                        key={color}
                                        className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center ${styling.colors?.accent === color ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => updateNested('colors', 'accent', color)}
                                    >
                                        {styling.colors?.accent === color && <Check className="w-5 h-5 text-white mix-blend-difference" />}
                                    </button>
                                ))}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 cursor-pointer hover:scale-110 transition-transform flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Custom</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-semibold opacity-70">Apply accent color to</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'applyToName', label: 'Name' },
                                    { id: 'applyToTitle', label: 'Job title' },
                                    { id: 'applyToIcons', label: 'Icons' },
                                    { id: 'applyToBubbles', label: 'Bubbles' },
                                ].map((opt) => (
                                    <div key={opt.id} className="flex items-center space-x-2">
                                        <button
                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${styling.colors?.[opt.id] ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}
                                            onClick={() => updateNested('colors', opt.id, !styling.colors?.[opt.id])}
                                        >
                                            {styling.colors?.[opt.id] && <Check className="w-3.5 h-3.5 text-white" />}
                                        </button>
                                        <Label className="text-sm">{opt.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Typography */}
                <AccordionItem value="typography" className="border-0">
                    <AccordionTrigger className="hover:no-underline bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600">
                                <TypeIcon className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg">Typography</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 px-6 space-y-8">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            {['Serif', 'Sans', 'Mono'].map((cat) => (
                                <button
                                    key={cat}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${styling.typography?.category === cat ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500'}`}
                                    onClick={() => updateNested('typography', 'category', cat)}
                                >
                                    <div className="text-lg mb-0.5">{cat === 'Serif' ? 'Aa' : cat === 'Sans' ? 'Aa' : 'Aa'}</div>
                                    <div className="text-[10px] uppercase">{cat}</div>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {(styling.typography?.category === 'Serif'
                                ? ['Lora', 'Source Serif Pro', 'Zilla Slab', 'Literata', 'EB Garamond', 'Amiri']
                                : styling.typography?.category === 'Sans'
                                    ? ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Outfit']
                                    : ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'Source Code Pro']
                            ).map((font) => (
                                <Button
                                    key={font}
                                    variant="outline"
                                    className={`h-12 font-medium ${styling.typography?.fontFamily === font ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 ring-1 ring-indigo-600' : ''}`}
                                    style={{ fontFamily: font }}
                                    onClick={() => updateNested('typography', 'fontFamily', font)}
                                >
                                    {font}
                                </Button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Headings */}
                <AccordionItem value="headings" className="border-0">
                    <AccordionTrigger className="hover:no-underline bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600">
                                <Layout className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg">Section Headings</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 px-6 space-y-8">
                        <div className="space-y-4">
                            <Label className="text-sm font-semibold opacity-70">Style</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {['none', 'line', 'line-under', 'line-between', 'box', 'box-outline', 'side', 'pill'].map((s) => (
                                    <button
                                        key={s}
                                        className={`h-12 rounded border-2 transition-all flex items-center justify-center ${styling.headingStyle?.style === s ? 'border-indigo-600 bg-indigo-50/30 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}
                                        onClick={() => updateNested('headingStyle', 'style', s)}
                                    >
                                        <div className="w-full px-2">
                                            <div className={`h-1 bg-slate-300 w-1/2 mb-1 ${s === 'pill' ? 'rounded-full' : ''}`} />
                                            <div className="h-0.5 bg-slate-200 w-full" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-semibold opacity-70">Size</Label>
                            <div className="flex gap-2">
                                {['S', 'M', 'L', 'XL'].map((sz) => (
                                    <Button
                                        key={sz}
                                        variant={styling.headingStyle?.size === sz ? 'default' : 'outline'}
                                        className={`flex-1 ${styling.headingStyle?.size === sz ? 'bg-indigo-600' : ''}`}
                                        onClick={() => updateNested('headingStyle', 'size', sz)}
                                    >
                                        {sz}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
