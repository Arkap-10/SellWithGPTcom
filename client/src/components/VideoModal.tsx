import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, X } from "lucide-react";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface VideoModalProps {
  children: React.ReactNode;
  videoSrc?: string;
}

export function VideoModal({ children, videoSrc = "/SellWithGPTIntroVideo.mp4" }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-black border-none shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Product Demo Video</DialogTitle>
        </VisuallyHidden>
        <div className="relative w-full aspect-video bg-black flex items-center justify-center group">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <video 
            className="w-full h-full"
            controls 
            autoPlay 
            playsInline
            src={videoSrc}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
