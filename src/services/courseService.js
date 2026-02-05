import { supabase } from '@/lib/customSupabaseClient';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for handling course-related operations.
 * Includes explicit UUID generation for new records to ensure consistent ID handling.
 */
export const courseService = {
  // --- COURSES ---

  async getAllCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*, instructor:instructor_id(display_name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getCourseById(id) {
    // Validate UUID format to prevent database errors on invalid query
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
        throw new Error("Invalid Course ID format");
    }

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Creates a new course.
   * Explicitly generates a UUID if not provided to ensure we have the ID for immediate use/redirection.
   */
  async createCourse(courseData) {
    // 1. Generate UUID explicitly using 'uuid' library
    const newCourseId = courseData.id || uuidv4();
    
    // 2. Prepare payload with required fields and defaults
    const newCourse = {
        ...courseData,
        id: newCourseId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Ensure integer fields are actually integers
        duration_weeks: parseInt(courseData.duration_weeks) || 4,
        phase_requirement: parseInt(courseData.phase_requirement) || 1,
        enrollment_count: 0,
        rating: 0,
        review_count: 0,
        is_published: courseData.is_published || false,
        // Fallback for array if passed as null
        learning_objectives: courseData.learning_objectives || [] 
    };

    // 3. Insert into Supabase
    const { data, error } = await supabase
      .from('courses')
      .insert([newCourse])
      .select()
      .single();
      
    if (error) {
        console.error("Supabase Create Error:", error);
        throw error;
    }
    return data;
  },

  async updateCourse(id, courseData) {
    const { data, error } = await supabase
      .from('courses')
      .update({ 
          ...courseData, 
          updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCourse(id) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- COURSE REQUIREMENTS ---

  async getCourseRequirements(courseId) {
    const { data, error } = await supabase
      .from('course_passing_requirements')
      .select('*')
      .eq('course_id', courseId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  // --- SYSTEM MODULES (Dropdown Data) ---

  async getSystemModules() {
    const { data, error } = await supabase
        .from('modules')
        .select('id, name, category')
        .order('name');
    if (error) throw error;
    return data || [];
  },

  // --- COURSE STRUCTURE (Modules & Lessons) ---

  async getCourseStructure(courseId) {
    const { data, error } = await supabase
      .from('course_modules')
      .select(`
        *,
        lessons:course_lessons(*)
      `)
      .eq('course_id', courseId)
      .order('module_order', { ascending: true });
    
    if (error) throw error;
    
    // Sort lessons in memory to avoid complex nested ordering queries
    return data.map(m => ({
      ...m,
      lessons: (m.lessons || []).sort((a, b) => a.lesson_order - b.lesson_order)
    }));
  },

  async createModule(moduleData) {
    const { data: maxOrderData } = await supabase
      .from('course_modules')
      .select('module_order')
      .eq('course_id', moduleData.course_id)
      .order('module_order', { ascending: false })
      .limit(1);
    
    const nextOrder = (maxOrderData?.[0]?.module_order || 0) + 1;

    const { data, error } = await supabase
      .from('course_modules')
      .insert([{ ...moduleData, module_order: nextOrder }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateModule(id, moduleData) {
    const { data, error } = await supabase
      .from('course_modules')
      .update(moduleData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteModule(id) {
    const { error } = await supabase
      .from('course_modules')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async reorderModules(courseId, updates) {
    // Batch update via Promise.all (Supabase doesn't support bulk update with different values easily)
    const promises = updates.map(u => 
      supabase.from('course_modules').update({ module_order: u.order }).eq('id', u.id)
    );
    await Promise.all(promises);
  },

  // --- LESSONS ---

  async createLesson(lessonData) {
    // 1. Get next order
    const { data: maxOrderData } = await supabase
      .from('course_lessons')
      .select('lesson_order')
      .eq('module_id', lessonData.module_id)
      .order('lesson_order', { ascending: false })
      .limit(1);
    
    const nextOrder = (maxOrderData?.[0]?.lesson_order || 0) + 1;

    // 2. Prepare payload - Explicitly select valid columns
    const payload = {
        module_id: lessonData.module_id,
        title: lessonData.title,
        description: lessonData.description || null,
        video_url: lessonData.video_url || null,
        lesson_type: lessonData.lesson_type || 'video',
        duration_minutes: parseInt(lessonData.duration_minutes) || 0,
        is_published: lessonData.is_published || false,
        lesson_order: nextOrder
    };

    // 3. Insert
    const { data, error } = await supabase
      .from('course_lessons')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLesson(id, lessonData) {
    // Explicitly pluck valid columns to prevent errors with unknown fields
    const payload = {};
    if (lessonData.title !== undefined) payload.title = lessonData.title;
    if (lessonData.description !== undefined) payload.description = lessonData.description;
    if (lessonData.video_url !== undefined) payload.video_url = lessonData.video_url;
    if (lessonData.lesson_type !== undefined) payload.lesson_type = lessonData.lesson_type;
    if (lessonData.duration_minutes !== undefined) payload.duration_minutes = parseInt(lessonData.duration_minutes) || 0;
    if (lessonData.is_published !== undefined) payload.is_published = lessonData.is_published;
    if (lessonData.lesson_order !== undefined) payload.lesson_order = lessonData.lesson_order;
    if (lessonData.module_id !== undefined) payload.module_id = lessonData.module_id;

    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('course_lessons')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async deleteLesson(id) {
    const { error } = await supabase
      .from('course_lessons')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async reorderLessons(moduleId, updates) {
    const promises = updates.map(u => 
      supabase.from('course_lessons').update({ lesson_order: u.order }).eq('id', u.id)
    );
    await Promise.all(promises);
  },

  async moveLesson(lessonId, targetModuleId, newIndex) {
    const { error } = await supabase
        .from('course_lessons')
        .update({ module_id: targetModuleId, lesson_order: newIndex })
        .eq('id', lessonId);
    if (error) throw error;
  }
};