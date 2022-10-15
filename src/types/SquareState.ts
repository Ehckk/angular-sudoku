export type SquareState = {
	x: number
	y: number
	mode: 'GENERATE'
	status: {
		locked: boolean
		selected: boolean
		invalid: boolean
	}
	possibleValues: number[]
}