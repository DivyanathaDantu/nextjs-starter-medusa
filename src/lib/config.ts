import Medusa from "@medusajs/medusa-js"
import { QueryClient } from "react-query"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24,
      retry: 1,
    },
  },
})
const api_token = process.env.NEXT_PUBLIC_MEDUSA_ADMIN_API_TOKEN;
const medusaClient = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3, apiKey: `${api_token}`})

export { MEDUSA_BACKEND_URL, queryClient, medusaClient }
