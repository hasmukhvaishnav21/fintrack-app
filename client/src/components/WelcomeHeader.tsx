import { motion } from "framer-motion";
import { Bell } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
}

export default function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-4 px-4 flex items-center justify-between"
      data-testid="welcome-header"
    >
      <div>
        <p className="text-sm text-muted-foreground mb-1">Welcome back,</p>
        <h1 className="text-2xl font-bold text-foreground" data-testid="text-greeting">
          {userName}
        </h1>
      </div>
      <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover-elevate active-elevate-2 shadow-sm" data-testid="button-notifications">
        <Bell className="w-5 h-5 text-foreground" />
      </button>
    </motion.div>
  );
}
