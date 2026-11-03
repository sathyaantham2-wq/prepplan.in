import { createFileRoute } from '@tanstack/react-router'
import { PaperBuilder } from '../../../../components/school/paper-builder'

// The paper builder: choose, swap, lock and order the questions of a paper (docs/SCHOOLS_MODULE_PLAN.md section 16).
export const Route = createFileRoute('/school/$schoolId/exams/build/$examId')({
  component: Build,
})

function Build() {
  const { examId } = Route.useParams()
  return <PaperBuilder examId={examId} />
}
