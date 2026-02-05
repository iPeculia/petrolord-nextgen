import { supabase } from '@/lib/customSupabaseClient';

export const quizService = {
    // --- Management ---

    async getQuizByLessonId(lessonId) {
        const { data, error } = await supabase
            .from('quizzes')
            .select(`
                *,
                questions:quiz_questions(
                    *,
                    options:quiz_options(*)
                )
            `)
            .eq('lesson_id', lessonId)
            .maybeSingle(); // Returns null if not found instead of error
        
        if (error) throw error;
        
        // Sort questions and options
        if (data && data.questions) {
            data.questions.sort((a, b) => a.order_index - b.order_index);
            data.questions.forEach(q => {
                if (q.options) q.options.sort((a, b) => a.option_order - b.option_order);
            });
        }
        return data;
    },

    async createOrUpdateQuiz(quizData) {
        // Upsert quiz
        const { data, error } = await supabase
            .from('quizzes')
            .upsert({
                id: quizData.id, // If provided, updates. Else inserts (needs DB default gen_random_uuid() or provided ID)
                lesson_id: quizData.lesson_id,
                course_id: quizData.course_id,
                title: quizData.title,
                description: quizData.description,
                passing_score: quizData.passing_score,
                duration_minutes: quizData.duration_minutes,
                is_published: quizData.is_published,
                shuffle_questions: quizData.shuffle_questions,
                show_correct_answers: quizData.show_correct_answers,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
            
        if (error) throw error;
        return data;
    },

    async saveQuestion(questionData, options) {
        // 1. Save Question
        const { data: question, error: qError } = await supabase
            .from('quiz_questions')
            .upsert({
                id: questionData.id,
                quiz_id: questionData.quiz_id,
                question_text: questionData.question_text,
                points: questionData.points,
                order_index: questionData.order_index,
                correct_answer: '', // Deprecated in favor of options, but keeping for schema compat
                options: [] // Deprecated JSONB
            })
            .select()
            .single();

        if (qError) throw qError;

        // 2. Save Options
        // Delete existing first to handle removals, or smarter upsert?
        // For simplicity in this editor, delete all for this question and recreate is safest for integrity
        if (questionData.id) {
            await supabase.from('quiz_options').delete().eq('question_id', question.id);
        }

        const optionsToInsert = options.map((opt, idx) => ({
            question_id: question.id,
            option_text: opt.option_text,
            is_correct: opt.is_correct,
            option_order: idx
        }));

        const { error: oError } = await supabase.from('quiz_options').insert(optionsToInsert);
        if (oError) throw oError;

        return question;
    },

    async deleteQuestion(questionId) {
        const { error } = await supabase.from('quiz_questions').delete().eq('id', questionId);
        if (error) throw error;
    },

    // --- Taking Quiz ---

    async startAttempt(quizId, userId) {
        // Check for existing in-progress attempt
        const { data: existing } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('quiz_id', quizId)
            .eq('user_id', userId)
            .eq('status', 'in_progress')
            .single();

        if (existing) return existing;

        // Create new
        const { data, error } = await supabase
            .from('quiz_attempts')
            .insert({
                quiz_id: quizId,
                user_id: userId,
                start_time: new Date().toISOString(),
                status: 'in_progress',
                score: 0,
                passed: false
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async saveAnswer(attemptId, questionId, selectedOptionId) {
        // Upsert answer
        // Note: Logic to check correctness is done here or on submit?
        // Doing on submit is safer for security, but we can store raw selection here.
        
        // Check if correct (need to fetch option)
        const { data: option } = await supabase
            .from('quiz_options')
            .select('is_correct, question_id')
            .eq('id', selectedOptionId)
            .single();
            
        // Fetch question points
        const { data: question } = await supabase
             .from('quiz_questions')
             .select('points')
             .eq('id', questionId)
             .single();

        const isCorrect = option?.is_correct || false;
        const points = isCorrect ? (question?.points || 1) : 0;

        // Remove previous answer for this question in this attempt
        await supabase
            .from('quiz_attempt_answers')
            .delete()
            .match({ attempt_id: attemptId, question_id: questionId });

        const { error } = await supabase
            .from('quiz_attempt_answers')
            .insert({
                attempt_id: attemptId,
                question_id: questionId,
                selected_option_id: selectedOptionId,
                is_correct: isCorrect,
                points_awarded: points
            });

        if (error) throw error;
    },

    async submitAttempt(attemptId) {
        // 1. Calculate Score
        const { data: answers } = await supabase
            .from('quiz_attempt_answers')
            .select('points_awarded')
            .eq('attempt_id', attemptId);
        
        const totalScore = answers?.reduce((sum, a) => sum + (a.points_awarded || 0), 0) || 0;

        // 2. Get Quiz Passing Info
        const { data: attempt } = await supabase
            .from('quiz_attempts')
            .select('*, quiz:quizzes(passing_score, id, course_id, lesson_id)')
            .eq('id', attemptId)
            .single();
            
        // Get Total Possible Points
        const { data: questions } = await supabase
            .from('quiz_questions')
            .select('points')
            .eq('quiz_id', attempt.quiz_id);
            
        const totalPossible = questions?.reduce((sum, q) => sum + (q.points || 1), 0) || 0;
        
        const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
        const passed = percentage >= (attempt.quiz.passing_score || 0);

        // 3. Update Attempt
        const { data: updatedAttempt, error } = await supabase
            .from('quiz_attempts')
            .update({
                end_time: new Date().toISOString(),
                status: 'completed',
                score: percentage, // storing percentage as score based on schema usage usually
                passed: passed
            })
            .eq('id', attemptId)
            .select()
            .single();

        if (error) throw error;
        
        // 4. Record Lesson Completion if passed
        if (passed && attempt.quiz.lesson_id) {
            await supabase.from('lesson_progress').upsert({
                user_id: attempt.user_id,
                lesson_id: attempt.quiz.lesson_id,
                is_completed: true,
                completion_date: new Date().toISOString(),
                time_spent_minutes: 0 // Could calc duration
            }, { onConflict: 'user_id, lesson_id' });
        }

        return updatedAttempt;
    },
    
    async getAttemptResults(attemptId) {
         const { data, error } = await supabase
            .from('quiz_attempts')
            .select(`
                *,
                quiz:quizzes(*),
                answers:quiz_attempt_answers(*)
            `)
            .eq('id', attemptId)
            .single();
        if (error) throw error;
        return data;
    }
};