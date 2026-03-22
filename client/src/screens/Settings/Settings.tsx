import React from 'react';
import { ArrowLeft, Bell, Shield, Moon, Globe, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';

export const Settings = () => {
  const settingsGroups = [
    {
      title: 'App Settings',
      items: [
        { icon: Bell, label: 'Notifications', value: 'On' },
        { icon: Moon, label: 'Dark Mode', value: 'System' },
        { icon: Globe, label: 'Language', value: 'English' },
      ]
    },
    {
      title: 'Security',
      items: [
        { icon: Shield, label: 'Privacy Policy' },
        { icon: HelpCircle, label: 'Help & Support' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 bg-white dark:bg-slate-950 z-10 border-b border-slate-100 dark:border-slate-800">
        <Button variant="ghost" size="icon">
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-lg font-bold">Settings</h2>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-4 py-6 space-y-8">
        {settingsGroups.map((group) => (
          <section key={group.title} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">{group.title}</h3>
            <Card className="p-0 overflow-hidden">
              {group.items.map((item, i) => (
                <button 
                  key={item.label}
                  className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    i !== group.items.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className="text-slate-500" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    {item.value && <span className="text-sm">{item.value}</span>}
                    <ChevronRight size={18} />
                  </div>
                </button>
              ))}
            </Card>
          </section>
        ))}

        <Button variant="outline" className="w-full text-red-500 border-red-500/20 hover:bg-red-500/10 gap-2">
          <LogOut size={20} />
          Log Out
        </Button>
      </div>
    </div>
  );
};
