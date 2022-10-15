import { CandidateSquare } from "./CandidateSquare"
import { GenerateState } from "./GenerateState"
import { PlayState } from "./PlayState"
import { Square } from "./Square"

export type BoardState = {
	mode: 'GENERATE',
	squares: Square[][]
	status: GenerateState
	highlightX: number;
	highlightY: number;
} | {
	mode: 'PLAY',
	status: PlayState
	squares: CandidateSquare[][]
	initial: Square[][]
	highlightX: number;
	highlightY: number;
}