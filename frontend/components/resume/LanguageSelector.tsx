'use client';

import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { supportedLanguages } from '@/lib/languages';
import { useLanguageStore } from '@/store/languageStore';

export function LanguageSelector() {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const activeLang = supportedLanguages.find((l) => l.code === currentLanguage);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{activeLang?.flag}</span>
            <span className="hidden sm:inline">{activeLang?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {supportedLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={currentLanguage === lang.code ? 'bg-indigo-100 dark:bg-indigo-900' : ''}
            >
              <span className="mr-2">{lang.flag}</span>
              <span>{lang.nativeName}</span>
              {currentLanguage === lang.code && (
                <span className="ml-auto">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
