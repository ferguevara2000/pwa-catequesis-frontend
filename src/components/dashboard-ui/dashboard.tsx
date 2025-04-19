import ProtectedRoute from "../ProtectedRoute"
import Content from "./content"
import Layout from "./layout"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Layout>
        <Content />
      </Layout>
    </ProtectedRoute>
  )
}
