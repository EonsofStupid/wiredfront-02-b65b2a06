import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTabStore } from "@/stores/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const TabBar = () => {
  const { tabs, removeTab, activeTabId, setActiveTab } = useTabStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTabClick = (id: string, path: string) => {
    setActiveTab(id);
    navigate(path);
  };

  const handleCloseTab = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    removeTab(id);
    toast({
      title: `${title} closed`,
      description: "Tab has been removed",
      className: "bg-dark-lighter border-neon-blue/50",
    });
  };

  return (
    <div className="flex items-center gap-2 px-4 h-10 bg-dark-lighter/50 backdrop-blur-sm border-b border-white/5">
      <AnimatePresence mode="popLayout">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              rotate: 10,
              y: -20,
              transition: { duration: 0.2 }
            }}
            className="relative group"
            layout
          >
            <button
              onClick={() => handleTabClick(tab.id, tab.path)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-t-md
                transition-all duration-200
                ${activeTabId === tab.id 
                  ? 'bg-dark-lighter text-white' 
                  : 'bg-dark-lighter/50 text-gray-400 hover:text-white'}
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
              
              <motion.button
                onClick={(e) => handleCloseTab(e, tab.id, tab.label)}
                className="absolute -top-1 -right-1 p-1 rounded-full 
                         bg-dark-lighter opacity-0 group-hover:opacity-100
                         hover:bg-red-500/20 transition-all duration-200"
                whileHover={{ scale: 1.2 }}
                initial={false}
              >
                <X className="w-3 h-3" />
              </motion.button>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};