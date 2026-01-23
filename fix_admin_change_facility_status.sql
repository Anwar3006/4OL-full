-- ===================================================================
-- FIXED: admin_change_facility_status RPC Function
-- ===================================================================
-- CHANGE: p_media_urls parameter from jsonb to text[]
-- This matches the media_urls column type in facility_profile table
-- ===================================================================

CREATE OR REPLACE FUNCTION admin_change_facility_status(
    p_admin_id text,
    p_facility_id uuid,
    p_new_status facility_status_enum,
    p_media_urls text[] DEFAULT NULL  -- ✅ CHANGED: jsonb → text[]
) RETURNS void AS $$
BEGIN
    -- Set context for activity_logs trigger
    EXECUTE format('SET LOCAL app.current_user_id = %L', p_admin_id);

    UPDATE public.facility_profile
    SET 
        status = p_new_status,
        media_urls = CASE 
            WHEN p_media_urls IS NOT NULL THEN p_media_urls 
            ELSE media_urls 
        END,
        approved_at = CASE WHEN p_new_status = 'active' THEN now() ELSE approved_at END,
        updated_at = now()
    WHERE id = p_facility_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- EXPLANATION:
-- ===================================================================
-- The media_urls column in facility_profile is text[]
-- PostgreSQL requires exact type matching for assignments
-- 
-- Before: p_media_urls jsonb
-- After:  p_media_urls text[]
--
-- This allows direct assignment without type casting
-- ===================================================================

-- ===================================================================
-- TESTING:
-- ===================================================================
-- Test 1: Approve facility with new media URLs
-- SELECT admin_change_facility_status(
--     'admin-id-here',
--     'facility-uuid-here',
--     'active',
--     ARRAY['path1.jpg', 'path2.jpg']
-- );
--
-- Test 2: Reject facility (keep existing media URLs)
-- SELECT admin_change_facility_status(
--     'admin-id-here',
--     'facility-uuid-here',
--     'rejected',
--     NULL
-- );
-- ===================================================================
