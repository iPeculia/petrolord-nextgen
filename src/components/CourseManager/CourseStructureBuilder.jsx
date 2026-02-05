import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  GripVertical,
  Trash2,
  Edit2,
  Video,
  FileText,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import ModuleEditor from './ModuleEditor';
import LessonEditor from './LessonEditor';
import { useToast } from '@/components/ui/use-toast';
import { courseService } from '@/services/courseService';
import { cn } from '@/lib/utils';

const CourseStructureBuilder = ({ courseId }) => {
  const [structure, setStructure] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [activeModuleIdForLesson, setActiveModuleIdForLesson] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStructure();
  }, [courseId]);

  const fetchStructure = async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getCourseStructure(courseId);
      // Sort modules by order, and lessons inside them
      const sorted = (data || []).sort((a, b) => a.module_order - b.module_order).map(m => ({
        ...m,
        lessons: (m.lessons || []).sort((a, b) => a.lesson_order - b.lesson_order)
      }));
      setStructure(sorted);
    } catch (error) {
      console.error('Failed to load structure:', error);
      toast({ title: 'Error', description: 'Failed to load course structure.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    // Reordering Modules
    if (type === 'module') {
      const newStructure = Array.from(structure);
      const [removed] = newStructure.splice(source.index, 1);
      newStructure.splice(destination.index, 0, removed);

      setStructure(newStructure);
      
      try {
        await courseService.reorderModules(courseId, newStructure.map((m, index) => ({ id: m.id, order: index })));
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to save module order.', variant: 'destructive' });
        fetchStructure(); // Revert
      }
      return;
    }

    // Reordering Lessons
    if (type === 'lesson') {
      const sourceModuleIndex = structure.findIndex(m => m.id === source.droppableId);
      const destModuleIndex = structure.findIndex(m => m.id === destination.droppableId);

      const newStructure = Array.from(structure);
      const sourceModule = newStructure[sourceModuleIndex];
      const destModule = newStructure[destModuleIndex];
      
      const sourceLessons = Array.from(sourceModule.lessons || []);
      const [removed] = sourceLessons.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        // Same module
        sourceLessons.splice(destination.index, 0, removed);
        newStructure[sourceModuleIndex] = { ...sourceModule, lessons: sourceLessons };
        setStructure(newStructure);
        
        try {
            await courseService.reorderLessons(sourceModule.id, sourceLessons.map((l, i) => ({ id: l.id, order: i })));
        } catch(error) {
             toast({ title: 'Error', description: 'Failed to save lesson order.', variant: 'destructive' });
             fetchStructure();
        }

      } else {
        // Different module
        const destLessons = Array.from(destModule.lessons || []);
        destLessons.splice(destination.index, 0, removed);
        
        newStructure[sourceModuleIndex] = { ...sourceModule, lessons: sourceLessons };
        newStructure[destModuleIndex] = { ...destModule, lessons: destLessons };
        setStructure(newStructure);
        
        try {
            await courseService.moveLesson(removed.id, destModule.id, destination.index);
        } catch(error) {
             toast({ title: 'Error', description: 'Failed to move lesson.', variant: 'destructive' });
             fetchStructure();
        }
      }
    }
  };

  const handleCreateModule = () => {
    setEditingModule(null);
    setIsModuleModalOpen(true);
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = async (moduleId) => {
      if(!confirm("Are you sure? This will delete all lessons within the module.")) return;
      try {
          await courseService.deleteModule(moduleId);
          toast({ title: "Success", description: "Module deleted." });
          fetchStructure();
      } catch(error) {
          toast({ title: "Error", description: "Failed to delete module.", variant: 'destructive' });
      }
  };

  const handleCreateLesson = (moduleId) => {
    setActiveModuleIdForLesson(moduleId);
    setEditingLesson(null);
    setIsLessonModalOpen(true);
  };

  const handleEditLesson = (lesson) => {
    setActiveModuleIdForLesson(lesson.module_id);
    setEditingLesson(lesson);
    setIsLessonModalOpen(true);
  };

   const handleDeleteLesson = async (lessonId) => {
      if(!confirm("Are you sure?")) return;
      try {
          await courseService.deleteLesson(lessonId);
          toast({ title: "Success", description: "Lesson deleted." });
          fetchStructure();
      } catch(error) {
          toast({ title: "Error", description: "Failed to delete lesson.", variant: 'destructive' });
      }
  };


  const handleModuleSave = async (data) => {
      try {
          if (editingModule) {
              await courseService.updateModule(editingModule.id, data);
          } else {
              await courseService.createModule({ ...data, course_id: courseId });
          }
          setIsModuleModalOpen(false);
          fetchStructure();
          toast({ title: "Success", description: "Module saved." });
      } catch (error) {
          toast({ title: "Error", description: "Failed to save module.", variant: 'destructive' });
      }
  };

  const handleLessonSave = async (data) => {
      try {
          if (editingLesson) {
              await courseService.updateLesson(editingLesson.id, data);
          } else {
              await courseService.createLesson({ ...data, module_id: activeModuleIdForLesson });
          }
          setIsLessonModalOpen(false);
          fetchStructure();
          toast({ title: "Success", description: "Lesson saved." });
      } catch (error) {
          toast({ title: "Error", description: "Failed to save lesson.", variant: 'destructive' });
      }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BFFF00]"></div>
        <p>Loading curriculum...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#1E293B]/50 p-4 rounded-lg border border-slate-700/50 backdrop-blur-sm">
        <div>
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#BFFF00]" />
                Curriculum Builder
            </h3>
            <p className="text-sm text-slate-400">Drag and drop to organize modules and lessons.</p>
        </div>
        <Button onClick={handleCreateModule} className="bg-[#BFFF00] text-black hover:bg-[#a3d900] shadow-lg shadow-[#BFFF00]/20 transition-all hover:scale-105">
          <Plus className="w-4 h-4 mr-2" /> New Module
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="modules" type="module">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {structure.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl bg-[#1E293B]/30">
                      <p className="text-slate-400 mb-4">No modules yet. Start by creating one!</p>
                      <Button variant="outline" onClick={handleCreateModule}>Create First Module</Button>
                  </div>
              ) : (
                  structure.map((module, index) => (
                    <Draggable key={module.id} draggableId={module.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                              "bg-[#1E293B] border-slate-700 transition-all duration-200",
                              snapshot.isDragging ? "shadow-2xl ring-2 ring-[#BFFF00] scale-[1.02] rotate-1 z-50" : "shadow-md"
                          )}
                        >
                          <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-4 group">
                            <div {...provided.dragHandleProps} className="cursor-grab text-slate-600 hover:text-white transition-colors p-1 rounded hover:bg-slate-700">
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <CardTitle className="text-base text-white font-semibold">
                                    {module.title}
                                </CardTitle>
                                {module.is_published ? (
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] h-5">Published</Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-slate-700 text-slate-400 border-slate-600 text-[10px] h-5">Draft</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span>{module.lessons?.length || 0} Lessons</span>
                                  {module.description && <span className="truncate max-w-[300px] hidden md:inline-block border-l border-slate-700 pl-4">{module.description}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700 hover:text-white" onClick={() => handleEditModule(module)}>
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400" onClick={() => handleDeleteModule(module.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <Droppable droppableId={module.id} type="lesson">
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="space-y-2 pl-4 md:pl-10 border-l-2 border-slate-700/30 ml-2 md:ml-4 pb-2"
                                >
                                  {module.lessons && module.lessons.map((lesson, lIndex) => (
                                    <Draggable key={lesson.id} draggableId={lesson.id} index={lIndex}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className={cn(
                                              "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 group",
                                              snapshot.isDragging 
                                                ? "bg-[#1E293B] border-[#BFFF00] shadow-xl scale-105" 
                                                : "bg-[#0F172A] border-slate-800 hover:border-slate-600 hover:bg-slate-800/50"
                                          )}
                                        >
                                          <div {...provided.dragHandleProps} className="cursor-grab text-slate-600 group-hover:text-slate-400">
                                            <GripVertical className="w-4 h-4" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-medium text-slate-200 truncate">{lesson.title}</div>
                                                {lesson.is_published ? (
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                ) : (
                                                    <AlertCircle className="w-3 h-3 text-amber-500" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                {lesson.duration_minutes > 0 && (
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {lesson.duration_minutes} min
                                                    </span>
                                                )}
                                                <span className="text-xs text-slate-500 flex items-center gap-1 capitalize">
                                                    {lesson.lesson_type === 'video' ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                                    {lesson.lesson_type}
                                                </span>
                                            </div>
                                          </div>
                                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-white" onClick={() => handleEditLesson(lesson)}>
                                                    <Edit2 className="w-3 h-3" />
                                                </Button>
                                                 <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-red-400" onClick={() => handleDeleteLesson(lesson.id)}>
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-slate-500 hover:text-[#BFFF00] hover:bg-[#BFFF00]/5 border border-dashed border-slate-700 hover:border-[#BFFF00]/30 mt-2"
                                    onClick={() => handleCreateLesson(module.id)}
                                  >
                                    <Plus className="w-4 h-4 mr-2" /> Add Lesson to {module.title}
                                  </Button>
                                </div>
                              )}
                            </Droppable>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <ModuleEditor
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        module={editingModule}
        onSave={handleModuleSave}
      />

      <LessonEditor
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        lesson={editingLesson}
        onSave={handleLessonSave}
      />
    </div>
  );
};

export default CourseStructureBuilder;