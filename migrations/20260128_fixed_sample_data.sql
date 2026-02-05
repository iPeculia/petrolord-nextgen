/*
  # Sample Data Insertion Script - Courses, Modules, and Lessons
  # 
  # INSTRUCTIONS FOR RUNNING:
  # 1. This script is designed to be idempotent-ish for modules (checks name), 
  #    but effectively creates new courses each run if titles don't match exactly.
  # 2. It requires the 'public.modules', 'public.courses', 'public.course_modules', 
  #    and 'public.course_lessons' tables to exist.
  # 3. Safe to re-run? It tries to find existing records to avoid duplicates where possible,
  #    but assumes clean-ish state for best results.
  # 
  # HIERARCHY:
  # Module (Global Category) -> Course -> Course Module (Section) -> Course Lesson
*/

DO $$
DECLARE
    v_admin_id uuid;
    
    -- Module IDs
    v_geo_id uuid;
    v_res_id uuid;
    v_drill_id uuid;
    v_prod_id uuid;
    v_fac_id uuid;
    v_econ_id uuid;

    -- Course IDs
    v_course_id uuid;
    
    -- Course Module (Section) IDs
    v_section_id uuid;

BEGIN
    -- 1. Get an Admin/Instructor ID
    -- Try to find a profile with admin role, or fallback to any profile
    SELECT id INTO v_admin_id FROM public.profiles WHERE role IN ('admin', 'super_admin') LIMIT 1;
    IF v_admin_id IS NULL THEN
        SELECT id INTO v_admin_id FROM public.profiles LIMIT 1;
    END IF;

    -- =================================================================
    -- MODULE 1: GEOSCIENCE
    -- =================================================================
    
    -- Ensure Global Module Exists
    SELECT id INTO v_geo_id FROM public.modules WHERE name = 'Geoscience';
    IF v_geo_id IS NULL THEN
        INSERT INTO public.modules (name, description, category, icon, created_at, updated_at)
        VALUES ('Geoscience', 'Study of earth sciences in petroleum exploration', 'Technical', 'globe', NOW(), NOW())
        RETURNING id INTO v_geo_id;
    END IF;

    -- Course 1.1: Fundamentals of Petroleum Geology
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Fundamentals of Petroleum Geology' AND module_id = v_geo_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (
            id, title, description, category, difficulty_level, phase_requirement, 
            duration_weeks, total_duration_hours, learning_outcomes, instructor_id, 
            module_id, learning_objectives, has_certificate, certificate_program, 
            certificate_title, published, is_published, course_thumbnail_url, 
            created_at, updated_at, total_modules, total_lessons, rating, 
            review_count, enrollment_count, certificate_validity_months
        ) VALUES (
            gen_random_uuid(),
            'Fundamentals of Petroleum Geology',
            'Sample data for Fundamentals of Petroleum Geology. Introduction to rock properties, sedimentary basins, and geological timescales.',
            'Geoscience',
            'Beginner',
            1,
            4,
            20,
            '["Understand basic geology", "Identify rock types", "Map sedimentary basins"]'::jsonb,
            v_admin_id,
            v_geo_id,
            ARRAY['Identify igneous, sedimentary, and metamorphic rocks', 'Understand plate tectonics'],
            true,
            'Professional',
            'Fundamentals of Petroleum Geology Certificate',
            true,
            true,
            'https://images.unsplash.com/photo-1518112166167-798839b25203?auto=format&fit=crop&q=80&w=600',
            NOW(),
            NOW(),
            1,
            2,
            4.5,
            120,
            350,
            12
        ) RETURNING id INTO v_course_id;

        -- Create Section (Course Module)
        INSERT INTO public.course_modules (course_id, title, description, module_order, is_published)
        VALUES (v_course_id, 'Basic Geology Concepts', 'Core concepts of geology.', 1, true)
        RETURNING id INTO v_section_id;

        -- Create Lessons
        INSERT INTO public.course_lessons (
            module_id, course_id, title, description, content, video_url, lesson_order, duration_minutes, is_published, lesson_type
        ) VALUES 
        (v_section_id, v_course_id, 'Rock Types', 'Introduction to the three main rock types.', 'Detailed text content about rocks...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 45, true, 'video'),
        (v_section_id, v_course_id, 'Sedimentary Basins', 'How basins form and trap hydrocarbons.', 'Detailed text content about basins...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 60, true, 'video');
    END IF;

    -- Course 1.2: Seismic Interpretation Basics
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Seismic Interpretation Basics' AND module_id = v_geo_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (
            id, title, description, category, difficulty_level, phase_requirement, 
            duration_weeks, total_duration_hours, learning_outcomes, instructor_id, 
            module_id, learning_objectives, has_certificate, certificate_program, 
            certificate_title, published, is_published, course_thumbnail_url, 
            created_at, updated_at, total_modules, total_lessons, rating, 
            review_count, enrollment_count, certificate_validity_months
        ) VALUES (
            gen_random_uuid(),
            'Seismic Interpretation Basics',
            'Sample data for Seismic Interpretation Basics. Fundamentals of 2D and 3D seismic data acquisition.',
            'Geoscience',
            'Intermediate',
            2,
            6,
            30,
            '["Interpret 2D seismic lines", "Understand 3D seismic cubes", "Identify faults"]'::jsonb,
            v_admin_id,
            v_geo_id,
            ARRAY['Master seismic attributes', 'Horizon picking'],
            true,
            'Professional',
            'Seismic Interpretation Certificate',
            true,
            true,
            'https://images.unsplash.com/photo-1581093458791-9f302e6d8359?auto=format&fit=crop&q=80&w=600',
            NOW(),
            NOW(),
            1,
            2,
            4.6,
            85,
            210,
            12
        ) RETURNING id INTO v_course_id;

        INSERT INTO public.course_modules (course_id, title, description, module_order, is_published)
        VALUES (v_course_id, 'Seismic Data Acquisition', 'Collecting data.', 1, true)
        RETURNING id INTO v_section_id;

        INSERT INTO public.course_lessons (
            module_id, course_id, title, description, content, video_url, lesson_order, duration_minutes, is_published, lesson_type
        ) VALUES 
        (v_section_id, v_course_id, '2D vs 3D', 'Differences in dimensionality.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 50, true, 'video'),
        (v_section_id, v_course_id, 'Fault Identification', 'Finding faults in data.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 55, true, 'video');
    END IF;


    -- =================================================================
    -- MODULE 2: RESERVOIR MANAGEMENT
    -- =================================================================
    
    SELECT id INTO v_res_id FROM public.modules WHERE name = 'Reservoir Management';
    IF v_res_id IS NULL THEN
        INSERT INTO public.modules (name, description, category, icon, created_at, updated_at)
        VALUES ('Reservoir Management', 'Optimizing recovery and reservoir performance', 'Technical', 'layers', NOW(), NOW())
        RETURNING id INTO v_res_id;
    END IF;

    -- Course 2.1: Reservoir Engineering Principles
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Reservoir Engineering Principles' AND module_id = v_res_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (
            id, title, description, category, difficulty_level, phase_requirement, 
            duration_weeks, total_duration_hours, learning_outcomes, instructor_id, 
            module_id, learning_objectives, has_certificate, certificate_program, 
            certificate_title, published, is_published, course_thumbnail_url, 
            created_at, updated_at, total_modules, total_lessons, rating, 
            review_count, enrollment_count, certificate_validity_months
        ) VALUES (
            gen_random_uuid(),
            'Reservoir Engineering Principles',
            'Sample data for Reservoir Engineering Principles. Core concepts of reservoir behavior and fluid flow.',
            'Reservoir Management',
            'Beginner',
            1,
            5,
            25,
            '["Calculate OOIP", "Understand drive mechanisms"]'::jsonb,
            v_admin_id,
            v_res_id,
            ARRAY['PVT Analysis', 'Material Balance introduction'],
            true,
            'Professional',
            'Reservoir Engineering Certificate',
            true,
            true,
            'https://images.unsplash.com/photo-1629805367683-198118090532?auto=format&fit=crop&q=80&w=600',
            NOW(),
            NOW(),
            1,
            2,
            4.7,
            150,
            400,
            12
        ) RETURNING id INTO v_course_id;

        INSERT INTO public.course_modules (course_id, title, description, module_order, is_published)
        VALUES (v_course_id, 'Fluid Properties', 'PVT and Phases.', 1, true)
        RETURNING id INTO v_section_id;

        INSERT INTO public.course_lessons (
            module_id, course_id, title, description, content, video_url, lesson_order, duration_minutes, is_published, lesson_type
        ) VALUES 
        (v_section_id, v_course_id, 'PVT Analysis', 'Pressure Volume Temperature.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 55, true, 'video'),
        (v_section_id, v_course_id, 'Phase Behavior', 'Phase diagrams.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 60, true, 'video');
    END IF;

    -- Course 2.2: Material Balance Essentials
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Material Balance Essentials' AND module_id = v_res_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (
            id, title, description, category, difficulty_level, phase_requirement, 
            duration_weeks, total_duration_hours, learning_outcomes, instructor_id, 
            module_id, learning_objectives, has_certificate, certificate_program, 
            certificate_title, published, is_published, course_thumbnail_url, 
            created_at, updated_at, total_modules, total_lessons, rating, 
            review_count, enrollment_count, certificate_validity_months
        ) VALUES (
            gen_random_uuid(),
            'Material Balance Essentials',
            'Sample data for Material Balance Essentials. Calculations for reserves estimation.',
            'Reservoir Management',
            'Intermediate',
            2,
            5,
            28,
            '["Apply MBE equation", "Estimate reserves"]'::jsonb,
            v_admin_id,
            v_res_id,
            ARRAY['Gas cap drive analysis', 'Water drive analysis'],
            true,
            'Professional',
            'Material Balance Certificate',
            true,
            true,
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
            NOW(),
            NOW(),
            1,
            2,
            4.8,
            90,
            180,
            12
        ) RETURNING id INTO v_course_id;

        INSERT INTO public.course_modules (course_id, title, description, module_order, is_published)
        VALUES (v_course_id, 'The MBE Equation', 'Derivation and usage.', 1, true)
        RETURNING id INTO v_section_id;

        INSERT INTO public.course_lessons (
            module_id, course_id, title, description, content, video_url, lesson_order, duration_minutes, is_published, lesson_type
        ) VALUES 
        (v_section_id, v_course_id, 'General Equation', 'The universal material balance equation.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 65, true, 'video'),
        (v_section_id, v_course_id, 'Drive Indices', 'Calculating drive indices.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 50, true, 'video');
    END IF;


    -- =================================================================
    -- MODULE 3: DRILLING & COMPLETION
    -- =================================================================
    
    SELECT id INTO v_drill_id FROM public.modules WHERE name = 'Drilling & Completion';
    IF v_drill_id IS NULL THEN
        INSERT INTO public.modules (name, description, category, icon, created_at, updated_at)
        VALUES ('Drilling & Completion', 'Well construction and completion techniques', 'Technical', 'tool', NOW(), NOW())
        RETURNING id INTO v_drill_id;
    END IF;

    -- Course 3.1: Drilling Engineering 101
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Drilling Engineering 101' AND module_id = v_drill_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (
            id, title, description, category, difficulty_level, phase_requirement, 
            duration_weeks, total_duration_hours, learning_outcomes, instructor_id, 
            module_id, learning_objectives, has_certificate, certificate_program, 
            certificate_title, published, is_published, course_thumbnail_url, 
            created_at, updated_at, total_modules, total_lessons, rating, 
            review_count, enrollment_count, certificate_validity_months
        ) VALUES (
            gen_random_uuid(),
            'Drilling Engineering 101',
            'Sample data for Drilling Engineering 101. Basics of drilling operations and rig components.',
            'Drilling & Completion',
            'Beginner',
            1,
            4,
            22,
            '["Identify rig components", "Understand drilling fluids"]'::jsonb,
            v_admin_id,
            v_drill_id,
            ARRAY['Hoisting system', 'Circulating system'],
            true,
            'Professional',
            'Drilling Basics Certificate',
            true,
            true,
            'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600',
            NOW(),
            NOW(),
            1,
            2,
            4.6,
            130,
            300,
            12
        ) RETURNING id INTO v_course_id;

        INSERT INTO public.course_modules (course_id, title, description, module_order, is_published)
        VALUES (v_course_id, 'Rig Systems', 'Major components of a drilling rig.', 1, true)
        RETURNING id INTO v_section_id;

        INSERT INTO public.course_lessons (
            module_id, course_id, title, description, content, video_url, lesson_order, duration_minutes, is_published, lesson_type
        ) VALUES 
        (v_section_id, v_course_id, 'Hoisting System', 'Block, tackle, and drawworks.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 40, true, 'video'),
        (v_section_id, v_course_id, 'Rotating System', 'Top drive vs Kelly.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 45, true, 'video');
    END IF;

    -- Course 3.2: Well Completion Design
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Well Completion Design' AND module_id = v_drill_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (
            id, title, description, category, difficulty_level, phase_requirement, 
            duration_weeks, total_duration_hours, learning_outcomes, instructor_id, 
            module_id, learning_objectives, has_certificate, certificate_program, 
            certificate_title, published, is_published, course_thumbnail_url, 
            created_at, updated_at, total_modules, total_lessons, rating, 
            review_count, enrollment_count, certificate_validity_months
        ) VALUES (
            gen_random_uuid(),
            'Well Completion Design',
            'Sample data for Well Completion Design. Strategies for finishing wells.',
            'Drilling & Completion',
            'Intermediate',
            2,
            5,
            26,
            '["Select completion type", "Design perforations"]'::jsonb,
            v_admin_id,
            v_drill_id,
            ARRAY['Open hole vs Cased hole', 'Sand control'],
            true,
            'Professional',
            'Completion Design Certificate',
            true,
            true,
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
            NOW(),
            NOW(),
            1,
            2,
            4.7,
            75,
            190,
            12
        ) RETURNING id INTO v_course_id;

        INSERT INTO public.course_modules (course_id, title, description, module_order, is_published)
        VALUES (v_course_id, 'Completion Types', 'Types of completions.', 1, true)
        RETURNING id INTO v_section_id;

        INSERT INTO public.course_lessons (
            module_id, course_id, title, description, content, video_url, lesson_order, duration_minutes, is_published, lesson_type
        ) VALUES 
        (v_section_id, v_course_id, 'Open Hole', 'Benefits and risks.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 50, true, 'video'),
        (v_section_id, v_course_id, 'Cased Hole', 'Cementing and perforating.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 55, true, 'video');
    END IF;


    -- =================================================================
    -- MODULE 4: PRODUCTION OPERATIONS
    -- =================================================================
    
    SELECT id INTO v_prod_id FROM public.modules WHERE name = 'Production Operations';
    IF v_prod_id IS NULL THEN
        INSERT INTO public.modules (name, description, category, icon, created_at, updated_at)
        VALUES ('Production Operations', 'Managing and optimizing production', 'Technical', 'settings', NOW(), NOW())
        RETURNING id INTO v_prod_id;
    END IF;

    -- Course 4.1: Production Systems Analysis
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Production Systems Analysis' AND module_id = v_prod_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (
            id, title, description, category, difficulty_level, phase_requirement, 
            duration_weeks, total_duration_hours, learning_outcomes, instructor_id, 
            module_id, learning_objectives, has_certificate, certificate_program, 
            certificate_title, published, is_published, course_thumbnail_url, 
            created_at, updated_at, total_modules, total_lessons, rating, 
            review_count, enrollment_count, certificate_validity_months
        ) VALUES (
            gen_random_uuid(),
            'Production Systems Analysis',
            'Sample data for Production Systems Analysis. Optimizing flow using nodal analysis.',
            'Production Operations',
            'Intermediate',
            2,
            6,
            32,
            '["Perform Nodal Analysis", "Optimize tubing size"]'::jsonb,
            v_admin_id,
            v_prod_id,
            ARRAY['Inflow Performance Relationship', 'Tubing Performance Curve'],
            true,
            'Professional',
            'Production Analysis Certificate',
            true,
            true,
            'https://images.unsplash.com/photo-1535320903710-d9cf113d20c5?auto=format&fit=crop&q=80&w=600',
            NOW(),
            NOW(),
            1,
            2,
            4.8,
            110,
            280,
            12
        ) RETURNING id INTO v_course_id;

        INSERT INTO public.course_modules (course_id, title, description, module_order, is_published)
        VALUES (v_course_id, 'Nodal Analysis', 'System analysis.', 1, true)
        RETURNING id INTO v_section_id;

        INSERT INTO public.course_lessons (
            module_id, course_id, title, description, content, video_url, lesson_order, duration_minutes, is_published, lesson_type
        ) VALUES 
        (v_section_id, v_course_id, 'IPR Curves', 'Inflow performance.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 60, true, 'video'),
        (v_section_id, v_course_id, 'VLP Curves', 'Vertical Lift Performance.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 60, true, 'video');
    END IF;

    -- Course 4.2: Artificial Lift Methods
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Artificial Lift Methods' AND module_id = v_prod_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (
            id, title, description, category, difficulty_level, phase_requirement, 
            duration_weeks, total_duration_hours, learning_outcomes, instructor_id, 
            module_id, learning_objectives, has_certificate, certificate_program, 
            certificate_title, published, is_published, course_thumbnail_url, 
            created_at, updated_at, total_modules, total_lessons, rating, 
            review_count, enrollment_count, certificate_validity_months
        ) VALUES (
            gen_random_uuid(),
            'Artificial Lift Methods',
            'Sample data for Artificial Lift Methods. Boosting production when natural flow fails.',
            'Production Operations',
            'Advanced',
            3,
            6,
            35,
            '["Design ESP systems", "Optimize Gas Lift"]'::jsonb,
            v_admin_id,
            v_prod_id,
            ARRAY['Pump curves', 'Gas lift valves'],
            true,
            'Professional',
            'Artificial Lift Certificate',
            true,
            true,
            'https://images.unsplash.com/photo-1629805367734-d88667b9366d?auto=format&fit=crop&q=80&w=600',
            NOW(),
            NOW(),
            1,
            2,
            4.9,
            95,
            220,
            12
        ) RETURNING id INTO v_course_id;

        INSERT INTO public.course_modules (course_id, title, description, module_order, is_published)
        VALUES (v_course_id, 'Lift Systems', 'Types of lift.', 1, true)
        RETURNING id INTO v_section_id;

        INSERT INTO public.course_lessons (
            module_id, course_id, title, description, content, video_url, lesson_order, duration_minutes, is_published, lesson_type
        ) VALUES 
        (v_section_id, v_course_id, 'Gas Lift Design', 'Continuous vs Intermittent.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 65, true, 'video'),
        (v_section_id, v_course_id, 'ESP Selection', 'Pump sizing.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 70, true, 'video');
    END IF;


    -- =================================================================
    -- MODULE 5: FACILITIES ENGINEERING
    -- =================================================================
    
    SELECT id INTO v_fac_id FROM public.modules WHERE name = 'Facilities Engineering';
    IF v_fac_id IS NULL THEN
        INSERT INTO public.modules (name, description, category, icon, created_at, updated_at)
        VALUES ('Facilities Engineering', 'Surface equipment and processing', 'Technical', 'truck', NOW(), NOW())
        RETURNING id INTO v_fac_id;
    END IF;

    -- Course 5.1: Surface Facilities Design
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Surface Facilities Design' AND module_id = v_fac_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (
            id, title, description, category, difficulty_level, phase_requirement, 
            duration_weeks, total_duration_hours, learning_outcomes, instructor_id, 
            module_id, learning_objectives, has_certificate, certificate_program, 
            certificate_title, published, is_published, course_thumbnail_url, 
            created_at, updated_at, total_modules, total_lessons, rating, 
            review_count, enrollment_count, certificate_validity_months
        ) VALUES (
            gen_random_uuid(),
            'Surface Facilities Design',
            'Sample data for Surface Facilities Design. Separators, treaters, and storage.',
            'Facilities Engineering',
            'Intermediate',
            2,
            5,
            24,
            '["Size separators", "Design storage tanks"]'::jsonb,
            v_admin_id,
            v_fac_id,
            ARRAY['Retention time', 'Phase separation'],
            true,
            'Professional',
            'Facilities Design Certificate',
            true,
            true,
            'https://images.unsplash.com/photo-1574359679236-c4d3725b8a6a?auto=format&fit=crop&q=80&w=600',
            NOW(),
            NOW(),
            1,
            2,
            4.6,
            80,
            160,
            12
        ) RETURNING id INTO v_course_id;

        INSERT INTO public.course_modules (course_id, title, description, module_order, is_published)
        VALUES (v_course_id, 'Separation', 'Gas-Oil-Water separation.', 1, true)
        RETURNING id INTO v_section_id;

        INSERT INTO public.course_lessons (
            module_id, course_id, title, description, content, video_url, lesson_order, duration_minutes, is_published, lesson_type
        ) VALUES 
        (v_section_id, v_course_id, 'Two-Phase Separators', 'Vertical vs Horizontal.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 50, true, 'video'),
        (v_section_id, v_course_id, 'Three-Phase Separators', 'Removing water.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 55, true, 'video');
    END IF;

    -- Course 5.2: Pipeline Systems
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Pipeline Systems' AND module_id = v_fac_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (
            id, title, description, category, difficulty_level, phase_requirement, 
            duration_weeks, total_duration_hours, learning_outcomes, instructor_id, 
            module_id, learning_objectives, has_certificate, certificate_program, 
            certificate_title, published, is_published, course_thumbnail_url, 
            created_at, updated_at, total_modules, total_lessons, rating, 
            review_count, enrollment_count, certificate_validity_months
        ) VALUES (
            gen_random_uuid(),
            'Pipeline Systems',
            'Sample data for Pipeline Systems. Transport and flow assurance.',
            'Facilities Engineering',
            'Advanced',
            3,
            6,
            30,
            '["Manage flow assurance", "Prevent corrosion"]'::jsonb,
            v_admin_id,
            v_fac_id,
            ARRAY['Hydrate inhibition', 'Pigging operations'],
            true,
            'Professional',
            'Pipeline Engineering Certificate',
            true,
            true,
            'https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&q=80&w=600',
            NOW(),
            NOW(),
            1,
            2,
            4.7,
            70,
            150,
            12
        ) RETURNING id INTO v_course_id;

        INSERT INTO public.course_modules (course_id, title, description, module_order, is_published)
        VALUES (v_course_id, 'Pipeline Operations', 'Maintenance and assurance.', 1, true)
        RETURNING id INTO v_section_id;

        INSERT INTO public.course_lessons (
            module_id, course_id, title, description, content, video_url, lesson_order, duration_minutes, is_published, lesson_type
        ) VALUES 
        (v_section_id, v_course_id, 'Flow Assurance', 'Wax and hydrates.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 60, true, 'video'),
        (v_section_id, v_course_id, 'Corrosion Control', 'Cathodic protection.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 60, true, 'video');
    END IF;


    -- =================================================================
    -- MODULE 6: ECONOMICS & PROJECT MANAGEMENT
    -- =================================================================
    
    SELECT id INTO v_econ_id FROM public.modules WHERE name = 'Economics & Project Management';
    IF v_econ_id IS NULL THEN
        INSERT INTO public.modules (name, description, category, icon, created_at, updated_at)
        VALUES ('Economics & Project Management', 'Business side of oil and gas', 'Management', 'trending-up', NOW(), NOW())
        RETURNING id INTO v_econ_id;
    END IF;

    -- Course 6.1: Petroleum Economics
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Petroleum Economics' AND module_id = v_econ_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (
            id, title, description, category, difficulty_level, phase_requirement, 
            duration_weeks, total_duration_hours, learning_outcomes, instructor_id, 
            module_id, learning_objectives, has_certificate, certificate_program, 
            certificate_title, published, is_published, course_thumbnail_url, 
            created_at, updated_at, total_modules, total_lessons, rating, 
            review_count, enrollment_count, certificate_validity_months
        ) VALUES (
            gen_random_uuid(),
            'Petroleum Economics',
            'Sample data for Petroleum Economics. NPV, IRR, and cash flow analysis.',
            'Economics & Project Management',
            'Intermediate',
            2,
            5,
            25,
            '["Calculate NPV and IRR", "Construct cash flow models"]'::jsonb,
            v_admin_id,
            v_econ_id,
            ARRAY['Time value of money', 'Fiscal regimes'],
            true,
            'Professional',
            'Petroleum Economics Certificate',
            true,
            true,
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
            NOW(),
            NOW(),
            1,
            2,
            4.8,
            140,
            320,
            12
        ) RETURNING id INTO v_course_id;

        INSERT INTO public.course_modules (course_id, title, description, module_order, is_published)
        VALUES (v_course_id, 'Economic Indicators', 'Key metrics.', 1, true)
        RETURNING id INTO v_section_id;

        INSERT INTO public.course_lessons (
            module_id, course_id, title, description, content, video_url, lesson_order, duration_minutes, is_published, lesson_type
        ) VALUES 
        (v_section_id, v_course_id, 'NPV Analysis', 'Net Present Value.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 60, true, 'video'),
        (v_section_id, v_course_id, 'IRR Calculation', 'Internal Rate of Return.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 60, true, 'video');
    END IF;

    -- Course 6.2: Oil & Gas Project Management
    SELECT id INTO v_course_id FROM public.courses WHERE title = 'Oil & Gas Project Management' AND module_id = v_econ_id;
    IF v_course_id IS NULL THEN
        INSERT INTO public.courses (
            id, title, description, category, difficulty_level, phase_requirement, 
            duration_weeks, total_duration_hours, learning_outcomes, instructor_id, 
            module_id, learning_objectives, has_certificate, certificate_program, 
            certificate_title, published, is_published, course_thumbnail_url, 
            created_at, updated_at, total_modules, total_lessons, rating, 
            review_count, enrollment_count, certificate_validity_months
        ) VALUES (
            gen_random_uuid(),
            'Oil & Gas Project Management',
            'Sample data for Oil & Gas Project Management. Managing complex capital projects.',
            'Economics & Project Management',
            'Advanced',
            3,
            6,
            28,
            '["Manage project risks", "Understand stage-gate process"]'::jsonb,
            v_admin_id,
            v_econ_id,
            ARRAY['FEL stages', 'Risk register'],
            true,
            'Professional',
            'Project Management Certificate',
            true,
            true,
            'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=600',
            NOW(),
            NOW(),
            1,
            2,
            4.7,
            100,
            250,
            12
        ) RETURNING id INTO v_course_id;

        INSERT INTO public.course_modules (course_id, title, description, module_order, is_published)
        VALUES (v_course_id, 'Project Lifecycle', 'From concept to close.', 1, true)
        RETURNING id INTO v_section_id;

        INSERT INTO public.course_lessons (
            module_id, course_id, title, description, content, video_url, lesson_order, duration_minutes, is_published, lesson_type
        ) VALUES 
        (v_section_id, v_course_id, 'FEL Stages', 'Front End Loading.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 55, true, 'video'),
        (v_section_id, v_course_id, 'Risk Management', 'Mitigating risks.', 'Text content...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 50, true, 'video');
    END IF;

END $$;

-- =================================================================
-- VERIFICATION QUERIES
-- =================================================================
/*
-- 1. Check Total Counts
SELECT 
    (SELECT COUNT(*) FROM public.modules) as total_modules,
    (SELECT COUNT(*) FROM public.courses) as total_courses,
    (SELECT COUNT(*) FROM public.course_lessons) as total_lessons;

-- 2. Check Breakdown by Module
SELECT 
    m.name as module_name, 
    COUNT(DISTINCT c.id) as course_count
FROM public.modules m
LEFT JOIN public.courses c ON m.id = c.module_id
GROUP BY m.name;

-- 3. Detailed Course Check
SELECT 
    c.title,
    m.name as module,
    c.phase_requirement,
    c.difficulty_level,
    COUNT(cl.id) as lesson_count
FROM public.courses c
JOIN public.modules m ON c.module_id = m.id
LEFT JOIN public.course_lessons cl ON c.id = cl.course_id
GROUP BY c.id, c.title, m.name, c.phase_requirement, c.difficulty_level
ORDER BY m.name, c.title;
*/