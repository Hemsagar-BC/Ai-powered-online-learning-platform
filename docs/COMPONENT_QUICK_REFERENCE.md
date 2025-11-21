# 🎨 Component Library - Quick Reference

## ✅ Available Components (27 Total)

### Common/UI Components (17)

#### Form Components
```jsx
import { Button, Input } from '@/components/common'
import { Textarea, Select, Toggle } from '@/components/common'

// Button
<Button variant="primary">Click me</Button>
<Button variant="secondary" size="lg">Large Button</Button>
<Button variant="danger" loading>Deleting...</Button>
<Button variant="ghost" disabled>Disabled</Button>

// Input
<Input type="email" label="Email" placeholder="user@example.com" />
<Input error={true} errorMessage="Invalid input" />

// Textarea
<Textarea label="Comments" rows={5} placeholder="Your thoughts..." />

// Select
<Select 
  label="Category"
  options={[
    { value: 'tech', label: 'Technology' },
    { value: 'design', label: 'Design' }
  ]}
/>

// Toggle
<Toggle checked={isEnabled} onChange={setIsEnabled} label="Enable feature" />
```

#### Container Components
```jsx
import { Card, Modal, Badge } from '@/components/common'

// Card
<Card hover className="p-4">
  Content goes here
</Card>

// Modal
<Modal isOpen={open} onClose={handleClose} title="Confirm">
  Are you sure?
</Modal>

// Badge
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
```

#### Loading & Progress
```jsx
import { Loader, Spinner, SkeletonLoader, Toast } from '@/components/common'
import { ProgressBar, ProgressRing } from '@/components/common'

// Loader
<Loader fullScreen={true} message="Loading..." />

// Spinner
<Spinner size="md" />

// Toast
<Toast message="Success!" type="success" onClose={handleClose} />

// Progress
<ProgressBar progress={75} showLabel={true} />
<ProgressRing progress={60} size={120} />
```

#### Display Components
```jsx
import { Tooltip, Avatar, EmptyState } from '@/components/common'

// Tooltip
<Tooltip text="Edit profile" position="top">
  <button>Edit</button>
</Tooltip>

// Avatar
<Avatar name="John Doe" size="lg" />
<Avatar src="/avatar.jpg" name="Jane" size="md" />

// Empty State
<EmptyState 
  icon="🎓"
  title="No courses yet"
  description="Start learning today"
  action={<Button>Create Course</Button>}
/>
```

---

### Layout Components (3)

```jsx
import { DashboardLayout, PageHeader, Footer } from '@/components/layout'

// Dashboard Layout
<DashboardLayout>
  <PageHeader 
    title="My Courses"
    subtitle="View and manage your courses"
    onBack={() => navigate(-1)}
  />
  <YourContent />
  <Footer />
</DashboardLayout>

// Page Header with breadcrumbs
<PageHeader
  title="Chapter Details"
  breadcrumbs={[
    { label: 'Dashboard', url: '/' },
    { label: 'Courses', url: '/courses' },
    { label: 'Python', url: '/course/1' }
  ]}
  action={<Button>Edit</Button>}
/>
```

---

### Course Components (7)

```jsx
import { 
  CourseCard, CourseGrid, CourseStats,
  ChapterList, ChapterCard, ChapterTimeline, CourseProgress 
} from '@/components/course'

// Course Display
<CourseGrid 
  courses={courses}
  loading={isLoading}
  onCourseClick={handleSelect}
/>

// Individual Card
<CourseCard 
  course={courseData}
  onClick={() => navigate(`/course/${courseData.id}`)}
/>

// Course Stats
<CourseStats course={courseData} />

// Chapter List
<ChapterList 
  chapters={course.chapters}
  currentChapter={activeChapter}
  onChapterSelect={setActiveChapter}
/>

// Chapter Card
<ChapterCard chapter={chapterData} onClick={handleSelect} />

// Timeline
<ChapterTimeline chapters={chapters} currentChapter={2} />

// Progress
<CourseProgress course={courseData} />
```

---

## 📂 File Structure

```
src/components/
├── common/
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── FormComponents.jsx
│   ├── CardModal.jsx
│   ├── Loading.jsx
│   ├── Display.jsx
│   └── index.js ← Import from here
├── layout/
│   ├── DashboardLayout.jsx
│   ├── PageHeader.jsx
│   └── index.js ← Import from here
├── course/
│   ├── CourseCard.jsx
│   ├── ChapterComponents.jsx
│   └── index.js ← Import from here
├── Navbar.jsx ✅
├── Sidebar.jsx ✅
├── CreateCourseModal.jsx ✅
├── Login.jsx ✅
├── QuizModal.jsx ✅
├── StreakWidget.jsx ✅
└── StudyBuddy.jsx ✅
```

---

## 🎯 Component Props Reference

### Button
```jsx
<Button
  variant="primary" | "secondary" | "danger" | "ghost"
  size="sm" | "md" | "lg"
  loading={false}
  disabled={false}
  className=""
  onClick={() => {}}
>
  Text
</Button>
```

### Input
```jsx
<Input
  type="text" | "email" | "password" | ...
  label="Field Label"
  placeholder="Enter value"
  error={false}
  errorMessage="Error text"
  value=""
  onChange={() => {}}
/>
```

### Card
```jsx
<Card
  hover={true}
  className=""
>
  Children
</Card>
```

### Modal
```jsx
<Modal
  isOpen={true}
  onClose={() => {}}
  title="Modal Title"
  size="sm" | "md" | "lg" | "xl"
>
  Content
</Modal>
```

### ProgressBar
```jsx
<ProgressBar
  progress={0}    // 0-100
  showLabel={true}
  color="blue" | "green" | "red" | "yellow"
  size="sm" | "md" | "lg"
/>
```

### CourseCard
```jsx
<CourseCard
  course={{
    id: "123",
    title: "Course Name",
    description: "Description",
    difficulty: "Beginner",
    image: "/image.jpg",
    rating: 4.5,
    students: 150,
    duration: 10
  }}
  onClick={() => {}}
/>
```

---

## 🎨 Styling

All components use **Tailwind CSS** with:
- ✅ Responsive breakpoints (sm, md, lg, xl)
- ✅ Dark mode support (base structure)
- ✅ Hover effects
- ✅ Transitions
- ✅ Focus states
- ✅ Accessibility features

---

## 🔄 Import Patterns

```jsx
// Import multiple from same file
import { Button, Input, Card } from '@/components/common'

// Import from index
import { Button } from '@/components/common'
import { CourseCard } from '@/components/course'

// Import layout
import { DashboardLayout, PageHeader } from '@/components/layout'
```

---

## 💡 Common Usage Examples

### Login Form
```jsx
<Card className="p-6 max-w-md">
  <Input type="email" label="Email" />
  <Input type="password" label="Password" />
  <Button variant="primary" className="w-full mt-4">
    Sign In
  </Button>
</Card>
```

### Loading State
```jsx
{loading ? (
  <Loader message="Loading courses..." />
) : (
  <CourseGrid courses={courses} />
)}
```

### Empty State
```jsx
{courses.length === 0 ? (
  <EmptyState 
    title="No courses"
    action={<Button>Create Course</Button>}
  />
) : (
  <CourseGrid courses={courses} />
)}
```

### Progress Display
```jsx
<div className="space-y-4">
  <ProgressBar progress={75} />
  <ProgressRing progress={60} size={100} />
</div>
```

### Form Validation
```jsx
const [email, setEmail] = useState('')
const [error, setError] = useState(false)

<Input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={error && !email.includes('@')}
  errorMessage="Please enter valid email"
/>
```

---

## ✨ Features

All components include:
- ✅ PropTypes validation
- ✅ Responsive design
- ✅ Accessibility support
- ✅ Error handling
- ✅ Loading states
- ✅ Proper documentation
- ✅ Production-ready code

---

## 📊 Component Count

| Category | Count |
|----------|-------|
| Common/UI | 17 |
| Layout | 3 |
| Course | 7 |
| Existing | 6 |
| **Total** | **33** |

---

## 🚀 Ready for

- ✅ Building pages
- ✅ Creating forms
- ✅ Displaying content
- ✅ User interactions
- ✅ Loading states
- ✅ Error handling
- ✅ Production deployment

---

**Last Updated**: November 21, 2025
**Status**: All Phase 1 & 2 components ready
**Next**: Phase 3 (Quiz, Gamification, Auth)

🎉 **Start building with these components now!**
