import { Button } from "@front/components/ui/button"
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@front/components/ui/card"
import { Link, type LinkOptions } from "@tanstack/react-router"
import { format } from "date-fns"
import { ExternalLink } from "lucide-react"

type Project = {
	name: string
	description: string
	date: Date
	url: LinkOptions["to"]
}

const projects: Project[] = [
	{
		name: "Quiz generator",
		description:
			"An AI-powered quiz generator that creates quizzes based on user-provided topics.",
		date: new Date("2026-06-22"),
		url: "/quiz-generator",
	},
	{
		name: "Sentence translator",
		description:
			"An AI powered tool that helps french users to improve their english skills by generating sentences and asking the user to translate them.",
		date: new Date("2026-06-28"),
		url: "/sentence-translator",
	},
]

export const Projects = () => (
	<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
		{projects.map((project) => (
			<Project key={project.name} project={project} />
		))}
	</div>
)

export const Project = (props: { project: Project }) => (
	<Card>
		<CardHeader>
			<CardTitle>
				{props.project.name} ({format(props.project.date, "MMMM yyyy")})
			</CardTitle>
			<CardDescription>{props.project.description}</CardDescription>
		</CardHeader>
		<CardFooter className="gap-4 mt-auto">
			<Link to={props.project.url}>
				<Button>
					<ExternalLink />
					View Project
				</Button>
			</Link>
		</CardFooter>
	</Card>
)
