import { motion } from "framer-motion";
import { Home, Receipt, Users, BarChart3, User } from "lucide-react";
import { useLocation } from "wouter";

type NavItem = 'home' | 'transactions' | 'communities' | 'insights' | 'profile';

interface BottomNavProps {
  activeTab?: NavItem;
  onTabChange?: (tab: NavItem) => void;
}

export default function BottomNav({ activeTab = 'home', onTabChange }: BottomNavProps) {
  const [location, setLocation] = useLocation();

  const handleTabClick = (tab: NavItem) => {
    onTabChange?.(tab);
    
    // Navigate to the appropriate route
    if (tab === 'home') setLocation('/');
    else if (tab === 'transactions') setLocation('/transactions');
    else if (tab === 'communities') setLocation('/communities');
    else if (tab === 'insights') setLocation('/insights');
    else if (tab === 'profile') setLocation('/profile');
  };
  
  const currentTab = location === '/' ? 'home' 
    : location === '/transactions' ? 'transactions'
    : location === '/communities' ? 'communities'
    : location === '/insights' ? 'insights'
    : location === '/profile' ? 'profile'
    : activeTab;

  const navItems = [
    { id: 'home' as NavItem, icon: Home, label: 'Home' },
    { id: 'transactions' as NavItem, icon: Receipt, label: 'Transactions' },
    { id: 'communities' as NavItem, icon: Users, label: 'Communities' },
    { id: 'insights' as NavItem, icon: BarChart3, label: 'Insights' },
    { id: 'profile' as NavItem, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50" data-testid="nav-bottom">
      <div className="max-w-md mx-auto px-4 py-2 safe-area-bottom">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className="flex flex-col items-center justify-center py-2 px-3 min-w-[60px] relative hover-elevate active-elevate-2"
                data-testid={`button-nav-${item.id}`}
              >
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Icon 
                    className={`w-6 h-6 mb-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                </motion.div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
