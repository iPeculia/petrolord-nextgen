import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, Edit, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import QuizEditorModal from './QuizEditorModal';

const LessonEditor = ({ isOpen, onClose, lesson, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const { toast } = useToast();
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    watch, 
    formState: { errors } 
  } = useForm({
      defaultValues: {
          title: '',
          description: '',
          duration_minutes: '',
          is_published: false,
          lesson_type: 'video',
          video_url: ''
      }
  });

  const isPublished = watch('is_published');
  const lessonType = watch('lesson_type');

  useEffect(() => {
    if (lesson) {
      setValue('title', lesson.title);
      setValue('description', lesson.description || '');
      setValue('duration_minutes', lesson.duration_minutes);
      setValue('is_published', lesson.is_published);
      setValue('lesson_type', lesson.lesson_type || 'video');
      setValue('video_url', lesson.video_url || '');
    } else {
      reset({ title: '', description: '', duration_minutes: '15', is_published: false, lesson_type: 'video', video_url: '' });
    }
  }, [lesson, isOpen, setValue, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      if (data.lesson_type !== 'quiz') {
         onClose();
      } else {
         // Keep open or give feedback? Usually parent closes.
         // If quiz, maybe we don't close immediately if we want to edit quiz?
         // For now, let standard flow handle close, user can re-open to edit quiz.
      }
    } catch (error) {
       console.error(error);
       toast({
         title: "Error Saving Lesson",
         description: error.message,
         variant: "destructive"
       });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditQuiz = (e) => {
      e.preventDefault();
      setShowQuizEditor(true);
  };

  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose(open)}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lesson ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure lesson details and content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title <span className="text-red-400">*</span></Label>
            <Input
              id="title"
              {...register('title', { required: "Title is required" })}
              className={`bg-[#0F172A] border-slate-600 text-white ${errors.title ? 'border-red-500' : ''}`}
              placeholder="e.g., Understanding Permeability"
            />
            {errors.title && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.title.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Lesson Type</Label>
                <Select 
                    onValueChange={(val) => setValue('lesson_type', val)} 
                    defaultValue={lessonType || 'video'}
                >
                  <SelectTrigger className="bg-[#0F172A] border-slate-600 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
                    <SelectItem value="video">Video Lesson</SelectItem>
                    <SelectItem value="article">Article / Reading</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) <span className="text-red-400">*</span></Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  {...register('duration_minutes', { 
                      required: "Duration is required",
                      min: { value: 0, message: "Must be positive" }
                  })}
                  className={`bg-[#0F172A] border-slate-600 text-white ${errors.duration_minutes ? 'border-red-500' : ''}`}
                  placeholder="15"
                />
                 {errors.duration_minutes && <p className="text-xs text-red-400">{errors.duration_minutes.message}</p>}
              </div>
          </div>

          {lessonType === 'video' && (
              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  {...register('video_url', { 
                      pattern: { value: urlRegex, message: "Please enter a valid URL" }
                  })}
                  className={`bg-[#0F172A] border-slate-600 text-white ${errors.video_url ? 'border-red-500' : ''}`}
                  placeholder="https://vimeo.com/..."
                />
                 {errors.video_url && <p className="text-xs text-red-400">{errors.video_url.message}</p>}
              </div>
          )}

          {lessonType === 'quiz' && (
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                      <div className="bg-indigo-500/20 p-2 rounded-full">
                          <Edit className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                          <h4 className="font-medium text-white">Quiz Content</h4>
                          <p className="text-xs text-slate-400">Manage questions and quiz settings.</p>
                      </div>
                  </div>
                  {lesson ? (
                      <Button 
                        onClick={handleEditQuiz}
                        type="button" 
                        variant="outline" 
                        className="w-full border-dashed border-indigo-500/50 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400"
                      >
                          Manage Quiz Questions <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                  ) : (
                      <div className="text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                          Please save the lesson first to configure quiz questions.
                      </div>
                  )}
              </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Description / Instructions</Label>
            <Textarea
              id="description"
              {...register('description')}
              className="bg-[#0F172A] border-slate-600 text-white min-h-[100px]"
              placeholder={lessonType === 'quiz' ? "Instructions for the quiz..." : "Summary of the lesson content..."}
            />
          </div>

           <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-[#0F172A]">
              <div className="space-y-0.5">
                  <Label className="text-base text-slate-200">Publish Lesson</Label>
                  <p className="text-xs text-slate-400">Make content visible to enrolled students.</p>
              </div>
              <Switch 
                 checked={isPublished}
                 onCheckedChange={(val) => setValue('is_published', val)}
              />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onClose()} className="text-slate-300 hover:text-white" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#BFFF00] text-black hover:bg-[#a3d900]" disabled={isSubmitting}>
              {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
              ) : (
                  lesson ? 'Save Changes' : 'Add Lesson'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    
    {showQuizEditor && lesson && (
        <QuizEditorModal 
            isOpen={showQuizEditor} 
            onClose={() => setShowQuizEditor(false)} 
            lessonId={lesson.id}
            courseId={lesson.course_id}
            lessonTitle={lesson.title}
        />
    )}
    </>
  );
};

export default LessonEditor;