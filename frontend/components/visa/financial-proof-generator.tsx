'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateFinancialProofLetter, FinancialProof } from '@/lib/visa-scholarship-data';
import { useVisaStore } from '@/store/visaStore';
import { Download, FileText, Plus } from 'lucide-react';

export function FinancialProofGenerator() {
  const [formData, setFormData] = useState({
    amount: '',
    bankName: '',
    currency: 'USD',
    accountType: 'Savings',
    name: '',
  });

  const { saveFinancialProof, savedProofs } = useVisaStore();
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    if (!formData.amount || !formData.bankName || !formData.name) {
      alert('Please fill in all required fields');
      return;
    }

    const proof: FinancialProof = {
      id: `proof-${Date.now()}`,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      bankName: formData.bankName,
      accountType: formData.accountType,
      generatedDate: new Date(),
      validityMonths: 12,
    };

    saveFinancialProof(proof);
    setShowPreview(true);
  };

  const handleDownload = () => {
    const letter = generateFinancialProofLetter(parseFloat(formData.amount), formData.name);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(letter));
    element.setAttribute('download', `financial-proof-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Financial Proof Letter</CardTitle>
          <CardDescription>
            Create an AI-powered financial proof certificate for visa applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="50000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                  <Input
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-24"
                    maxLength={3}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bank">Bank Name</Label>
                <Input
                  id="bank"
                  placeholder="International Finance Bank"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="account">Account Type</Label>
                <Input
                  id="account"
                  placeholder="Savings"
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleGenerate} className="gap-2 flex-1">
                <FileText className="h-4 w-4" />
                Generate Letter
              </Button>
              {showPreview && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {savedProofs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Saved Proofs
          </h3>
          <motion.div
            className="grid gap-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {savedProofs.map((proof) => (
              <motion.div
                key={proof.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {proof.amount} {proof.currency}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {proof.bankName} • {proof.accountType}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Generated: {proof.generatedDate.toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
