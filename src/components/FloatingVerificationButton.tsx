
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import CardVerification from './CardVerification';

const FloatingVerificationButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-ethiopian-green hover:bg-ethiopian-green/90 shadow-lg z-50"
          size="icon"
        >
          <Search className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Card Verification</DialogTitle>
        </DialogHeader>
        <CardVerification />
      </DialogContent>
    </Dialog>
  );
};

export default FloatingVerificationButton;
