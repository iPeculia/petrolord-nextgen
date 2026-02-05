/**
 * Utility functions for grading logic
 */

export const calculateLetterGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
};

export const getGradeColor = (grade) => {
    switch (grade) {
        case 'A': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
        case 'B': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
        case 'C': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
        case 'D': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
        case 'F': return 'text-red-400 border-red-500/30 bg-red-500/10';
        default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
    }
};

export const calculateGPA = (grades) => {
    if (!grades || grades.length === 0) return 0.0;
    
    const points = {
        'A': 4.0,
        'B': 3.0,
        'C': 2.0,
        'D': 1.0,
        'F': 0.0
    };
    
    const totalPoints = grades.reduce((sum, grade) => sum + (points[grade.letter_grade] || 0), 0);
    return (totalPoints / grades.length).toFixed(2);
};

export const autoGradeQuiz = (questions, userAnswers) => {
    let correctCount = 0;
    
    questions.forEach(q => {
        if (userAnswers[q.id] === q.correct_answer) {
            correctCount++;
        }
    });
    
    const score = correctCount;
    const total = questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const letterGrade = calculateLetterGrade(percentage);
    
    return { score, total, percentage, letterGrade };
};