/*
  # Sample Course Data Insertion Script
  # Description: Inserts sample data for 6 functional modules with 2 courses each and corresponding lessons.
  # Usage: Run this script to populate the LMS with initial content.
  # Note: This script is idempotent. It checks for existing records before inserting to prevent duplicates.
  #       It attempts to assign an admin as the instructor; otherwise falls back to NULL.
*/

DO $$
DECLARE
    v_module_id uuid;
    v_course_id uuid;
    v_course_module_id uuid;
    v_admin_id uuid;
BEGIN
    -- Try to get an admin ID for instructor (optional, can be null)
    SELECT id INTO v_admin_id FROM public.profiles WHERE role IN ('admin', 'super_admin') LIMIT 1;
    
    -- ======================================================
    -- 1. GEOSCIENCE
    -- ======================================================
    
    -- 1.1 Ensure Module Exists
    SELECT id INTO v_module_id FROM public.modules WHERE name = 'Geoscience';
    IF v_module_id IS NULL THEN
        INSERT INTO public.modules (name, description, category)
        VALUES ('Geoscience', 'Study of earth sciences in petroleum exploration', 'Technical')
        RETURNING id INTO v_module_id;
    END IF;

    -- 1.2 Course 1: Fundamentals of Petroleum Geology
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Fundamentals of Petroleum Geology' AND module_id = v_module_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (title, description, module_id, instructor_id, is_published, total_modules, total_lessons, total_duration_hours, phase_requirement, course_thumbnail_url)
        VALUES ('Fundamentals of Petroleum Geology', 'Introduction to rock properties, sedimentary basins, and geological timescales fundamental to exploration.', v_module_id, v_admin_id, true, 1, 2, 4.5, 1, 'https://images.unsplash.com/photo-1518112166167-798839b25203?auto=format&fit=crop&q=80&w=600')
        RETURNING id INTO v_course_id;

        -- Course Module
        INSERT INTO public.course_modules (course_id, title, module_order, is_published)
        VALUES (v_course_id, 'Basics of Geology', 1, true)
        RETURNING id INTO v_course_module_id;

        -- Lessons
        INSERT INTO public.course_lessons (module_id, title, description, lesson_order, duration_minutes, is_published, content, lesson_type)
        VALUES 
        (v_course_module_id, 'Rock Types and Classifications', 'Learn about Igneous, Sedimentary, and Metamorphic rocks and their significance.', 1, 45, true, 'Detailed content about rock types...', 'video'),
        (v_course_module_id, 'Sedimentary Basins', 'Understanding the formation and classification of sedimentary basins.', 2, 60, true, 'Detailed content about basins...', 'video');
    END IF;

    -- 1.3 Course 2: Seismic Interpretation Basics
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Seismic Interpretation Basics' AND module_id = v_module_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (title, description, module_id, instructor_id, is_published, total_modules, total_lessons, total_duration_hours, phase_requirement, course_thumbnail_url)
        VALUES ('Seismic Interpretation Basics', 'Fundamentals of 2D and 3D seismic data acquisition, processing, and interpretation.', v_module_id, v_admin_id, true, 1, 2, 3.0, 1, 'https://images.unsplash.com/photo-1581093458791-9f302e6d8359?auto=format&fit=crop&q=80&w=600')
        RETURNING id INTO v_course_id;

        -- Course Module
        INSERT INTO public.course_modules (course_id, title, module_order, is_published)
        VALUES (v_course_id, 'Seismic Principles', 1, true)
        RETURNING id INTO v_course_module_id;

        -- Lessons
        INSERT INTO public.course_lessons (module_id, title, description, lesson_order, duration_minutes, is_published, content, lesson_type)
        VALUES 
        (v_course_module_id, 'Seismic Data Acquisition', 'Overview of land and marine seismic acquisition techniques.', 1, 50, true, 'Acquisition methods...', 'video'),
        (v_course_module_id, '2D vs 3D Seismic', 'Comparing dimensionality in seismic data and when to use each.', 2, 40, true, 'Comparison content...', 'video');
    END IF;


    -- ======================================================
    -- 2. RESERVOIR MANAGEMENT
    -- ======================================================
    
    -- 2.1 Ensure Module Exists
    SELECT id INTO v_module_id FROM public.modules WHERE name = 'Reservoir Management';
    IF v_module_id IS NULL THEN
        INSERT INTO public.modules (name, description, category)
        VALUES ('Reservoir Management', 'Optimizing recovery and reservoir performance', 'Technical')
        RETURNING id INTO v_module_id;
    END IF;

    -- 2.2 Course 1: Reservoir Engineering Principles
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Reservoir Engineering Principles' AND module_id = v_module_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (title, description, module_id, instructor_id, is_published, total_modules, total_lessons, total_duration_hours, phase_requirement, course_thumbnail_url)
        VALUES ('Reservoir Engineering Principles', 'Core concepts of reservoir behavior, fluid flow, and recovery mechanisms.', v_module_id, v_admin_id, true, 1, 2, 5.0, 1, 'https://images.unsplash.com/photo-1629805367683-198118090532?auto=format&fit=crop&q=80&w=600')
        RETURNING id INTO v_course_id;

        -- Course Module
        INSERT INTO public.course_modules (course_id, title, module_order, is_published)
        VALUES (v_course_id, 'Fluid Properties', 1, true)
        RETURNING id INTO v_course_module_id;

        -- Lessons
        INSERT INTO public.course_lessons (module_id, title, description, lesson_order, duration_minutes, is_published, content, lesson_type)
        VALUES 
        (v_course_module_id, 'PVT Analysis', 'Pressure Volume Temperature relationships in reservoir fluids.', 1, 55, true, 'PVT content...', 'video'),
        (v_course_module_id, 'Phase Behavior', 'Understanding phase diagrams and fluid states.', 2, 65, true, 'Phase behavior content...', 'video');
    END IF;

    -- 2.3 Course 2: Material Balance Essentials
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Material Balance Essentials' AND module_id = v_module_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (title, description, module_id, instructor_id, is_published, total_modules, total_lessons, total_duration_hours, phase_requirement, course_thumbnail_url)
        VALUES ('Material Balance Essentials', 'Calculations for reserves estimation and reservoir performance monitoring.', v_module_id, v_admin_id, true, 1, 2, 6.0, 1, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600')
        RETURNING id INTO v_course_id;

        -- Course Module
        INSERT INTO public.course_modules (course_id, title, module_order, is_published)
        VALUES (v_course_id, 'MBE Concepts', 1, true)
        RETURNING id INTO v_course_module_id;

        -- Lessons
        INSERT INTO public.course_lessons (module_id, title, description, lesson_order, duration_minutes, is_published, content, lesson_type)
        VALUES 
        (v_course_module_id, 'The MBE Equation', 'Derivation and application of the Material Balance Equation.', 1, 70, true, 'Equation content...', 'video'),
        (v_course_module_id, 'Drive Mechanisms', 'Analyzing Water drive, Gas cap drive, and Depletion drive.', 2, 60, true, 'Drive mechanisms content...', 'video');
    END IF;


    -- ======================================================
    -- 3. DRILLING & COMPLETION
    -- ======================================================
    
    -- 3.1 Ensure Module Exists
    SELECT id INTO v_module_id FROM public.modules WHERE name = 'Drilling & Completion';
    IF v_module_id IS NULL THEN
        INSERT INTO public.modules (name, description, category)
        VALUES ('Drilling & Completion', 'Well construction and completion techniques', 'Technical')
        RETURNING id INTO v_module_id;
    END IF;

    -- 3.2 Course 1: Drilling Engineering 101
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Drilling Engineering 101' AND module_id = v_module_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (title, description, module_id, instructor_id, is_published, total_modules, total_lessons, total_duration_hours, phase_requirement, course_thumbnail_url)
        VALUES ('Drilling Engineering 101', 'Basics of drilling operations, rig components, and wellbore construction.', v_module_id, v_admin_id, true, 1, 2, 4.0, 1, 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600')
        RETURNING id INTO v_course_id;

        -- Course Module
        INSERT INTO public.course_modules (course_id, title, module_order, is_published)
        VALUES (v_course_id, 'Rig Systems', 1, true)
        RETURNING id INTO v_course_module_id;

        -- Lessons
        INSERT INTO public.course_lessons (module_id, title, description, lesson_order, duration_minutes, is_published, content, lesson_type)
        VALUES 
        (v_course_module_id, 'Hoisting System', 'Function and components of the hoisting system: Drawworks, block, and line.', 1, 45, true, 'Hoisting content...', 'video'),
        (v_course_module_id, 'Rotating System', 'Comparison of Kelly vs Top Drive systems.', 2, 50, true, 'Rotating content...', 'video');
    END IF;

    -- 3.3 Course 2: Well Completion Design
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Well Completion Design' AND module_id = v_module_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (title, description, module_id, instructor_id, is_published, total_modules, total_lessons, total_duration_hours, phase_requirement, course_thumbnail_url)
        VALUES ('Well Completion Design', 'Strategies for finishing wells to optimize production and ensure integrity.', v_module_id, v_admin_id, true, 1, 2, 4.5, 1, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600')
        RETURNING id INTO v_course_id;

        -- Course Module
        INSERT INTO public.course_modules (course_id, title, module_order, is_published)
        VALUES (v_course_id, 'Completion Types', 1, true)
        RETURNING id INTO v_course_module_id;

        -- Lessons
        INSERT INTO public.course_lessons (module_id, title, description, lesson_order, duration_minutes, is_published, content, lesson_type)
        VALUES 
        (v_course_module_id, 'Open Hole Completions', 'Pros, cons, and applications of open hole completions.', 1, 55, true, 'Open hole content...', 'video'),
        (v_course_module_id, 'Cased Hole Completions', 'Techniques for perforating and cementing cased holes.', 2, 60, true, 'Cased hole content...', 'video');
    END IF;


    -- ======================================================
    -- 4. PRODUCTION OPERATIONS
    -- ======================================================
    
    -- 4.1 Ensure Module Exists
    SELECT id INTO v_module_id FROM public.modules WHERE name = 'Production Operations';
    IF v_module_id IS NULL THEN
        INSERT INTO public.modules (name, description, category)
        VALUES ('Production Operations', 'Managing and optimizing production', 'Technical')
        RETURNING id INTO v_module_id;
    END IF;

    -- 4.2 Course 1: Production Systems Analysis
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Production Systems Analysis' AND module_id = v_module_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (title, description, module_id, instructor_id, is_published, total_modules, total_lessons, total_duration_hours, phase_requirement, course_thumbnail_url)
        VALUES ('Production Systems Analysis', 'Optimizing flow from reservoir to surface using nodal analysis.', v_module_id, v_admin_id, true, 1, 2, 5.5, 1, 'https://images.unsplash.com/photo-1535320903710-d9cf113d20c5?auto=format&fit=crop&q=80&w=600')
        RETURNING id INTO v_course_id;

        -- Course Module
        INSERT INTO public.course_modules (course_id, title, module_order, is_published)
        VALUES (v_course_id, 'Nodal Analysis', 1, true)
        RETURNING id INTO v_course_module_id;

        -- Lessons
        INSERT INTO public.course_lessons (module_id, title, description, lesson_order, duration_minutes, is_published, content, lesson_type)
        VALUES 
        (v_course_module_id, 'Inflow Performance', 'Understanding IPR curves and skin factor.', 1, 60, true, 'IPR content...', 'video'),
        (v_course_module_id, 'Outflow Performance', 'Analyzing tubing performance curves (VLP).', 2, 60, true, 'VLP content...', 'video');
    END IF;

    -- 4.3 Course 2: Artificial Lift Methods
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Artificial Lift Methods' AND module_id = v_module_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (title, description, module_id, instructor_id, is_published, total_modules, total_lessons, total_duration_hours, phase_requirement, course_thumbnail_url)
        VALUES ('Artificial Lift Methods', 'Techniques to boost production when natural flow is insufficient.', v_module_id, v_admin_id, true, 1, 2, 5.0, 1, 'https://images.unsplash.com/photo-1629805367734-d88667b9366d?auto=format&fit=crop&q=80&w=600')
        RETURNING id INTO v_course_id;

        -- Course Module
        INSERT INTO public.course_modules (course_id, title, module_order, is_published)
        VALUES (v_course_id, 'Lift Overview', 1, true)
        RETURNING id INTO v_course_module_id;

        -- Lessons
        INSERT INTO public.course_lessons (module_id, title, description, lesson_order, duration_minutes, is_published, content, lesson_type)
        VALUES 
        (v_course_module_id, 'Gas Lift', 'Principles and design of gas injection lift systems.', 1, 50, true, 'Gas lift content...', 'video'),
        (v_course_module_id, 'ESP Systems', 'Components and operation of Electric Submersible Pumps.', 2, 55, true, 'ESP content...', 'video');
    END IF;


    -- ======================================================
    -- 5. FACILITIES ENGINEERING
    -- ======================================================
    
    -- 5.1 Ensure Module Exists
    SELECT id INTO v_module_id FROM public.modules WHERE name = 'Facilities Engineering';
    IF v_module_id IS NULL THEN
        INSERT INTO public.modules (name, description, category)
        VALUES ('Facilities Engineering', 'Surface equipment and processing', 'Technical')
        RETURNING id INTO v_module_id;
    END IF;

    -- 5.2 Course 1: Surface Facilities Design
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Surface Facilities Design' AND module_id = v_module_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (title, description, module_id, instructor_id, is_published, total_modules, total_lessons, total_duration_hours, phase_requirement, course_thumbnail_url)
        VALUES ('Surface Facilities Design', 'Design and operation of surface processing equipment for oil and gas.', v_module_id, v_admin_id, true, 1, 2, 4.0, 1, 'https://images.unsplash.com/photo-1574359679236-c4d3725b8a6a?auto=format&fit=crop&q=80&w=600')
        RETURNING id INTO v_course_id;

        -- Course Module
        INSERT INTO public.course_modules (course_id, title, module_order, is_published)
        VALUES (v_course_id, 'Separation Technology', 1, true)
        RETURNING id INTO v_course_module_id;

        -- Lessons
        INSERT INTO public.course_lessons (module_id, title, description, lesson_order, duration_minutes, is_published, content, lesson_type)
        VALUES 
        (v_course_module_id, 'Two-Phase Separators', 'Mechanism of separating gas and liquid streams.', 1, 45, true, '2-phase content...', 'video'),
        (v_course_module_id, 'Three-Phase Separators', 'Separating gas, oil, and water in production facilities.', 2, 50, true, '3-phase content...', 'video');
    END IF;

    -- 5.3 Course 2: Pipeline Systems
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Pipeline Systems' AND module_id = v_module_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (title, description, module_id, instructor_id, is_published, total_modules, total_lessons, total_duration_hours, phase_requirement, course_thumbnail_url)
        VALUES ('Pipeline Systems', 'Engineering, design, and maintenance of hydrocarbon transport pipelines.', v_module_id, v_admin_id, true, 1, 2, 3.5, 1, 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&q=80&w=600')
        RETURNING id INTO v_course_id;

        -- Course Module
        INSERT INTO public.course_modules (course_id, title, module_order, is_published)
        VALUES (v_course_id, 'Flow Assurance', 1, true)
        RETURNING id INTO v_course_module_id;

        -- Lessons
        INSERT INTO public.course_lessons (module_id, title, description, lesson_order, duration_minutes, is_published, content, lesson_type)
        VALUES 
        (v_course_module_id, 'Hydrates and Wax', 'Strategies for preventing and managing hydrates and wax.', 1, 40, true, 'Hydrates content...', 'video'),
        (v_course_module_id, 'Corrosion Control', 'Monitoring and mitigation techniques for pipeline integrity.', 2, 45, true, 'Corrosion content...', 'video');
    END IF;


    -- ======================================================
    -- 6. ECONOMICS & PROJECT MANAGEMENT
    -- ======================================================
    
    -- 6.1 Ensure Module Exists
    SELECT id INTO v_module_id FROM public.modules WHERE name = 'Economics & Project Management';
    IF v_module_id IS NULL THEN
        INSERT INTO public.modules (name, description, category)
        VALUES ('Economics & Project Management', 'Business side of oil and gas', 'Management')
        RETURNING id INTO v_module_id;
    END IF;

    -- 6.2 Course 1: Petroleum Economics
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Petroleum Economics' AND module_id = v_module_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (title, description, module_id, instructor_id, is_published, total_modules, total_lessons, total_duration_hours, phase_requirement, course_thumbnail_url)
        VALUES ('Petroleum Economics', 'Financial decision making, investment analysis, and economic evaluation in the petroleum industry.', v_module_id, v_admin_id, true, 1, 2, 5.0, 1, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600')
        RETURNING id INTO v_course_id;

        -- Course Module
        INSERT INTO public.course_modules (course_id, title, module_order, is_published)
        VALUES (v_course_id, 'Economic Indicators', 1, true)
        RETURNING id INTO v_course_module_id;

        -- Lessons
        INSERT INTO public.course_lessons (module_id, title, description, lesson_order, duration_minutes, is_published, content, lesson_type)
        VALUES 
        (v_course_module_id, 'NPV and IRR', 'Calculating Net Present Value (NPV) and Internal Rate of Return (IRR).', 1, 60, true, 'NPV/IRR content...', 'video'),
        (v_course_module_id, 'Cash Flow Analysis', 'Building and analyzing cash flow models for projects.', 2, 60, true, 'Cash flow content...', 'video');
    END IF;

    -- 6.3 Course 2: Oil & Gas Project Management
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Oil & Gas Project Management' AND module_id = v_module_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (title, description, module_id, instructor_id, is_published, total_modules, total_lessons, total_duration_hours, phase_requirement, course_thumbnail_url)
        VALUES ('Oil & Gas Project Management', 'Principles of managing complex capital projects in the energy sector.', v_module_id, v_admin_id, true, 1, 2, 4.5, 1, 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=600')
        RETURNING id INTO v_course_id;

        -- Course Module
        INSERT INTO public.course_modules (course_id, title, module_order, is_published)
        VALUES (v_course_id, 'Project Lifecycle', 1, true)
        RETURNING id INTO v_course_module_id;

        -- Lessons
        INSERT INTO public.course_lessons (module_id, title, description, lesson_order, duration_minutes, is_published, content, lesson_type)
        VALUES 
        (v_course_module_id, 'Project Stages', 'Understanding FEL 1, 2, 3 and Execution phases.', 1, 50, true, 'Stages content...', 'video'),
        (v_course_module_id, 'Risk Management', 'Identifying, assessing, and mitigating project risks.', 2, 55, true, 'Risk content...', 'video');
    END IF;

END $$;

-- ======================================================
-- VERIFICATION QUERIES
-- ======================================================
-- Run these manually to verify data insertion

/*
-- Check Total Counts
SELECT 
    (SELECT COUNT(*) FROM modules) as total_modules,
    (SELECT COUNT(*) FROM courses) as total_courses,
    (SELECT COUNT(*) FROM course_lessons) as total_lessons;

-- Check Breakdown by Module
SELECT 
    m.name as module_name, 
    COUNT(DISTINCT c.id) as course_count, 
    COUNT(DISTINCT cl.id) as lesson_count 
FROM modules m
LEFT JOIN courses c ON m.id = c.module_id
LEFT JOIN course_modules cm ON c.id = cm.course_id
LEFT JOIN course_lessons cl ON cm.id = cl.module_id
GROUP BY m.name
ORDER BY m.name;

-- Detailed Course Check
SELECT 
    c.title as course_title,
    m.name as module_name,
    COUNT(cl.id) as lessons
FROM courses c
JOIN modules m ON c.module_id = m.id
LEFT JOIN course_modules cm ON c.id = cm.course_id
LEFT JOIN course_lessons cl ON cm.id = cl.module_id
GROUP BY c.title, m.name
ORDER BY m.name, c.title;
*/