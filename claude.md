# Claude Code Instructions

## Project Context

This is a tide tracking mobile app built with Expo/React Native. The app displays tide information for various beach locations with a minimalistic, calming UI featuring animated waves and tide data.

## Primary Workflow

When I ask you to work on issues, follow this process:

### 1. Check Open Issues

- Look for open issues in the GitHub repository
- Read through the issue descriptions, labels, and any comments
- Prioritize issues based on labels (e.g., `bug`, `enhancement`, `good first issue`)

### 2. Issue Selection

- If I don't specify an issue, ask me which one to work on
- Confirm the issue number and requirements before starting
- Check if the issue has any related issues or dependencies

### 3. Implementation

- Create a new branch named: `issue-{number}-{brief-description}`
- Implement the fix or feature described in the issue
- Follow the existing code style and patterns in the project
- Test the changes on both iOS and Android if applicable
- Ensure the app runs without errors: `npx expo start`

### 4. Code Quality

- Write clean, maintainable code
- Add comments for complex logic
- Use TypeScript types where applicable
- Ensure animations remain performant
- Keep the minimalistic design aesthetic

### 5. Testing

- Test on web: `npx expo start --web`
- Test on Android emulator if available
- Verify the fix actually resolves the issue
- Check for any regressions in existing functionality

### 6. Completion

- Commit changes with a clear message: `Fix #[issue-number]: [description]`
- Suggest creating a pull request with details
- Update the issue with progress or questions if needed

## Code Style Guidelines

- Use functional components with hooks
- Prefer React Native Reanimated 2 for animations
- Keep components small and focused
- Use descriptive variable names
- Follow existing naming conventions

## Common Commands

```bash
# Start development server
npx expo start

# Run on web
npx expo start --web

# Clear cache if needed
npx expo start --clear

# Check for issues
npx expo-doctor
```

## When Stuck

- If an issue is unclear, ask me for clarification
- If you need additional context about the app's behavior, ask
- If multiple approaches are possible, present options
- If you encounter errors, share them and suggest solutions

## Communication

- Keep me updated on progress
- Ask questions if requirements are ambiguous
- Explain your approach before implementing complex changes
- Suggest improvements to issues if you spot better solutions
