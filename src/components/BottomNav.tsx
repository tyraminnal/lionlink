import { Home, Search, Calendar, User } from 'lucide-react';

interface BottomNavProps {
  active: 'home' | 'find' | 'schedule' | 'profile';
  onNavigate: (screen: 'home' | 'find' | 'schedule' | 'profile') => void;
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'find' as const, icon: Search, label: 'Find' },
    { id: 'schedule' as const, icon: Calendar, label: 'Schedule' },
    { id: 'profile' as const, icon: User, label: 'Me' },
  ];

  return (
    <div className="h-[70px] bg-white border-t border-gray-200 flex items-center justify-around px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors"
          >
            <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
