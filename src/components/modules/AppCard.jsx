import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import '@/styles/modules/appCard.css';

const AppCard = ({ 
    title, 
    description, 
    icon: Icon, 
    link, 
    path, 
    status = 'available', 
    actionText,
    colorTheme = '#3B82F6', 
    onNavigate 
}) => {
    const navigate = useNavigate();
    const destination = link || path;
    const isAvailable = status === 'available' || status === 'active';
    const finalActionText = actionText || (isAvailable ? 'Launch Tool' : 'Coming Soon');

    const handleClick = (e) => {
        if (!isAvailable) {
            e.preventDefault();
            return;
        }
        if (onNavigate) {
            e.preventDefault();
            onNavigate();
        } else if (destination) {
            navigate(destination);
        }
    };
    
    // CRITICAL FIX: Robust icon rendering to prevent "Objects are not valid as a React child" error
    const renderIcon = () => {
        if (!Icon) return null;

        // 1. If it's a valid React Element (e.g., <Database />), return it directly.
        if (React.isValidElement(Icon)) {
            return Icon;
        }

        // 2. If it's a Component definition (Function, Class, or ForwardRef object like Lucide icons)
        // We must render it as a JSX element <IconComponent />.
        const IconComponent = Icon;
        return <IconComponent className="app-card-icon" />;
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="h-full"
        >
            <div 
                className={cn(
                    "app-card group relative overflow-hidden rounded-xl border bg-slate-900/50 p-6 hover:bg-slate-900 transition-all duration-300",
                    isAvailable ? "cursor-pointer border-slate-800 hover:border-slate-700" : "opacity-75 border-slate-800"
                )}
                style={{ '--card-hover-color': colorTheme }}
                onClick={handleClick}
            >
                <div className="flex flex-col h-full justify-between space-y-4">
                    <div className="space-y-4">
                        <div 
                            className="app-card-icon-container w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300"
                            style={{ 
                                backgroundColor: `${colorTheme}1a`, // 10% opacity hex
                                color: colorTheme 
                            }}
                        >
                            {renderIcon()}
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {title}
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 line-clamp-3">
                                {description}
                            </p>
                        </div>
                    </div>
                    
                    <div className="pt-4 mt-auto">
                        <Button 
                            variant={isAvailable ? "outline" : "ghost"}
                            className={cn(
                                "w-full justify-between group-hover:bg-[var(--card-hover-color)] group-hover:text-white transition-all", 
                                isAvailable ? "border-slate-700" : "opacity-50 cursor-not-allowed"
                            )}
                            disabled={!isAvailable}
                        >
                            {finalActionText}
                            {isAvailable ? (
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            ) : (
                                <Lock className="ml-2 h-3 w-3" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AppCard;