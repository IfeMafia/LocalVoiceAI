-- Allow anyone to insert messages (for guest users)
-- In a real production app, you might want to restrict this to valid conversation IDs
DROP POLICY IF EXISTS "Allow public message insertion" ON messages;
CREATE POLICY "Allow public message insertion" 
ON messages FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view messages (for guest users)
-- In a real production app, restrict this to users who are part of the conversation
DROP POLICY IF EXISTS "Allow public message selection" ON messages;
CREATE POLICY "Allow public message selection" 
ON messages FOR SELECT 
USING (true);

-- Also ensure conversations are selectable by public if they are for guest users
DROP POLICY IF EXISTS "Allow public conversation selection" ON conversations;
CREATE POLICY "Allow public conversation selection" 
ON conversations FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow public conversation update" ON conversations;
CREATE POLICY "Allow public conversation update" 
ON conversations FOR UPDATE 
USING (true);
