-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- DEPARTMENTS POLICIES
-- ============================================================================
CREATE POLICY "Authenticated users can view departments"
  ON public.departments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can create departments"
  ON public.departments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update departments"
  ON public.departments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- DEPARTMENT MEMBERS POLICIES
-- ============================================================================
CREATE POLICY "Users can view members of departments they're in"
  ON public.department_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.department_members dm
      WHERE dm.department_id = department_members.department_id
      AND dm.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage members in their departments"
  ON public.department_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.department_members dm
      WHERE dm.department_id = department_members.department_id
      AND dm.user_id = auth.uid()
      AND dm.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Admins can manage all members"
  ON public.department_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- MESSAGES POLICIES
-- ============================================================================
CREATE POLICY "Users can view messages in departments they're members of"
  ON public.messages FOR SELECT
  USING (
    CASE 
      WHEN is_lobby THEN auth.role() = 'authenticated'
      ELSE EXISTS (
        SELECT 1 FROM public.department_members
        WHERE department_id = messages.department_id
        AND user_id = auth.uid()
      )
    END
  );

CREATE POLICY "Users can insert messages in departments they're members of"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND (
      CASE
        WHEN is_lobby THEN auth.role() = 'authenticated'
        ELSE EXISTS (
          SELECT 1 FROM public.department_members
          WHERE department_id = messages.department_id
          AND user_id = auth.uid()
        )
      END
    )
  );

CREATE POLICY "Users can update their own messages"
  ON public.messages FOR UPDATE
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can delete their own messages"
  ON public.messages FOR DELETE
  USING (sender_id = auth.uid());

-- ============================================================================
-- MESSAGE REACTIONS POLICIES
-- ============================================================================
CREATE POLICY "Users can view reactions on messages they can see"
  ON public.message_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_reactions.message_id
      AND (
        m.is_lobby OR EXISTS (
          SELECT 1 FROM public.department_members
          WHERE department_id = m.department_id
          AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can add reactions to messages"
  ON public.message_reactions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_reactions.message_id
      AND (
        m.is_lobby OR EXISTS (
          SELECT 1 FROM public.department_members
          WHERE department_id = m.department_id
          AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can remove their own reactions"
  ON public.message_reactions FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- ASSIGNMENTS POLICIES
-- ============================================================================
CREATE POLICY "Students can view assignments in their departments"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.department_members
      WHERE department_id = assignments.department_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can create assignments in their departments"
  ON public.assignments FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.department_members
      WHERE department_id = assignments.department_id
      AND user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers can update their assignments"
  ON public.assignments FOR UPDATE
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.department_members
      WHERE department_id = assignments.department_id
      AND user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers can delete their assignments"
  ON public.assignments FOR DELETE
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.department_members
      WHERE department_id = assignments.department_id
      AND user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

-- ============================================================================
-- SUBMISSIONS POLICIES
-- ============================================================================
CREATE POLICY "Students can view their own submissions"
  ON public.submissions FOR SELECT
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.id = submissions.assignment_id
      AND EXISTS (
        SELECT 1 FROM public.department_members
        WHERE department_id = a.department_id
        AND user_id = auth.uid()
        AND role IN ('teacher', 'admin')
      )
    )
  );

CREATE POLICY "Students can insert submissions for their assignments"
  ON public.submissions FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.id = submissions.assignment_id
      AND EXISTS (
        SELECT 1 FROM public.department_members
        WHERE department_id = a.department_id
        AND user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Students can update their own submissions"
  ON public.submissions FOR UPDATE
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- ============================================================================
-- HELP REQUESTS POLICIES
-- ============================================================================
CREATE POLICY "Everyone can view open help requests"
  ON public.help_requests FOR SELECT
  USING (
    status != 'closed'
    OR requester_id = auth.uid()
    OR assigned_to = auth.uid()
  );

CREATE POLICY "Users can create help requests"
  ON public.help_requests FOR INSERT
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update their own help requests"
  ON public.help_requests FOR UPDATE
  USING (requester_id = auth.uid());

-- ============================================================================
-- HELP RESPONSES POLICIES
-- ============================================================================
CREATE POLICY "Everyone can view responses to help requests"
  ON public.help_responses FOR SELECT
  USING (true);

CREATE POLICY "Users can create help responses"
  ON public.help_responses FOR INSERT
  WITH CHECK (helper_id = auth.uid());

-- ============================================================================
-- BADGES POLICIES
-- ============================================================================
CREATE POLICY "Everyone can view badges"
  ON public.badges FOR SELECT
  USING (true);

-- ============================================================================
-- USER BADGES POLICIES
-- ============================================================================
CREATE POLICY "Users can view their own badges"
  ON public.user_badges FOR SELECT
  USING (user_id = auth.uid() OR true);

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================================================
-- ANNOUNCEMENTS POLICIES
-- ============================================================================
CREATE POLICY "Users can view announcements in departments they're in"
  ON public.announcements FOR SELECT
  USING (
    is_global
    OR EXISTS (
      SELECT 1 FROM public.department_members
      WHERE department_id = announcements.department_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can create announcements in their departments"
  ON public.announcements FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND (
      is_global OR EXISTS (
        SELECT 1 FROM public.department_members
        WHERE department_id = announcements.department_id
        AND user_id = auth.uid()
        AND role IN ('teacher', 'admin')
      )
    )
  );

CREATE POLICY "Teachers can update announcements"
  ON public.announcements FOR UPDATE
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.department_members
      WHERE department_id = announcements.department_id
      AND user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );
