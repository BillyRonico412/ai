// Import the generated route tree
import { routeTree } from "@front/routeTree.gen"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import "@front/index.css"
import { ThemeProvider } from "@front/components/theme-provider"

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

// Render the app
const rootElement = document.getElementById("root") as HTMLElement
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<StrictMode>
			<ThemeProvider>
				<RouterProvider router={router} />
			</ThemeProvider>
		</StrictMode>,
	)
}
