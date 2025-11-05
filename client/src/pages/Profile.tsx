import { motion } from "framer-motion";
import { ArrowLeft, User, Bell, Lock, HelpCircle, Settings, LogOut, ChevronRight, Smartphone, Mail, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();

  const profileSections = [
    {
      title: 'Account',
      items: [
        { id: 'personal', label: 'Personal Information', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security & Privacy', icon: Lock },
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help Center', icon: HelpCircle },
        { id: 'settings', label: 'App Settings', icon: Settings },
      ]
    }
  ];

  const handleItemClick = (id: string) => {
    console.log(`Navigating to ${id}`);
  };

  const handleLogout = async () => {
    await logout();
    setLocation('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary via-blue-600 to-blue-700 p-6 pb-12">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setLocation('/')}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover-elevate active-elevate-2"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Profile</h1>
            <div className="w-10" />
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center mb-4 shadow-xl"
            >
              <span className="text-4xl font-bold text-white">H</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-1">Hasmukh</h2>
            <p className="text-sm text-white/80">Premium Member</p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="px-4 -mt-6 mb-6">
          <div className="grid grid-cols-1 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-card rounded-2xl p-4 shadow-md flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-semibold text-foreground">hasmukh@fintrack.com</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="bg-card rounded-2xl p-4 shadow-md flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                <p className="text-sm font-semibold text-foreground">+91 98765 43210</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-card rounded-2xl p-4 shadow-md flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="text-sm font-semibold text-foreground">Mumbai, India</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="px-4 space-y-6">
          {profileSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-2">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * (sectionIndex * 3 + itemIndex) }}
                      onClick={() => handleItemClick(item.id)}
                      className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card hover-elevate active-elevate-2"
                      data-testid={`button-${item.id}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground flex-1 text-left">
                        {item.label}
                      </span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-600 font-semibold hover-elevate active-elevate-2 mb-6"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </motion.button>
        </div>

        <BottomNav activeTab="profile" />
      </div>
    </div>
  );
}
