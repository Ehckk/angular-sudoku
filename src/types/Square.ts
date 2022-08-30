interface Square { 
	value: number | null
}

interface PlaySquare extends Square {
	invalid: boolean
	locked: boolean
}

export type { Square, PlaySquare }