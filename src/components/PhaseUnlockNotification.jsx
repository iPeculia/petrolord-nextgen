import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PhaseUnlockNotification = ({ nextPhase, onDismiss }) => {
    const navigate = useNavigate();

    const handleViewCourses = () => {
        // In a real app, you might navigate to a filtered view of courses for the new phase
        // For now, we'll just navigate to the general courses page.
        navigate('/courses');
        onDismiss(); // Dismiss the notification after action
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 mb-6"
        >
            <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-300" />
                <div>
                    <h3 className="font-bold text-lg">Congratulations!</h3>
                    <p className="text-sm">You've completed the requirements for the next phase. Phase {nextPhase} courses are now available!</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button
                    onClick={handleViewCourses}
                    className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold"
                >
                    View Phase {nextPhase} Courses
                </Button>
                <Button
                    onClick={onDismiss}
                    variant="ghost"
                    className="text-white hover:bg-indigo-500"
                >
                    Dismiss
                </Button>
            </div>
        </motion.div>
    );
};

export default PhaseUnlockNotification;