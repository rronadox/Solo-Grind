import fs from 'fs';
import path from 'path';

// List of files to update
const filesToUpdate = [
  'client/src/pages/achievements.tsx',
  'client/src/pages/home.tsx',
  'client/src/pages/profile.tsx',
  'client/src/pages/quests.tsx',
  'client/src/components/modals/PunishmentModal.tsx',
  'client/src/components/modals/TaskDetailModal.tsx',
  'client/src/components/modals/CreateTaskModal.tsx',
  'client/src/components/tasks/TaskDetailScreen.tsx',
  'client/src/components/home/ProgressBar.tsx',
  'client/src/components/home/AISuggested.tsx',
  'client/src/components/home/ActiveQuests.tsx',
  'client/src/components/home/DailyChallenge.tsx',
  'client/src/components/home/DailyStats.tsx',
  'client/src/components/home/UserStatusBar.tsx'
];

// Process each file
filesToUpdate.forEach(filePath => {
  try {
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace import statement
    content = content.replace(
      /import\s+{\s*useAirtable\s*}\s+from\s+['"]@\/hooks\/useAirtable['"];?/g,
      `import { useApi } from '@/hooks/useApi';`
    );
    
    // Replace hook usage
    content = content.replace(/useAirtable\(\)/g, 'useApi()');
    
    // Write updated content back to file
    fs.writeFileSync(filePath, content);
    
    console.log(`Updated: ${filePath}`);
  } catch (err) {
    console.error(`Error updating ${filePath}:`, err);
  }
});

console.log('All files updated successfully!');