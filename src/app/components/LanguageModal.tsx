import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/lib/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/lib/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/lib/ui/select';
import { Button } from '@/lib/ui/button';

interface LanguageModalProps {
  showPopup: boolean;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  language: string;
  handleLanguageChange: (value: string) => void;
}

export default function LanguageModal({
  showPopup,
  setShowPopup,
  language,
  handleLanguageChange,
}: LanguageModalProps): React.JSX.Element {
  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Choose your language</DialogTitle>
        </DialogHeader>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className=''>
            <SelectValue placeholder='Select your preferred language' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Indo-European</SelectLabel>
              <SelectItem value='English'>English</SelectItem>
              <SelectItem value='Spanish'>Spanish</SelectItem>
              <SelectItem value='Hindi'>Hindi</SelectItem>
              <SelectItem value='Bengali'>Bengali</SelectItem>
              <SelectItem value='Russian'>Russian</SelectItem>
              <SelectItem value='Portuguese'>Portuguese</SelectItem>
              <SelectItem value='German'>German</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Sino-Tibetan</SelectLabel>
              <SelectItem value='Chinese'>Chinese</SelectItem>
              <SelectItem value='Burmese'>Burmese</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Afro-Asiatic</SelectLabel>
              <SelectItem value='Arabic'>Arabic</SelectItem>
              <SelectItem value='Hebrew'>Hebrew</SelectItem>
              <SelectItem value='Amharic'>Amharic</SelectItem>
              <SelectItem value='Somali'>Somali</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Niger-Congo</SelectLabel>
              <SelectItem value='Swahili'>Swahili</SelectItem>
              <SelectItem value='Yoruba'>Yoruba</SelectItem>
              <SelectItem value='Igbo'>Igbo</SelectItem>
              <SelectItem value='Zulu'>Zulu</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Austronesian</SelectLabel>
              <SelectItem value='Indonesian'>Indonesian</SelectItem>
              <SelectItem value='Tagalog'>Tagalog</SelectItem>
              <SelectItem value='Maori'>Maori</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Dravidian</SelectLabel>
              <SelectItem value='Tamil'>Tamil</SelectItem>
              <SelectItem value='Telugu'>Telugu</SelectItem>
              <SelectItem value='Kannada'>Kannada</SelectItem>
              <SelectItem value='Malayalam'>Malayalam</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Turkic</SelectLabel>
              <SelectItem value='Turkish'>Turkish</SelectItem>
              <SelectItem value='Uzbek'>Uzbek</SelectItem>
              <SelectItem value='Kazakh'>Kazakh</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Uralic</SelectLabel>
              <SelectItem value='Finnish'>Finnish</SelectItem>
              <SelectItem value='Hungarian'>Hungarian</SelectItem>
              <SelectItem value='Estonian'>Estonian</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          type='button'
          variant='secondary'
          onClick={() => setShowPopup(false)}
          className='bg-black text-white hover:bg-gray-300 hover:text-black'
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}
