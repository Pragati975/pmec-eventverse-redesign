import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ClubDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: { name: string; fullName: string; description: string; fullDescription: string; icon: any; tone: string } | null;
}

export const ClubDetailsModal = ({ isOpen, onClose, club }: ClubDetailsModalProps) => {
  if (!club) return null;
  const IconComponent = club.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className={`${club.tone} p-6 pr-14 text-left space-y-2 border-b-2 border-ink`}>
          <IconComponent size={34} />
          <DialogTitle className="font-display font-black uppercase text-6xl leading-[0.9] text-inherit">{club.name}</DialogTitle>
          <p className="font-display font-extrabold uppercase tracking-[0.2em] text-sm">{club.fullName}</p>
        </DialogHeader>
        <p className="p-6 text-[17px] leading-relaxed whitespace-pre-line">{club.fullDescription}</p>
      </DialogContent>
    </Dialog>
  );
};
