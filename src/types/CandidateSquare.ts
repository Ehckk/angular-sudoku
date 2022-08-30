import { Square } from "./Square"

interface CandidateSquare extends Square {
	locked: boolean
	invalid?: boolean
	possibleValues?: []
}

export { CandidateSquare }