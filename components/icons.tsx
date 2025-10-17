import { LucideProps } from 'lucide-react'
import { ImageIcon, EditIcon, VideoIcon, LayoutIcon, BookOpenIcon, MessagesSquareIcon, Layers, Sparkles } from 'lucide-react'

export const Icons = {
  // Lucide Icons
  ImageIcon,
  EditIcon,
  VideoIcon,
  LayoutIcon,
  BookOpenIcon,
  MessagesSquareIcon,
  LayersIcon: Layers,
  SparklesIcon: Sparkles,
  
  // Logo icons (to be replaced with actual SVGs if needed)
  Logo: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  )
}